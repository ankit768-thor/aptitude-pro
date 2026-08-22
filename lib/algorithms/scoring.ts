import type { Subject } from "@/lib/types/database";

export interface ScoredAnswer {
  questionId: string;
  subject: Subject;
  selectedOptionKey: string | null;
  isCorrect: boolean | null;
  timeSpentSeconds: number;
}

export interface SectionPerformance {
  subject: Subject;
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracy: number; // 0-100, correct / (correct+incorrect), 0 if no attempts
  avgTimeSeconds: number;
}

export interface ScoreResult {
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracy: number; // 0-100
  rawScore: number;
  score: number; // normalized 0-100
  avgTimeSeconds: number;
  sectionPerformance: SectionPerformance[];
}

// Pure scoring function — no DB access, so it's directly unit-testable and
// reused identically by both the results page and (later) the readiness
// score / weak-area engines in Phase D.
export function scoreAttempt(
  answers: ScoredAnswer[],
  negativeMarking: boolean,
  negativeMarkingValue: number,
): ScoreResult {
  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect === true).length;
  const incorrect = answers.filter((a) => a.selectedOptionKey !== null && a.isCorrect === false).length;
  const skipped = total - correct - incorrect;

  const rawScore = correct - (negativeMarking ? incorrect * negativeMarkingValue : 0);
  const maxRawScore = total || 1;
  const score = Math.max(0, Math.round((rawScore / maxRawScore) * 100));

  const accuracyDenominator = correct + incorrect;
  const accuracy = accuracyDenominator > 0 ? Math.round((correct / accuracyDenominator) * 100) : 0;

  const totalTime = answers.reduce((sum, a) => sum + a.timeSpentSeconds, 0);
  const avgTimeSeconds = total > 0 ? Math.round(totalTime / total) : 0;

  const bySubject = new Map<Subject, ScoredAnswer[]>();
  for (const a of answers) {
    const list = bySubject.get(a.subject) ?? [];
    list.push(a);
    bySubject.set(a.subject, list);
  }

  const sectionPerformance: SectionPerformance[] = Array.from(bySubject.entries()).map(([subject, list]) => {
    const sCorrect = list.filter((a) => a.isCorrect === true).length;
    const sIncorrect = list.filter((a) => a.selectedOptionKey !== null && a.isCorrect === false).length;
    const sSkipped = list.length - sCorrect - sIncorrect;
    const sDenom = sCorrect + sIncorrect;
    const sTime = list.reduce((sum, a) => sum + a.timeSpentSeconds, 0);
    return {
      subject,
      total: list.length,
      correct: sCorrect,
      incorrect: sIncorrect,
      skipped: sSkipped,
      accuracy: sDenom > 0 ? Math.round((sCorrect / sDenom) * 100) : 0,
      avgTimeSeconds: list.length > 0 ? Math.round(sTime / list.length) : 0,
    };
  });

  return { total, correct, incorrect, skipped, accuracy, rawScore, score, avgTimeSeconds, sectionPerformance };
}
