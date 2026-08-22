import type { Difficulty, Subject, TestMode } from "@/lib/types/database";

export interface ModeConfig {
  questionCount: number;
  timeLimitMinutes: number;
  negativeMarking: boolean;
  negativeMarkingValue: number | null;
}

export interface CompanySectionLike {
  topic_subject: Subject;
  weight_pct: number;
  typical_question_count: number;
  typical_time_minutes: number;
}

const ALL_SUBJECTS: Subject[] = ["quant", "logical", "verbal", "di", "numerical", "critical_reasoning"];

// Quick/Sectional are untimed-pressure practice-style timed tests (no
// penalty for a wrong guess); Company Mock/Full Assessment mimic a real
// exam's negative marking to match the spec's "negative marking, if
// applicable" pre-start disclosure.
export function getModeConfig(mode: TestMode, sections?: CompanySectionLike[]): ModeConfig {
  switch (mode) {
    case "quick":
      return { questionCount: 10, timeLimitMinutes: 10, negativeMarking: false, negativeMarkingValue: null };
    case "sectional":
      return { questionCount: 20, timeLimitMinutes: 20, negativeMarking: false, negativeMarkingValue: null };
    case "company_mock":
      return { questionCount: 50, timeLimitMinutes: 45, negativeMarking: true, negativeMarkingValue: 0.25 };
    case "full_assessment": {
      if (!sections || sections.length === 0) {
        // No company sections available — fall back to the company_mock shape.
        return { questionCount: 50, timeLimitMinutes: 45, negativeMarking: true, negativeMarkingValue: 0.25 };
      }
      const questionCount = sections.reduce((sum, s) => sum + s.typical_question_count, 0);
      const timeLimitMinutes = sections.reduce((sum, s) => sum + s.typical_time_minutes, 0);
      return { questionCount, timeLimitMinutes, negativeMarking: true, negativeMarkingValue: 0.25 };
    }
    default:
      throw new Error(`Unknown test mode: ${mode}`);
  }
}

export interface DifficultyMix {
  easy: number;
  medium: number;
  hard: number;
}

// Fractions sum to 1. A harder company skews the practice pool toward
// harder questions; with no company context, use a neutral default mix.
export function difficultyMix(companyDifficulty?: Difficulty): DifficultyMix {
  switch (companyDifficulty) {
    case "easy":
      return { easy: 0.5, medium: 0.35, hard: 0.15 };
    case "hard":
      return { easy: 0.15, medium: 0.45, hard: 0.4 };
    case "medium":
    default:
      return { easy: 0.3, medium: 0.5, hard: 0.2 };
  }
}

export function difficultyCounts(total: number, mix: DifficultyMix): Record<Difficulty, number> {
  const easy = Math.round(total * mix.easy);
  const hard = Math.round(total * mix.hard);
  const medium = Math.max(0, total - easy - hard);
  return { easy, medium, hard };
}

export interface SectionTarget {
  subject: Subject;
  targetCount: number;
}

// Splits the mode's total question count across subjects: proportional to
// the company's section weights when a company is given (or an exact
// per-section count for full_assessment), otherwise an even split across
// all 6 subjects for generic/company-less tests.
export function sectionTargets(
  mode: TestMode,
  questionCount: number,
  sections?: CompanySectionLike[],
): SectionTarget[] {
  if (mode === "full_assessment" && sections && sections.length > 0) {
    return sections.map((s) => ({ subject: s.topic_subject, targetCount: s.typical_question_count }));
  }

  if (sections && sections.length > 0) {
    const totalWeight = sections.reduce((sum, s) => sum + s.weight_pct, 0) || 1;
    const targets = sections.map((s) => ({
      subject: s.topic_subject,
      targetCount: Math.max(1, Math.round((s.weight_pct / totalWeight) * questionCount)),
    }));
    return rebalanceToTotal(targets, questionCount);
  }

  const perSubject = Math.floor(questionCount / ALL_SUBJECTS.length);
  const remainder = questionCount - perSubject * ALL_SUBJECTS.length;
  return ALL_SUBJECTS.map((subject, i) => ({
    subject,
    targetCount: perSubject + (i < remainder ? 1 : 0),
  }));
}

// Rounding each section's share independently can drift a few questions
// away from the mode's exact total — nudge the largest section to absorb
// the difference so the assembled test always matches questionCount.
function rebalanceToTotal(targets: SectionTarget[], questionCount: number): SectionTarget[] {
  const sum = targets.reduce((s, t) => s + t.targetCount, 0);
  const diff = questionCount - sum;
  if (diff === 0 || targets.length === 0) return targets;
  const largest = targets.reduce((max, t) => (t.targetCount > max.targetCount ? t : max), targets[0]);
  largest.targetCount = Math.max(0, largest.targetCount + diff);
  return targets;
}
