import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });
import type { Database, Difficulty, QuestionOption, SourceType, Subject } from "@/lib/types/database";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Copy .env.local.example to .env.local and fill in your Supabase project's values first.",
  );
  process.exit(1);
}

export const supabase = createClient<Database>(url, key, { auth: { persistSession: false } });

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Seed validation failed: ${message}`);
  }
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Opt {
  key: string;
  text: string;
}

// Deterministically shuffles a question's options (seeded by its own text)
// so the correct answer isn't predictably in the same slot across the bank.
// Re-running the seed script produces the same shuffle for the same
// question, so it's stable across reseeds.
export function shuffleOptions(questionText: string, options: Opt[], correctKey: string) {
  const correctIdx = options.findIndex((o) => o.key === correctKey);
  assert(correctIdx !== -1, `correct_option_key not found among options for: ${questionText}`);

  const rand = mulberry32(hashString(questionText));
  const indices = options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const letters = ["A", "B", "C", "D"];
  const newOptions: Opt[] = indices.map((origIdx, i) => ({ key: letters[i], text: options[origIdx].text }));
  const newCorrectKey = letters[indices.indexOf(correctIdx)];
  return { options: newOptions, correct_option_key: newCorrectKey };
}

export interface QuestionSeed {
  question_type: string; // must match a topics.question_type for this subject
  question_text: string;
  options: QuestionOption[];
  correct_option_key: string;
  difficulty: Difficulty;
  explanation: string;
  shortcut?: string;
  concept: string;
  exam_tip: string;
  company_slug?: string; // if set, tagged to that company + source_type=company_style
}

export function opts(a: string, b: string, c: string, d: string): QuestionOption[] {
  return [
    { key: "A", text: a },
    { key: "B", text: b },
    { key: "C", text: c },
    { key: "D", text: d },
  ];
}

// Seeds one subject's question pool: validates against the topic taxonomy
// and companies, deletes that subject's existing questions first (so
// re-running the seed script is idempotent instead of duplicating rows),
// shuffles each question's option order, then inserts questions +
// question_sources. Shared across scripts/seed/seed-<subject>.ts files.
export async function seedSubjectQuestions(subject: Subject, questions: QuestionSeed[], minCount = 15) {
  assert(questions.length >= minCount, `expected at least ${minCount} ${subject} questions`);

  const { data: topics, error: topicsError } = await supabase
    .from("topics")
    .select("id, question_type")
    .eq("subject", subject);
  if (topicsError) throw topicsError;
  const topicByType = new Map((topics ?? []).map((t) => [t.question_type, t.id]));
  const topicIds = (topics ?? []).map((t) => t.id);

  const { data: companies, error: companiesError } = await supabase.from("companies").select("id, slug");
  if (companiesError) throw companiesError;
  const companyBySlug = new Map((companies ?? []).map((c) => [c.slug, c.id]));

  if (topicIds.length > 0) {
    const { error: deleteError } = await supabase.from("questions").delete().in("topic_id", topicIds);
    if (deleteError) throw deleteError;
  }

  for (const q of questions) {
    const topicId = topicByType.get(q.question_type);
    assert(topicId, `unknown ${subject} topic question_type "${q.question_type}" — run seed-topics first`);

    const companyId = q.company_slug ? companyBySlug.get(q.company_slug) : undefined;
    assert(!q.company_slug || companyId, `unknown company_slug "${q.company_slug}" — run seed-companies first`);

    const shuffled = shuffleOptions(q.question_text, q.options, q.correct_option_key);

    const { data: question, error } = await supabase
      .from("questions")
      .insert({
        topic_id: topicId,
        question_text: q.question_text,
        options: shuffled.options,
        correct_option_key: shuffled.correct_option_key,
        difficulty: q.difficulty,
        explanation: q.explanation,
        shortcut: q.shortcut ?? null,
        concept: q.concept,
        exam_tip: q.exam_tip,
        company_id: companyId ?? null,
      })
      .select()
      .single();
    if (error) throw error;

    const sourceType: SourceType = q.company_slug ? "company_style" : "practice";
    const { error: sourceError } = await supabase.from("question_sources").insert({
      question_id: question.id,
      source_type: sourceType,
      source: q.company_slug
        ? `Editorial estimate — styled after ${q.company_slug}'s public assessment pattern, not sourced from an actual test.`
        : "Generic practice question authored for AptitudePro.",
      verified: false,
    });
    if (sourceError) throw sourceError;
  }

  console.log(`Seeded ${questions.length} ${subject} questions.`);
}
