"use server";

import { createClient } from "@/lib/supabase/server";
import { upsertTopicStats } from "@/lib/actions/topicStats";
import type { Difficulty, QuestionOption } from "@/lib/types/database";

export interface PracticeFilters {
  subject?: string;
  companyId?: string;
  difficulty?: Difficulty;
  count?: number;
}

export interface PracticeQuestion {
  id: string;
  question_text: string;
  options: QuestionOption[];
  correct_option_key: string;
  explanation: string;
  shortcut: string | null;
  concept: string | null;
  exam_tip: string | null;
  difficulty: Difficulty;
  topic_id: string;
  topic_name: string;
}

// Starts an untimed practice session: assembles a small question set matching
// the filters, and creates the tests/test_questions/attempts rows so answers
// can be logged the same way a mock-test attempt would be (single code path
// for scoring/stats, per the plan's schema design).
export async function startPracticeSession(filters: PracticeFilters) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const count = filters.count ?? 10;

  let query = supabase
    .from("questions")
    .select("id, question_text, options, correct_option_key, explanation, shortcut, concept, exam_tip, difficulty, topic_id, topics(name, subject)");

  if (filters.companyId) query = query.eq("company_id", filters.companyId);
  if (filters.difficulty) query = query.eq("difficulty", filters.difficulty);

  const { data: candidates, error } = await query.limit(200);
  if (error) throw error;

  // Relation embedding (topics(name, subject)) isn't represented in our
  // hand-written Database type's Relationships metadata, so the row shape
  // comes back untyped here — cast once, at the query boundary.
  const rows = (candidates ?? []) as unknown as (PracticeQuestion & {
    topics: { name: string; subject: string };
  })[];

  const pool = rows.filter((q) => (filters.subject ? q.topics?.subject === filters.subject : true));
  const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, count);

  if (shuffled.length === 0) {
    return { attemptId: null, questions: [] as PracticeQuestion[] };
  }

  const { data: test, error: testError } = await supabase
    .from("tests")
    .insert({
      user_id: user.id,
      mode: "topic_practice",
      company_id: filters.companyId ?? null,
      title: "Practice session",
      question_count: shuffled.length,
      time_limit_minutes: null,
      negative_marking: false,
    })
    .select()
    .single();
  if (testError) throw testError;

  const { error: tqError } = await supabase.from("test_questions").insert(
    shuffled.map((q, i) => ({ test_id: test.id, question_id: q.id, position: i })),
  );
  if (tqError) throw tqError;

  const { data: attempt, error: attemptError } = await supabase
    .from("attempts")
    .insert({ user_id: user.id, test_id: test.id, status: "in_progress" })
    .select()
    .single();
  if (attemptError) throw attemptError;

  const questions: PracticeQuestion[] = shuffled.map((row) => ({
    id: row.id,
    question_text: row.question_text,
    options: row.options,
    correct_option_key: row.correct_option_key,
    explanation: row.explanation,
    shortcut: row.shortcut,
    concept: row.concept,
    exam_tip: row.exam_tip,
    difficulty: row.difficulty,
    topic_id: row.topic_id,
    topic_name: row.topics?.name ?? "",
  }));

  return { attemptId: attempt.id, questions };
}

export async function submitPracticeAnswer(input: {
  attemptId: string;
  questionId: string;
  topicId: string;
  selectedKey: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("attempt_answers").upsert(
    {
      attempt_id: input.attemptId,
      question_id: input.questionId,
      selected_option_key: input.selectedKey,
      is_correct: input.isCorrect,
      time_spent_seconds: input.timeSpentSeconds,
      answered_at: new Date().toISOString(),
    },
    { onConflict: "attempt_id,question_id" },
  );
  if (error) throw error;

  await upsertTopicStats(supabase, user.id, input.topicId, input.isCorrect, input.timeSpentSeconds);

  return { ok: true };
}

export async function finishPracticeSession(attemptId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("attempts")
    .update({ status: "completed", submitted_at: new Date().toISOString() })
    .eq("id", attemptId);
  if (error) throw error;
  return { ok: true };
}
