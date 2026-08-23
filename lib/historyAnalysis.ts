import type { HistoryEntry } from "@/lib/history";
import type { Subject } from "@/lib/types/database";

export interface SubjectStat {
  subject: Subject;
  total: number;
  correct: number;
  accuracy: number; // 0-100
}

export interface HistoryAnalysis {
  testsTaken: number;
  avgScore: number;
  avgAccuracy: number;
  trend: "improving" | "declining" | "steady" | null; // last 5 vs. the 5 before that
  bySubject: SubjectStat[];
  weakest: SubjectStat | null;
}

// Pure aggregation over locally-stored attempts — no DB, so it's directly
// unit-testable and safe to recompute on every /history render.
export function analyzeHistory(history: HistoryEntry[]): HistoryAnalysis {
  if (history.length === 0) {
    return { testsTaken: 0, avgScore: 0, avgAccuracy: 0, trend: null, bySubject: [], weakest: null };
  }

  const avgScore = Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length);
  const avgAccuracy = Math.round(history.reduce((sum, h) => sum + h.accuracy, 0) / history.length);

  // history is stored most-recent-first
  const recent5 = history.slice(0, 5);
  const prior5 = history.slice(5, 10);
  let trend: HistoryAnalysis["trend"] = null;
  if (prior5.length >= 3) {
    const recentAvg = recent5.reduce((s, h) => s + h.score, 0) / recent5.length;
    const priorAvg = prior5.reduce((s, h) => s + h.score, 0) / prior5.length;
    const delta = recentAvg - priorAvg;
    trend = delta > 3 ? "improving" : delta < -3 ? "declining" : "steady";
  }

  const bySubjectMap = new Map<Subject, { total: number; correct: number }>();
  for (const entry of history) {
    for (const sp of entry.sectionPerformance ?? []) {
      const cur = bySubjectMap.get(sp.subject) ?? { total: 0, correct: 0 };
      cur.total += sp.correct + sp.incorrect;
      cur.correct += sp.correct;
      bySubjectMap.set(sp.subject, cur);
    }
  }
  const bySubject: SubjectStat[] = Array.from(bySubjectMap.entries())
    .map(([subject, v]) => ({ subject, total: v.total, correct: v.correct, accuracy: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0 }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const weakest = bySubject.find((s) => s.total >= 5) ?? bySubject[0] ?? null;

  return { testsTaken: history.length, avgScore, avgAccuracy, trend, bySubject, weakest };
}
