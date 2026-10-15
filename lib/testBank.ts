import { supabase } from "@/lib/supabase/client";
import { sectionTargets, type CompanySectionLike } from "@/lib/algorithms/testAssembly";
import type { Subject } from "@/lib/types/database";

// Numbered, non-overlapping test sets — "Domain Test 1", "Domain Test 2",
// ... — instead of the random resampling the mode-based Test flow uses.
// Partitioning a stable-ordered pool (sorted by id) into fixed-size chunks
// guarantees no question ever appears in two different numbered tests of
// the same kind, and the count of available tests grows automatically as
// more content is seeded — no manual bookkeeping.
const DOMAIN_TEST_SIZE = 10;
const FULL_TEST_SIZE = 20;
const COMPANY_TEST_SIZE = 20;
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

async function getDomainIds(subject: Subject): Promise<string[]> {
  const { data, error } = await supabase
    .from("questions")
    .select("id, topics!inner(subject)")
    .eq("topics.subject", subject)
    .order("id");
  if (error) throw error;
  return ((data ?? []) as unknown as { id: string }[]).map((q) => q.id);
}

export async function getDomainTestBank(subject: Subject): Promise<string[][]> {
  return partition(await getDomainIds(subject), DOMAIN_TEST_SIZE);
}

export async function getFullTestBank(): Promise<string[][]> {
  const { data, error } = await supabase.from("questions").select("id").order("id");
  if (error) throw error;
  return partition((data ?? []).map((q) => q.id), FULL_TEST_SIZE);
}

// Company mocks follow the company's section weights. Mock k takes the k-th
// slice of each section's pool, so mocks of one company never share a
// question. Each company's pools are rotated by its own offset so "Mock 1" of
// different companies doesn't start from the same questions.
export async function getCompanyTestBank(companyId: string, sections: CompanySectionLike[]): Promise<string[][]> {
  const targets = sectionTargets("company_mock", COMPANY_TEST_SIZE, sections);
  const offset = [...companyId].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 0);
  const pools = await Promise.all(
    targets.map(async (t) => {
      const ids = await getDomainIds(t.subject);
      const shift = ids.length ? offset % ids.length : 0;
      return [...ids.slice(shift), ...ids.slice(0, shift)];
    }),
  );
  const count = Math.min(...targets.map((t, i) => Math.floor(pools[i].length / t.targetCount)));
  return Array.from({ length: count }, (_, k) => targets.flatMap((t, i) => pools[i].slice(k * t.targetCount, (k + 1) * t.targetCount)));
}
