"use server";

import { createClient } from "@/lib/supabase/server";
import { getAttemptHistory } from "@/lib/actions/history";
import { getReadinessDashboard } from "@/lib/actions/readiness";
import type { Difficulty } from "@/lib/types/database";

export interface DailyPoint {
  date: string; // YYYY-MM-DD
  value: number;
}

export interface TopicPerformancePoint {
  topicName: string;
  accuracyPct: number;
  questionsAttempted: number;
}

export interface CompanyReadinessPoint {
  name: string;
  overallPct: number;
}

export interface DifficultyPerformancePoint {
  difficulty: Difficulty;
  accuracyPct: number;
  attempted: number;
}

export interface AnalyticsData {
  accuracyOverTime: DailyPoint[];
  speedOverTime: DailyPoint[];
  topicPerformance: TopicPerformancePoint[];
  companyReadiness: CompanyReadinessPoint[];
  difficultyPerformance: DifficultyPerformancePoint[];
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const [history, readiness, topicStatsRaw, difficultyRows] = await Promise.all([
    getAttemptHistory(),
    getReadinessDashboard(),
    supabase.from("user_topic_stats").select("questions_attempted, questions_correct, topics(name)").eq("user_id", user.id),
    supabase
      .from("attempt_answers")
      .select("is_correct, selected_option_key, questions(difficulty)")
      .not("selected_option_key", "is", null),
  ]);

  const cutoff = Date.now() - THIRTY_DAYS_MS;
  const recent = history.filter((h) => h.date && new Date(h.date).getTime() >= cutoff).reverse();

  const accuracyOverTime: DailyPoint[] = recent.map((h) => ({ date: h.date.slice(0, 10), value: h.accuracy }));
  const speedOverTime: DailyPoint[] = recent
    .filter((h) => h.avgTimeSecondsPerQuestion > 0)
    .map((h) => ({ date: h.date.slice(0, 10), value: h.avgTimeSecondsPerQuestion }));

  type TopicStatRow = { questions_attempted: number; questions_correct: number; topics: { name: string } };
  const topicStats = (topicStatsRaw.data ?? []) as unknown as TopicStatRow[];
  const topicPerformance: TopicPerformancePoint[] = topicStats
    .filter((t) => t.questions_attempted > 0)
    .map((t) => ({
      topicName: t.topics.name,
      accuracyPct: Math.round((t.questions_correct / t.questions_attempted) * 100),
      questionsAttempted: t.questions_attempted,
    }))
    .sort((a, b) => b.questionsAttempted - a.questionsAttempted);

  const companyReadiness: CompanyReadinessPoint[] = readiness.companies.map((c) => ({ name: c.name, overallPct: c.overallPct }));

  type DifficultyRow = { is_correct: boolean | null; questions: { difficulty: Difficulty } };
  const dRows = (difficultyRows.data ?? []) as unknown as DifficultyRow[];
  const difficultyPerformance: DifficultyPerformancePoint[] = (["easy", "medium", "hard"] as Difficulty[]).map((d) => {
    const forDifficulty = dRows.filter((r) => r.questions.difficulty === d);
    const correct = forDifficulty.filter((r) => r.is_correct === true).length;
    return {
      difficulty: d,
      accuracyPct: forDifficulty.length > 0 ? Math.round((correct / forDifficulty.length) * 100) : 0,
      attempted: forDifficulty.length,
    };
  });

  return { accuracyOverTime, speedOverTime, topicPerformance, companyReadiness, difficultyPerformance };
}
