import type { CompanyCategory, Subject } from "@/lib/types/database";

// The 4 user-selectable timed-test modes — excludes "topic_practice", which
// is only ever created internally by the untimed Practice flow.
export type TimedMode = "quick" | "sectional" | "company_mock" | "full_assessment";

export const SUBJECT_LABELS: Record<Subject, string> = {
  quant: "Quantitative Aptitude",
  logical: "Logical Reasoning",
  verbal: "Verbal Ability",
  di: "Data Interpretation",
  numerical: "Numerical Ability",
  critical_reasoning: "Critical Reasoning",
};

export const MODE_LABELS: Record<TimedMode, string> = {
  quick: "Quick Test",
  sectional: "Sectional Test",
  company_mock: "Company Mock",
  full_assessment: "Full Assessment",
};

export const MODE_DESCRIPTIONS: Record<TimedMode, string> = {
  quick: "10 questions · 10 minutes",
  sectional: "20 questions · 20 minutes",
  company_mock: "50 questions · 45 minutes, negative marking applies",
  full_assessment: "Based on your target company's full section structure, negative marking applies",
};

// No per-question time target is stored in the schema, so the readiness
// engine's speed component compares a topic's avg_time_seconds against a
// flat per-subject target instead.
export const SUBJECT_TIME_TARGET_SECONDS: Record<Subject, number> = {
  quant: 60,
  logical: 60,
  verbal: 50,
  di: 90,
  numerical: 60,
  critical_reasoning: 70,
};

export const CATEGORY_LABELS: Record<CompanyCategory, string> = {
  consulting: "Consulting",
  bfsi: "Finance / BFSI",
  fmcg: "FMCG",
  tech_ecommerce: "Tech / E-commerce",
};
