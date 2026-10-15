import type { QuestionSeed } from "./lib";
import { opts } from "./lib";
import type { Difficulty } from "@/lib/types/database";

// Seeded RNG so re-running the seed script is reproducible (deterministic
// content), not a fresh random set every time.
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randInt(r: () => number, min: number, max: number): number {
  return Math.floor(r() * (max - min + 1)) + min;
}

export function pick<T>(r: () => number, arr: T[]): T {
  return arr[Math.floor(r() * arr.length)];
}

export function pickDifficulty(r: () => number): Difficulty {
  const roll = r();
  return roll < 0.35 ? "easy" : roll < 0.75 ? "medium" : "hard";
}

// Builds numeric-answer options: the correct value plus up to 3 distractors
// chosen from `candidates` (typically plausible wrong values from common
// calculation slips), deduped, then padded with random jitter if short.
export function numericOptions(r: () => number, correct: number, candidates: number[], fmt: (n: number) => string = String) {
  const values = new Set<number>([correct]);
  for (const v of candidates) {
    if (values.size >= 4) break;
    values.add(v);
  }
  while (values.size < 4) {
    const jitter = randInt(r, 1, Math.max(2, Math.round(Math.abs(correct) * 0.2) + 1)) * (r() < 0.5 ? -1 : 1);
    values.add(correct + jitter);
  }
  const arr = [...values].slice(0, 4);
  const correctIdx = arr.indexOf(correct);
  const [a, b, c, d] = arr;
  return { options: opts(fmt(a), fmt(b), fmt(c), fmt(d)), correct_option_key: ["A", "B", "C", "D"][correctIdx] };
}

// Runs `templates` round-robin, calling each with a fresh rng draw, until
// `count` unique (by question_text) questions are collected.
export function generateUnique(count: number, templates: Array<(r: () => number) => QuestionSeed>, seed: number): QuestionSeed[] {
  const r = rng(seed);
  const out: QuestionSeed[] = [];
  const seen = new Set<string>();
  let i = 0;
  let guard = 0;
  while (out.length < count && guard < count * 50) {
    guard++;
    const template = templates[i % templates.length];
    i++;
    const q = template(r);
    if (seen.has(q.question_text)) continue;
    seen.add(q.question_text);
    out.push(q);
  }
  return out;
}

// Appends generated questions, skipping any that duplicate a hand-authored one.
export function appendUnique(target: QuestionSeed[], generated: QuestionSeed[]) {
  const seen = new Set(target.map((q) => q.question_text));
  target.push(...generated.filter((q) => !seen.has(q.question_text)));
}
