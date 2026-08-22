"use server";

import { createClient } from "@/lib/supabase/server";
import type { Difficulty, Subject } from "@/lib/types/database";

export interface MistakeQuestion {
  id: string;
  questionText: string;
  difficulty: Difficulty;
  subject: Subject;
  topicName: string;
  companyName: string | null;
  lastMissedAt: string;
}

export interface MistakeFilters {
  subject?: Subject;
  difficulty?: Difficulty;
  companyId?: string;
}

// "Mistakes" is deliberately not a table — it's a query over attempt_answers
// where is_correct = false, deduped to the most recent miss per question.
// RLS already scopes attempt_answers to the current user via the parent
// attempts row.
export async function getMistakes(filters: MistakeFilters = {}): Promise<MistakeQuestion[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data, error } = await supabase
    .from("attempt_answers")
    .select(
      "answered_at, questions(id, question_text, difficulty, topic_id, company_id, topics(name, subject), companies(name))",
    )
    .eq("is_correct", false)
    .order("answered_at", { ascending: false });
  if (error) throw error;

  type Row = {
    answered_at: string | null;
    questions: {
      id: string;
      question_text: string;
      difficulty: Difficulty;
      company_id: string | null;
      topics: { name: string; subject: Subject };
      companies: { name: string } | null;
    };
  };

  const byQuestion = new Map<string, MistakeQuestion>();
  for (const row of (data ?? []) as unknown as Row[]) {
    const q = row.questions;
    if (byQuestion.has(q.id)) continue; // already have the most recent miss (rows are newest-first)
    byQuestion.set(q.id, {
      id: q.id,
      questionText: q.question_text,
      difficulty: q.difficulty,
      subject: q.topics.subject,
      topicName: q.topics.name,
      companyName: q.companies?.name ?? null,
      lastMissedAt: row.answered_at ?? "",
    });
  }

  let mistakes = Array.from(byQuestion.values());
  if (filters.subject) mistakes = mistakes.filter((m) => m.subject === filters.subject);
  if (filters.difficulty) mistakes = mistakes.filter((m) => m.difficulty === filters.difficulty);
  if (filters.companyId) {
    const { data: company } = await supabase.from("companies").select("name").eq("id", filters.companyId).single();
    if (company) mistakes = mistakes.filter((m) => m.companyName === company.name);
  }

  return mistakes;
}

export interface MistakesBySubject {
  subject: Subject;
  count: number;
}

export async function getMistakeCountsBySubject(): Promise<MistakesBySubject[]> {
  const mistakes = await getMistakes();
  const counts = new Map<Subject, number>();
  for (const m of mistakes) counts.set(m.subject, (counts.get(m.subject) ?? 0) + 1);
  return Array.from(counts.entries()).map(([subject, count]) => ({ subject, count }));
}
