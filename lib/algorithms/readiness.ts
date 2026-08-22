import type { Subject } from "@/lib/types/database";
import { SUBJECT_TIME_TARGET_SECONDS, SUBJECT_LABELS } from "@/lib/constants";

// ============================================================
// Weak-area ranking
// ============================================================

export interface TopicStatLike {
  topicId: string;
  subject: Subject;
  questionsAttempted: number;
  questionsCorrect: number;
  avgTimeSeconds: number;
}

export interface WeakTopic {
  topicId: string;
  subject: Subject;
  accuracyPct: number;
  questionsAttempted: number;
  severity: number;
  neverAttempted: boolean;
}

const MIN_PRACTICE_VOLUME = 10;

// Severity ranks topics worth practicing next: low accuracy is worse, and
// under-practiced topics (< MIN_PRACTICE_VOLUME) get a penalty on top of
// their accuracy so "weak AND under-practiced" outranks "weak but well
// covered". Never-attempted topics rank above everything else — the
// coverage gap itself is the most severe signal.
export function rankWeakTopics(
  stats: TopicStatLike[],
  allTopics: { id: string; subject: Subject }[],
): WeakTopic[] {
  const byTopicId = new Map(stats.map((s) => [s.topicId, s]));

  const results: WeakTopic[] = allTopics.map((t) => {
    const s = byTopicId.get(t.id);
    if (!s || s.questionsAttempted === 0) {
      return { topicId: t.id, subject: t.subject, accuracyPct: 0, questionsAttempted: 0, severity: 150, neverAttempted: true };
    }
    const accuracyPct = Math.round((s.questionsCorrect / s.questionsAttempted) * 100);
    const underVolume = s.questionsAttempted < MIN_PRACTICE_VOLUME;
    const severity = 100 - accuracyPct + (underVolume ? 30 : 0);
    return { topicId: t.id, subject: t.subject, accuracyPct, questionsAttempted: s.questionsAttempted, severity, neverAttempted: false };
  });

  return results.sort((a, b) => b.severity - a.severity);
}

// ============================================================
// Placement Readiness Score
// ============================================================

export interface ReadinessInputs {
  recentAccuracyPct: number;
  speedComponentPct: number;
  difficultyHandledPct: number;
  consistencyPct: number;
  topicCoveragePct: number;
  companySpecificPct: number;
}

export type ReadinessBadge = "good" | "needs_work" | "at_risk";

export interface ReadinessResult {
  score: number;
  badge: ReadinessBadge;
  statement: string;
}

const READINESS_WEIGHTS = {
  accuracy: 0.3,
  speed: 0.2,
  difficultyHandled: 0.15,
  consistency: 0.15,
  topicCoverage: 0.1,
  companySpecific: 0.1,
};

export function placementReadinessScore(i: ReadinessInputs): ReadinessResult {
  const raw =
    READINESS_WEIGHTS.accuracy * i.recentAccuracyPct +
    READINESS_WEIGHTS.speed * i.speedComponentPct +
    READINESS_WEIGHTS.difficultyHandled * i.difficultyHandledPct +
    READINESS_WEIGHTS.consistency * i.consistencyPct +
    READINESS_WEIGHTS.topicCoverage * i.topicCoveragePct +
    READINESS_WEIGHTS.companySpecific * i.companySpecificPct;
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  const badge: ReadinessBadge = score >= 75 ? "good" : score >= 50 ? "needs_work" : "at_risk";
  const statement =
    badge === "good"
      ? "You're currently strong enough for moderate-difficulty aptitude assessments. Keep practicing to stay sharp."
      : badge === "needs_work"
        ? "You're making progress, but a few weak areas need attention before you're fully test-ready."
        : "Focus on your weakest topics and take more timed practice before attempting a real assessment.";

  return { score, badge, statement: `${statement} This is a preparation-progress estimate, not a guarantee of selection.` };
}

// Maps a topic's avg_time_seconds against a flat per-subject target into a
// 0-100 component: faster-than-target pushes the score up, slower pulls it
// down, clamped so one very slow/fast topic can't swing the whole score.
export function speedComponent(stats: TopicStatLike[]): number {
  const withData = stats.filter((s) => s.questionsAttempted > 0 && s.avgTimeSeconds > 0);
  if (withData.length === 0) return 50;

  const ratios = withData.map((s) => {
    const target = SUBJECT_TIME_TARGET_SECONDS[s.subject];
    const r = (target - s.avgTimeSeconds) / target;
    return Math.max(-1, Math.min(1, r));
  });
  const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  return Math.round(((avgRatio + 1) / 2) * 100);
}

export function consistencyComponent(recentScores: number[]): number {
  if (recentScores.length < 2) return 50;
  const mean = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  const variance = recentScores.reduce((sum, s) => sum + (s - mean) ** 2, 0) / recentScores.length;
  const stddev = Math.sqrt(variance);
  return Math.max(0, Math.min(100, Math.round(100 - stddev)));
}

export function topicCoveragePct(requiredSubjects: Subject[], attemptedBySubject: Map<Subject, number>): number {
  if (requiredSubjects.length === 0) return 50;
  const covered = requiredSubjects.filter((s) => (attemptedBySubject.get(s) ?? 0) >= MIN_PRACTICE_VOLUME).length;
  return Math.round((covered / requiredSubjects.length) * 100);
}

// ============================================================
// Company readiness
// ============================================================

export interface CompanySectionLike {
  subject: Subject;
  weightPct: number;
  typicalQuestionCount: number;
  typicalTimeMinutes: number;
}

export interface SectionReadiness {
  subject: Subject;
  accuracyPct: number;
  weightPct: number;
  avgTimeSeconds: number;
}

export interface CompanyReadinessResult {
  overallPct: number;
  sections: SectionReadiness[];
  checklist: string[];
}

export function companyReadiness(
  sections: CompanySectionLike[],
  statsBySubject: Map<Subject, { attempted: number; correct: number; avgTime: number }>,
  mockAttemptsCount: number,
): CompanyReadinessResult {
  if (sections.length === 0) return { overallPct: 0, sections: [], checklist: [] };

  const totalWeight = sections.reduce((sum, s) => sum + s.weightPct, 0) || 1;
  const sectionResults: (SectionReadiness & { typicalQuestionCount: number; typicalTimeMinutes: number })[] = sections.map((s) => {
    const stat = statsBySubject.get(s.subject);
    const accuracyPct = stat && stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : 0;
    return {
      subject: s.subject,
      accuracyPct,
      weightPct: s.weightPct,
      avgTimeSeconds: stat?.avgTime ?? 0,
      typicalQuestionCount: s.typicalQuestionCount,
      typicalTimeMinutes: s.typicalTimeMinutes,
    };
  });

  const overallPct = Math.round(sectionResults.reduce((sum, s) => sum + s.accuracyPct * (s.weightPct / totalWeight), 0));

  const checklist: string[] = [];
  for (const s of sectionResults) {
    if (s.accuracyPct < 60) checklist.push(`Improve ${SUBJECT_LABELS[s.subject]}`);
  }
  if (mockAttemptsCount < 2) {
    const remaining = 2 - mockAttemptsCount;
    checklist.push(`Take ${remaining} more timed mock${remaining > 1 ? "s" : ""} for this company`);
  }
  for (const s of sectionResults) {
    if (s.typicalQuestionCount === 0 || s.avgTimeSeconds === 0) continue;
    const targetPerQuestion = (s.typicalTimeMinutes * 60) / s.typicalQuestionCount;
    if (s.avgTimeSeconds > targetPerQuestion * 1.3) {
      checklist.push(`Get your average time in ${SUBJECT_LABELS[s.subject]} under ${Math.round(targetPerQuestion)}s`);
    }
  }

  return { overallPct, sections: sectionResults, checklist };
}

// ============================================================
// Recommendation engine (rule-based)
// ============================================================

export interface Recommendation {
  text: string;
  href: string;
}

export function generateRecommendations(
  weakTopics: (WeakTopic & { topicName: string })[],
  daysSinceLastMock: number | null,
): Recommendation[] {
  const recs: Recommendation[] = [];

  const attemptedWeak = weakTopics.filter((t) => !t.neverAttempted).slice(0, 3);
  for (const t of attemptedWeak) {
    if (t.accuracyPct < 40) {
      recs.push({ text: `Practice 10 ${t.topicName} questions`, href: `/practice?subject=${t.subject}&difficulty=easy` });
    } else if (t.accuracyPct < 65) {
      recs.push({ text: `Practice 10 Medium ${t.topicName} questions`, href: `/practice?subject=${t.subject}&difficulty=medium` });
    } else {
      recs.push({ text: `Take a ${SUBJECT_LABELS[t.subject]} sectional test`, href: `/test/start?mode=sectional` });
    }
  }

  const neverAttempted = weakTopics.filter((t) => t.neverAttempted).slice(0, 2);
  for (const t of neverAttempted) {
    recs.push({ text: `You haven't tried ${t.topicName} yet — practice 10 questions`, href: `/practice?subject=${t.subject}` });
  }

  if (daysSinceLastMock === null || daysSinceLastMock >= 14) {
    recs.push({ text: "Take 1 timed company mock", href: "/test/start?mode=company_mock" });
  }

  return recs.slice(0, 5);
}
