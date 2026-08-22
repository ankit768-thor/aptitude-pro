"use server";

import { createClient } from "@/lib/supabase/server";
import type { BookmarkCategory, Difficulty, QuestionOption, Subject } from "@/lib/types/database";

export async function toggleBookmark(questionId: string, category: BookmarkCategory) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: existing } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("question_id", questionId)
    .eq("category", category)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("bookmarks").delete().eq("id", existing.id);
    if (error) throw error;
    return { bookmarked: false };
  }

  const { error } = await supabase.from("bookmarks").insert({ user_id: user.id, question_id: questionId, category });
  if (error) throw error;
  return { bookmarked: true };
}

export async function getBookmarkedCategories(questionId: string): Promise<BookmarkCategory[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase.from("bookmarks").select("category").eq("user_id", user.id).eq("question_id", questionId);
  return (data ?? []).map((b) => b.category);
}

export interface BookmarkedQuestion {
  id: string;
  questionText: string;
  options: QuestionOption[];
  correctOptionKey: string;
  explanation: string;
  difficulty: Difficulty;
  subject: Subject;
  topicName: string;
  categories: BookmarkCategory[];
}

export async function listBookmarks(): Promise<BookmarkedQuestion[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data, error } = await supabase
    .from("bookmarks")
    .select("category, questions(id, question_text, options, correct_option_key, explanation, difficulty, topic_id, topics(name, subject))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;

  type Row = {
    category: BookmarkCategory;
    questions: {
      id: string;
      question_text: string;
      options: QuestionOption[];
      correct_option_key: string;
      explanation: string;
      difficulty: Difficulty;
      topics: { name: string; subject: Subject };
    };
  };

  const byQuestion = new Map<string, BookmarkedQuestion>();
  for (const row of (data ?? []) as unknown as Row[]) {
    const q = row.questions;
    const existing = byQuestion.get(q.id);
    if (existing) {
      existing.categories.push(row.category);
    } else {
      byQuestion.set(q.id, {
        id: q.id,
        questionText: q.question_text,
        options: q.options,
        correctOptionKey: q.correct_option_key,
        explanation: q.explanation,
        difficulty: q.difficulty,
        subject: q.topics.subject,
        topicName: q.topics.name,
        categories: [row.category],
      });
    }
  }

  return Array.from(byQuestion.values());
}
