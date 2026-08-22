"use server";

import { createClient } from "@/lib/supabase/server";
import { getResult } from "@/lib/actions/test";
import {
  rankWeakTopics,
  placementReadinessScore,
  speedComponent,
  consistencyComponent,
  topicCoveragePct,
  companyReadiness,
  generateRecommendations,
  type TopicStatLike,
  type WeakTopic,
  type ReadinessResult,
  type Recommendation,
  type CompanyReadinessResult,
} from "@/lib/algorithms/readiness";
import type { Subject } from "@/lib/types/database";

async function getUser(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user;
}

async function fetchTopicStats(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<TopicStatLike[]> {
  const { data, error } = await supabase
    .from("user_topic_stats")
    .select("topic_id, questions_attempted, questions_correct, avg_time_seconds, topics(subject)")
    .eq("user_id", userId);
  if (error) throw error;

  type Row = { topic_id: string; questions_attempted: number; questions_correct: number; avg_time_seconds: number; topics: { subject: Subject } };
  return ((data ?? []) as unknown as Row[]).map((r) => ({
    topicId: r.topic_id,
    subject: r.topics.subject,
    questionsAttempted: r.questions_attempted,
    questionsCorrect: r.questions_correct,
    avgTimeSeconds: r.avg_time_seconds,
  }));
}

async function fetchAllTopics(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase.from("topics").select("id, name, subject");
  if (error) throw error;
  return data ?? [];
}

async function fetchDifficultyHandled(supabase: Awaited<ReturnType<typeof createClient>>) {
  // RLS already scopes attempt_answers to the current user via the parent
  // attempts row, so no explicit user filter is needed here.
  const { data, error } = await supabase
    .from("attempt_answers")
    .select("is_correct, selected_option_key, questions(difficulty)")
    .not("selected_option_key", "is", null);
  if (error) throw error;

  type Row = { is_correct: boolean | null; questions: { difficulty: string } };
  const rows = (data ?? []) as unknown as Row[];
  const hardOrMedium = rows.filter((r) => r.questions.difficulty === "medium" || r.questions.difficulty === "hard");
  const correct = hardOrMedium.filter((r) => r.is_correct === true).length;
  return hardOrMedium.length > 0 ? Math.round((correct / hardOrMedium.length) * 100) : 0;
}

async function fetchRecentScores(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data, error } = await supabase
    .from("attempts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("submitted_at", { ascending: false })
    .limit(5);
  if (error) throw error;

  const results = await Promise.all((data ?? []).map((a) => getResult(a.id).catch(() => null)));
  return results.filter((r): r is NonNullable<typeof r> => r !== null);
}

async function fetchTargetCompanies(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data, error } = await supabase
    .from("user_target_companies")
    .select("companies(id, name, slug, difficulty)")
    .eq("user_id", userId);
  if (error) throw error;

  type Row = { companies: { id: string; name: string; slug: string; difficulty: string } };
  return ((data ?? []) as unknown as Row[]).map((r) => r.companies).filter(Boolean);
}

async function fetchCompanySections(supabase: Awaited<ReturnType<typeof createClient>>, companyId: string) {
  const { data, error } = await supabase
    .from("company_sections")
    .select("topic_subject, weight_pct, typical_question_count, typical_time_minutes")
    .eq("company_id", companyId);
  if (error) throw error;
  return (data ?? []).map((s) => ({
    subject: s.topic_subject,
    weightPct: s.weight_pct,
    typicalQuestionCount: s.typical_question_count,
    typicalTimeMinutes: s.typical_time_minutes,
  }));
}

async function fetchMockAttemptStats(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data, error } = await supabase
    .from("attempts")
    .select("submitted_at, tests(mode, company_id)")
    .eq("user_id", userId)
    .eq("status", "completed");
  if (error) throw error;

  type Row = { submitted_at: string | null; tests: { mode: string; company_id: string | null } };
  const rows = (data ?? []) as unknown as Row[];
  const mockRows = rows.filter((r) => r.tests.mode === "company_mock" || r.tests.mode === "full_assessment");

  const countByCompany = new Map<string, number>();
  let lastMockAt: string | null = null;
  for (const r of mockRows) {
    if (r.tests.company_id) {
      countByCompany.set(r.tests.company_id, (countByCompany.get(r.tests.company_id) ?? 0) + 1);
    }
    if (r.submitted_at && (!lastMockAt || r.submitted_at > lastMockAt)) lastMockAt = r.submitted_at;
  }

  const daysSinceLastMock = lastMockAt ? Math.floor((Date.now() - new Date(lastMockAt).getTime()) / 86_400_000) : null;
  return { countByCompany, daysSinceLastMock };
}

function statsBySubject(topicStats: TopicStatLike[]) {
  const map = new Map<Subject, { attempted: number; correct: number; avgTime: number }>();
  for (const s of topicStats) {
    const existing = map.get(s.subject) ?? { attempted: 0, correct: 0, avgTime: 0 };
    const totalTime = existing.avgTime * existing.attempted + s.avgTimeSeconds * s.questionsAttempted;
    const attempted = existing.attempted + s.questionsAttempted;
    map.set(s.subject, {
      attempted,
      correct: existing.correct + s.questionsCorrect,
      avgTime: attempted > 0 ? totalTime / attempted : 0,
    });
  }
  return map;
}

export interface CompanyReadinessCard extends CompanyReadinessResult {
  id: string;
  name: string;
  slug: string;
}

export interface ReadinessDashboard {
  readiness: ReadinessResult;
  weakAreas: (WeakTopic & { topicName: string })[];
  recommendations: Recommendation[];
  companies: CompanyReadinessCard[];
}

export async function getReadinessDashboard(): Promise<ReadinessDashboard> {
  const supabase = await createClient();
  const user = await getUser(supabase);

  const [topicStats, allTopics, difficultyHandledPct, recentAttempts, targetCompanies, mockStats] = await Promise.all([
    fetchTopicStats(supabase, user.id),
    fetchAllTopics(supabase),
    fetchDifficultyHandled(supabase),
    fetchRecentScores(supabase, user.id),
    fetchTargetCompanies(supabase, user.id),
    fetchMockAttemptStats(supabase, user.id),
  ]);

  const bySubject = statsBySubject(topicStats);

  const sectionsByCompany = await Promise.all(targetCompanies.map((c) => fetchCompanySections(supabase, c.id)));

  const companies: CompanyReadinessCard[] = targetCompanies.map((c, i) => {
    const result = companyReadiness(sectionsByCompany[i], bySubject, mockStats.countByCompany.get(c.id) ?? 0);
    return { ...result, id: c.id, name: c.name, slug: c.slug };
  });

  const recentAccuracyPct =
    recentAttempts.length > 0
      ? Math.round(recentAttempts.reduce((sum, r) => sum + r.score.accuracy, 0) / recentAttempts.length)
      : 0;
  const consistencyPct = consistencyComponent(recentAttempts.map((r) => r.score.score));
  const requiredSubjects = Array.from(new Set(sectionsByCompany.flat().map((s) => s.subject)));
  const attemptedBySubject = new Map(Array.from(bySubject.entries()).map(([subject, s]) => [subject, s.attempted]));
  const companySpecificPct = companies.length > 0 ? Math.round(companies.reduce((sum, c) => sum + c.overallPct, 0) / companies.length) : 50;

  const readiness = placementReadinessScore({
    recentAccuracyPct,
    speedComponentPct: speedComponent(topicStats),
    difficultyHandledPct,
    consistencyPct,
    topicCoveragePct: topicCoveragePct(requiredSubjects, attemptedBySubject),
    companySpecificPct,
  });

  const ranked = rankWeakTopics(topicStats, allTopics);
  const topicNameById = new Map(allTopics.map((t) => [t.id, t.name]));
  const weakAreas = ranked.slice(0, 5).map((w) => ({ ...w, topicName: topicNameById.get(w.topicId) ?? w.subject }));

  const recommendations = generateRecommendations(
    ranked.slice(0, 6).map((w) => ({ ...w, topicName: topicNameById.get(w.topicId) ?? w.subject })),
    mockStats.daysSinceLastMock,
  );

  return { readiness, weakAreas, recommendations, companies };
}

// Used on a company's detail page. Returns null when signed out (readiness
// is a personalized feature) rather than throwing, since that page is
// publicly viewable.
export async function getCompanyReadinessForUser(companyId: string): Promise<CompanyReadinessResult | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [topicStats, sections, mockStats] = await Promise.all([
    fetchTopicStats(supabase, user.id),
    fetchCompanySections(supabase, companyId),
    fetchMockAttemptStats(supabase, user.id),
  ]);

  return companyReadiness(sections, statsBySubject(topicStats), mockStats.countByCompany.get(companyId) ?? 0);
}
