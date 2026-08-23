import { supabase } from "@/lib/supabase/client";
import type { Subject } from "@/lib/types/database";

// Numbered, non-overlapping test sets — "Domain Test 1", "Domain Test 2",
// ... — instead of the random resampling the mode-based Test flow uses.
// Partitioning a stable-ordered pool (sorted by id) into fixed-size chunks
// guarantees no question ever appears in two different numbered tests of
// the same kind, and the count of available tests grows automatically as
// more content is seeded — no manual bookkeeping.
const DOMAIN_TEST_SIZE = 10;
const FULL_TEST_SIZE = 20;
const MIN_TAIL_SIZE_RATIO = 0.5; // drop a final chunk under half the target size

function partition(ids: string[], size: number): string[][] {
  const chunks: string[][] = [];
  for (let i = 0; i * size < ids.length; i++) {
    const chunk = ids.slice(i * size, (i + 1) * size);
    if (chunk.length < size * MIN_TAIL_SIZE_RATIO) break;
    chunks.push(chunk);
  }
  return chunks;
}

export async function getDomainTestBank(subject: Subject): Promise<string[][]> {
  const { data, error } = await supabase
    .from("questions")
    .select("id, topics!inner(subject)")
    .eq("topics.subject", subject)
    .order("id");
  if (error) throw error;
  return partition(((data ?? []) as unknown as { id: string }[]).map((q) => q.id), DOMAIN_TEST_SIZE);
}

export async function getFullTestBank(): Promise<string[][]> {
  const { data, error } = await supabase.from("questions").select("id").order("id");
  if (error) throw error;
  return partition((data ?? []).map((q) => q.id), FULL_TEST_SIZE);
}
