import { supabase } from "@/lib/supabase/client";
import type { Difficulty, QuestionOption, Subject } from "@/lib/types/database";

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
  topic_name: string;
}

export async function fetchPracticeQuestions(filters: PracticeFilters): Promise<PracticeQuestion[]> {
  const count = filters.count ?? 10;

  let query = supabase
    .from("questions")
    .select("id, question_text, options, correct_option_key, explanation, shortcut, concept, exam_tip, difficulty, topics(name, subject)");

  if (filters.companyId) query = query.eq("company_id", filters.companyId);
  if (filters.difficulty) query = query.eq("difficulty", filters.difficulty);

  const { data, error } = await query.limit(200);
  if (error) throw error;

  type Row = PracticeQuestion & { topics: { name: string; subject: Subject } };
  const rows = (data ?? []) as unknown as Row[];
  const pool = rows.filter((q) => (filters.subject ? q.topics?.subject === filters.subject : true));
  const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, count);

  return shuffled.map((row) => ({
    id: row.id,
    question_text: row.question_text,
    options: row.options,
    correct_option_key: row.correct_option_key,
    explanation: row.explanation,
    shortcut: row.shortcut,
    concept: row.concept,
    exam_tip: row.exam_tip,
    difficulty: row.difficulty,
    topic_name: row.topics?.name ?? "",
  }));
}
