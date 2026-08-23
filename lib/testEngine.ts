import { supabase } from "@/lib/supabase/client";
import {
  getModeConfig,
  difficultyMix,
  difficultyCounts,
  sectionTargets,
  type CompanySectionLike,
} from "@/lib/algorithms/testAssembly";
import { SUBJECT_LABELS } from "@/lib/constants";
import type { Difficulty, QuestionOption, Subject, TestMode } from "@/lib/types/database";

export interface TestQuestion {
  id: string;
  subject: Subject;
  topicName: string;
  questionText: string;
  options: QuestionOption[];
  correctOptionKey: string;
  explanation: string;
  shortcut: string | null;
  concept: string | null;
  examTip: string | null;
  difficulty: Difficulty;
}

interface CandidateRow {
  id: string;
  question_text: string;
  options: QuestionOption[];
  correct_option_key: string;
  explanation: string;
  shortcut: string | null;
  concept: string | null;
  exam_tip: string | null;
  difficulty: Difficulty;
  topics: { name: string; subject: Subject };
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

async function pickQuestionsForSubject(
  subject: Subject,
  companyId: string | undefined,
  targetCount: number,
  mix: ReturnType<typeof difficultyMix>,
): Promise<CandidateRow[]> {
  let query = supabase
    .from("questions")
    .select("id, question_text, options, correct_option_key, explanation, shortcut, concept, exam_tip, difficulty, topics(name, subject)")
    .limit(300);
  query = companyId ? query.or(`company_id.eq.${companyId},company_id.is.null`) : query.is("company_id", null);

  const { data, error } = await query;
  if (error) throw error;

  const pool = ((data ?? []) as unknown as CandidateRow[]).filter((q) => q.topics?.subject === subject);
  if (pool.length === 0 || targetCount === 0) return [];

  const counts = difficultyCounts(targetCount, mix);
  const buckets: Record<Difficulty, CandidateRow[]> = {
    easy: shuffle(pool.filter((q) => q.difficulty === "easy")),
    medium: shuffle(pool.filter((q) => q.difficulty === "medium")),
    hard: shuffle(pool.filter((q) => q.difficulty === "hard")),
  };

  const picked: CandidateRow[] = [];
  const pickedIds = new Set<string>();
  (["easy", "medium", "hard"] as Difficulty[]).forEach((d) => {
    for (const q of buckets[d].slice(0, counts[d])) {
      picked.push(q);
      pickedIds.add(q.id);
    }
  });

  if (picked.length < targetCount) {
    const leftover = shuffle(pool.filter((q) => !pickedIds.has(q.id)));
    for (const q of leftover) {
      if (picked.length >= targetCount) break;
      picked.push(q);
    }
  }

  return picked.slice(0, targetCount);
}

export interface AssembledTest {
  title: string;
  timeLimitMinutes: number;
  negativeMarking: boolean;
  negativeMarkingValue: number | null;
  questions: TestQuestion[];
}

export async function assembleTest(
  mode: TestMode,
  companyId?: string,
  subject?: Subject,
): Promise<AssembledTest> {
  let sections: CompanySectionLike[] | undefined;
  let companyDifficulty: Difficulty | undefined;
  let companyName = "";

  if (companyId) {
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("name, difficulty")
      .eq("id", companyId)
      .single();
    if (companyError) throw companyError;
    companyDifficulty = company.difficulty;
    companyName = company.name;

    const { data: sectionRows, error: sectionsError } = await supabase
      .from("company_sections")
      .select("topic_subject, weight_pct, typical_question_count, typical_time_minutes")
      .eq("company_id", companyId);
    if (sectionsError) throw sectionsError;
    sections = sectionRows ?? [];
  }

  if (mode === "full_assessment" && !companyId) {
    throw new Error("Full Assessment requires a target company");
  }

  const modeConfig = getModeConfig(mode, sections);
  const mix = difficultyMix(companyDifficulty);
  const targets = sectionTargets(mode, modeConfig.questionCount, sections, subject);

  const picks = await Promise.all(targets.map((t) => pickQuestionsForSubject(t.subject, companyId, t.targetCount, mix)));
  const allPicked = shuffle(picks.flat());
  if (allPicked.length === 0) {
    throw new Error("No questions are available for this test configuration yet.");
  }

  const questions: TestQuestion[] = allPicked.map((q) => ({
    id: q.id,
    subject: q.topics.subject,
    topicName: q.topics.name,
    questionText: q.question_text,
    options: q.options,
    correctOptionKey: q.correct_option_key,
    explanation: q.explanation,
    shortcut: q.shortcut,
    concept: q.concept,
    examTip: q.exam_tip,
    difficulty: q.difficulty,
  }));

  const subjectLabel = subject ? SUBJECT_LABELS[subject] : "";
  const title =
    mode === "quick"
      ? subjectLabel ? `${subjectLabel} Quick Test` : "Quick Test"
      : mode === "sectional"
        ? subjectLabel ? `${subjectLabel} Test` : "Sectional Test"
        : mode === "company_mock"
          ? companyName
            ? `${companyName} Mock`
            : subjectLabel
              ? `${subjectLabel} Full Test`
              : "Full Test"
          : `${companyName} Full Assessment`;

  return {
    title,
    timeLimitMinutes: modeConfig.timeLimitMinutes,
    negativeMarking: modeConfig.negativeMarking,
    negativeMarkingValue: modeConfig.negativeMarkingValue,
    questions,
  };
}

// Builds a test from an exact, pre-partitioned set of question IDs (see
// lib/testBank.ts) — used by the mutually-exclusive numbered tests, as
// opposed to assembleTest()'s random resampling.
export async function assembleTestFromIds(questionIds: string[], title: string): Promise<AssembledTest> {
  const { data, error } = await supabase
    .from("questions")
    .select("id, question_text, options, correct_option_key, explanation, shortcut, concept, exam_tip, difficulty, topics(name, subject)")
    .in("id", questionIds);
  if (error) throw error;

  const byId = new Map(((data ?? []) as unknown as CandidateRow[]).map((q) => [q.id, q]));
  const ordered = questionIds.map((id) => byId.get(id)).filter((q): q is CandidateRow => Boolean(q));

  const questions: TestQuestion[] = ordered.map((q) => ({
    id: q.id,
    subject: q.topics.subject,
    topicName: q.topics.name,
    questionText: q.question_text,
    options: q.options,
    correctOptionKey: q.correct_option_key,
    explanation: q.explanation,
    shortcut: q.shortcut,
    concept: q.concept,
    examTip: q.exam_tip,
    difficulty: q.difficulty,
  }));

  return {
    title,
    timeLimitMinutes: questionIds.length, // ~1 min/question, matching Quick/Sectional pacing
    negativeMarking: false,
    negativeMarkingValue: null,
    questions,
  };
}
