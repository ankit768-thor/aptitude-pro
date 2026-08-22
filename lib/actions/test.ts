"use server";

import { createClient } from "@/lib/supabase/server";
import { upsertTopicStats } from "@/lib/actions/topicStats";
import {
  getModeConfig,
  difficultyMix,
  difficultyCounts,
  sectionTargets,
  type CompanySectionLike,
} from "@/lib/algorithms/testAssembly";
import { scoreAttempt, type ScoredAnswer } from "@/lib/algorithms/scoring";
import type { Difficulty, QuestionOption, Subject, TestMode } from "@/lib/types/database";

interface CandidateQuestion {
  id: string;
  topic_id: string;
  difficulty: Difficulty;
  topics: { subject: string };
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Picks up to targetCount questions for one subject, respecting the given
// difficulty mix where the pool allows, and gracefully backfilling from
// any difficulty in the same subject if a bucket is short — the seeded
// bank is small enough that strict-ratio sampling would otherwise fail.
async function pickQuestionsForSubject(
  supabase: Awaited<ReturnType<typeof createClient>>,
  subject: Subject,
  companyId: string | undefined,
  targetCount: number,
  mix: ReturnType<typeof difficultyMix>,
): Promise<CandidateQuestion[]> {
  let query = supabase
    .from("questions")
    .select("id, topic_id, difficulty, topics(subject)")
    .limit(300);

  query = companyId ? query.or(`company_id.eq.${companyId},company_id.is.null`) : query.is("company_id", null);

  const { data, error } = await query;
  if (error) throw error;

  const pool = ((data ?? []) as unknown as CandidateQuestion[]).filter((q) => q.topics?.subject === subject);
  if (pool.length === 0 || targetCount === 0) return [];

  const counts = difficultyCounts(targetCount, mix);
  const buckets: Record<Difficulty, CandidateQuestion[]> = {
    easy: shuffle(pool.filter((q) => q.difficulty === "easy")),
    medium: shuffle(pool.filter((q) => q.difficulty === "medium")),
    hard: shuffle(pool.filter((q) => q.difficulty === "hard")),
  };

  const picked: CandidateQuestion[] = [];
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

export interface StartTestInput {
  mode: TestMode;
  companyId?: string;
}

export async function startTest(input: StartTestInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  let sections: CompanySectionLike[] | undefined;
  let companyDifficulty: Difficulty | undefined;
  let companyName = "";

  if (input.companyId) {
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("name, difficulty")
      .eq("id", input.companyId)
      .single();
    if (companyError) throw companyError;
    companyDifficulty = company.difficulty;
    companyName = company.name;

    const { data: sectionRows, error: sectionsError } = await supabase
      .from("company_sections")
      .select("topic_subject, weight_pct, typical_question_count, typical_time_minutes")
      .eq("company_id", input.companyId);
    if (sectionsError) throw sectionsError;
    sections = sectionRows ?? [];
  }

  if (input.mode === "full_assessment") {
    if (!input.companyId) throw new Error("Full Assessment requires a target company");
  }

  const modeConfig = getModeConfig(input.mode, sections);
  const mix = difficultyMix(companyDifficulty);
  const targets = sectionTargets(input.mode, modeConfig.questionCount, sections);

  const picks = await Promise.all(
    targets.map((t) => pickQuestionsForSubject(supabase, t.subject, input.companyId, t.targetCount, mix)),
  );
  const allPicked = shuffle(picks.flat());

  if (allPicked.length === 0) {
    throw new Error("No questions are available for this test configuration yet.");
  }

  const title =
    input.mode === "quick"
      ? "Quick Test"
      : input.mode === "sectional"
        ? "Sectional Test"
        : input.mode === "company_mock"
          ? companyName
            ? `${companyName} Mock`
            : "Company Mock"
          : `${companyName} Full Assessment`;

  const { data: test, error: testError } = await supabase
    .from("tests")
    .insert({
      user_id: user.id,
      mode: input.mode,
      company_id: input.companyId ?? null,
      title,
      question_count: allPicked.length,
      time_limit_minutes: modeConfig.timeLimitMinutes,
      negative_marking: modeConfig.negativeMarking,
      negative_marking_value: modeConfig.negativeMarkingValue,
    })
    .select()
    .single();
  if (testError) throw testError;

  const { error: tqError } = await supabase
    .from("test_questions")
    .insert(allPicked.map((q, i) => ({ test_id: test.id, question_id: q.id, position: i })));
  if (tqError) throw tqError;

  const { data: attempt, error: attemptError } = await supabase
    .from("attempts")
    .insert({ user_id: user.id, test_id: test.id, status: "in_progress" })
    .select()
    .single();
  if (attemptError) throw attemptError;

  return { attemptId: attempt.id };
}

export interface RunnerQuestion {
  id: string;
  topicId: string;
  subject: Subject;
  questionText: string;
  options: QuestionOption[];
  position: number;
  selectedOptionKey: string | null;
  isMarkedForReview: boolean;
}

export interface RunnerData {
  attemptId: string;
  status: "in_progress" | "completed" | "abandoned";
  mode: TestMode;
  title: string;
  timeLimitMinutes: number | null;
  testEndsAt: number | null; // epoch ms, null if untimed
  negativeMarking: boolean;
  questions: RunnerQuestion[];
}

// Never sends correct_option_key/explanation to the client during a timed
// test — grading happens server-side in saveAnswer/submitTest.
export async function getAttemptForRunner(attemptId: string): Promise<RunnerData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: attemptRaw, error: attemptError } = await supabase
    .from("attempts")
    .select("*, tests(*)")
    .eq("id", attemptId)
    .eq("user_id", user.id)
    .single();
  if (attemptError) throw attemptError;

  // Relation embedding (tests(*)) isn't represented in our hand-written
  // Database type's Relationships metadata, so cast once at the boundary.
  const attempt = attemptRaw as unknown as {
    id: string;
    status: "in_progress" | "completed" | "abandoned";
    started_at: string;
    tests: { id: string; mode: TestMode; title: string; time_limit_minutes: number | null; negative_marking: boolean };
  };
  const test = attempt.tests;

  const { data: tqRows, error: tqError } = await supabase
    .from("test_questions")
    .select("position, questions(id, topic_id, question_text, options, topics(subject))")
    .eq("test_id", test.id)
    .order("position");
  if (tqError) throw tqError;

  const { data: answerRows, error: answersError } = await supabase
    .from("attempt_answers")
    .select("question_id, selected_option_key, is_marked_for_review")
    .eq("attempt_id", attemptId);
  if (answersError) throw answersError;

  const answerByQuestion = new Map((answerRows ?? []).map((a) => [a.question_id, a]));

  type TqRow = { position: number; questions: { id: string; topic_id: string; question_text: string; options: QuestionOption[]; topics: { subject: Subject } } };
  const questions: RunnerQuestion[] = ((tqRows ?? []) as unknown as TqRow[]).map((row) => {
    const existing = answerByQuestion.get(row.questions.id);
    return {
      id: row.questions.id,
      topicId: row.questions.topic_id,
      subject: row.questions.topics.subject,
      questionText: row.questions.question_text,
      options: row.questions.options,
      position: row.position,
      selectedOptionKey: existing?.selected_option_key ?? null,
      isMarkedForReview: existing?.is_marked_for_review ?? false,
    };
  });

  const startedAtMs = new Date(attempt.started_at).getTime();
  const testEndsAt = test.time_limit_minutes ? startedAtMs + test.time_limit_minutes * 60_000 : null;

  return {
    attemptId: attempt.id,
    status: attempt.status,
    mode: test.mode,
    title: test.title,
    timeLimitMinutes: test.time_limit_minutes,
    testEndsAt,
    negativeMarking: test.negative_marking,
    questions,
  };
}

export interface SaveAnswerInput {
  attemptId: string;
  questionId: string;
  selectedOptionKey: string | null;
  isMarkedForReview: boolean;
  timeSpentSeconds: number;
}

export async function saveAnswer(input: SaveAnswerInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: question, error: questionError } = await supabase
    .from("questions")
    .select("topic_id, correct_option_key")
    .eq("id", input.questionId)
    .single();
  if (questionError) throw questionError;

  const { data: existing } = await supabase
    .from("attempt_answers")
    .select("selected_option_key")
    .eq("attempt_id", input.attemptId)
    .eq("question_id", input.questionId)
    .maybeSingle();
  const isFirstAnswer = input.selectedOptionKey !== null && !existing?.selected_option_key;

  const isCorrect = input.selectedOptionKey ? input.selectedOptionKey === question.correct_option_key : null;

  const { error } = await supabase.from("attempt_answers").upsert(
    {
      attempt_id: input.attemptId,
      question_id: input.questionId,
      selected_option_key: input.selectedOptionKey,
      is_correct: isCorrect,
      is_marked_for_review: input.isMarkedForReview,
      time_spent_seconds: input.timeSpentSeconds,
      answered_at: input.selectedOptionKey ? new Date().toISOString() : null,
    },
    { onConflict: "attempt_id,question_id" },
  );
  if (error) throw error;

  // Only count toward user_topic_stats the first time this question gets a
  // real answer in this attempt — later revisions (changing an answer,
  // re-saving time) would otherwise inflate questions_attempted.
  if (isFirstAnswer) {
    await upsertTopicStats(supabase, user.id, question.topic_id, isCorrect === true, input.timeSpentSeconds);
  }

  return { ok: true };
}

export async function submitTest(attemptId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: attemptRaw, error: attemptError } = await supabase
    .from("attempts")
    .select("*, tests(negative_marking, negative_marking_value)")
    .eq("id", attemptId)
    .eq("user_id", user.id)
    .single();
  if (attemptError) throw attemptError;
  const attempt = attemptRaw as unknown as { status: string; started_at: string };
  if (attempt.status === "completed") return { ok: true };

  const timeSpentSeconds = Math.max(0, Math.round((Date.now() - new Date(attempt.started_at).getTime()) / 1000));

  const { error: updateError } = await supabase
    .from("attempts")
    .update({ status: "completed", submitted_at: new Date().toISOString(), time_spent_seconds: timeSpentSeconds })
    .eq("id", attemptId);
  if (updateError) throw updateError;

  return { ok: true };
}

export interface ResultData {
  attemptId: string;
  title: string;
  mode: TestMode;
  score: ReturnType<typeof scoreAttempt>;
}

export async function getResult(attemptId: string): Promise<ResultData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: attemptRaw, error: attemptError } = await supabase
    .from("attempts")
    .select("*, tests(title, mode, negative_marking, negative_marking_value)")
    .eq("id", attemptId)
    .eq("user_id", user.id)
    .single();
  if (attemptError) throw attemptError;

  const attempt = attemptRaw as unknown as {
    test_id: string;
    tests: { title: string; mode: TestMode; negative_marking: boolean; negative_marking_value: number | null };
  };
  const test = attempt.tests;

  const { data: tqRows, error: tqError } = await supabase
    .from("test_questions")
    .select("questions(id, topics(subject))")
    .eq("test_id", attempt.test_id);
  if (tqError) throw tqError;

  const { data: answerRows, error: answersError } = await supabase
    .from("attempt_answers")
    .select("question_id, selected_option_key, is_correct, time_spent_seconds")
    .eq("attempt_id", attemptId);
  if (answersError) throw answersError;

  const answerByQuestion = new Map((answerRows ?? []).map((a) => [a.question_id, a]));

  type TqRow = { questions: { id: string; topics: { subject: Subject } } };
  const scoredAnswers: ScoredAnswer[] = ((tqRows ?? []) as unknown as TqRow[]).map((row) => {
    const a = answerByQuestion.get(row.questions.id);
    return {
      questionId: row.questions.id,
      subject: row.questions.topics.subject,
      selectedOptionKey: a?.selected_option_key ?? null,
      isCorrect: a?.is_correct ?? null,
      timeSpentSeconds: a?.time_spent_seconds ?? 0,
    };
  });

  const score = scoreAttempt(scoredAnswers, test.negative_marking, test.negative_marking_value ?? 0);

  return { attemptId, title: test.title, mode: test.mode, score };
}
