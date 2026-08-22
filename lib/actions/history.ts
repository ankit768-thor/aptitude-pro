"use server";

import { createClient } from "@/lib/supabase/server";
import { scoreAttempt, type ScoredAnswer } from "@/lib/algorithms/scoring";
import type { Subject, TestMode } from "@/lib/types/database";

export interface HistoryEntry {
  attemptId: string;
  date: string;
  title: string;
  mode: TestMode;
  companyName: string | null;
  score: number;
  accuracy: number;
  timeSpentSeconds: number | null; // total wall-clock time for the whole attempt
  avgTimeSecondsPerQuestion: number;
}

export async function getAttemptHistory(): Promise<HistoryEntry[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: attempts, error: attemptsError } = await supabase
    .from("attempts")
    .select("id, test_id, submitted_at, time_spent_seconds, tests(title, mode, negative_marking, negative_marking_value, companies(name))")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("submitted_at", { ascending: false });
  if (attemptsError) throw attemptsError;

  type AttemptRow = {
    id: string;
    test_id: string;
    submitted_at: string | null;
    time_spent_seconds: number | null;
    tests: { title: string; mode: TestMode; negative_marking: boolean; negative_marking_value: number | null; companies: { name: string } | null };
  };
  const rows = (attempts ?? []) as unknown as AttemptRow[];
  if (rows.length === 0) return [];

  const attemptIds = rows.map((r) => r.id);
  const testIds = Array.from(new Set(rows.map((r) => r.test_id)));

  // The full assigned question set per test — needed so unanswered
  // questions correctly count as "skipped" (attempt_answers alone only has
  // rows for questions the user actually touched).
  const { data: tqRows, error: tqError } = await supabase
    .from("test_questions")
    .select("test_id, question_id, questions(topics(subject))")
    .in("test_id", testIds);
  if (tqError) throw tqError;

  type TqRow = { test_id: string; question_id: string; questions: { topics: { subject: Subject } } };
  const questionsByTest = new Map<string, TqRow[]>();
  for (const tq of (tqRows ?? []) as unknown as TqRow[]) {
    const list = questionsByTest.get(tq.test_id) ?? [];
    list.push(tq);
    questionsByTest.set(tq.test_id, list);
  }

  const { data: answers, error: answersError } = await supabase
    .from("attempt_answers")
    .select("attempt_id, question_id, selected_option_key, is_correct, time_spent_seconds")
    .in("attempt_id", attemptIds);
  if (answersError) throw answersError;

  type AnswerRow = {
    attempt_id: string;
    question_id: string;
    selected_option_key: string | null;
    is_correct: boolean | null;
    time_spent_seconds: number;
  };
  const answerByAttemptQuestion = new Map<string, AnswerRow>();
  for (const a of (answers ?? []) as unknown as AnswerRow[]) {
    answerByAttemptQuestion.set(`${a.attempt_id}:${a.question_id}`, a);
  }

  return rows.map((r) => {
    const testQuestions = questionsByTest.get(r.test_id) ?? [];
    const scoredAnswers: ScoredAnswer[] = testQuestions.map((tq) => {
      const a = answerByAttemptQuestion.get(`${r.id}:${tq.question_id}`);
      return {
        questionId: tq.question_id,
        subject: tq.questions.topics.subject,
        selectedOptionKey: a?.selected_option_key ?? null,
        isCorrect: a?.is_correct ?? null,
        timeSpentSeconds: a?.time_spent_seconds ?? 0,
      };
    });
    const scored = scoreAttempt(scoredAnswers, r.tests.negative_marking, r.tests.negative_marking_value ?? 0);
    return {
      attemptId: r.id,
      date: r.submitted_at ?? "",
      title: r.tests.title,
      mode: r.tests.mode,
      companyName: r.tests.companies?.name ?? null,
      score: scored.score,
      accuracy: scored.accuracy,
      timeSpentSeconds: r.time_spent_seconds,
      avgTimeSecondsPerQuestion: scored.avgTimeSeconds,
    };
  });
}
