import type { QuestionSeed } from "./lib";
import { opts } from "./lib";
import { generateUnique, pick, pickDifficulty, randInt } from "./genlib";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const WORDS = ["CAT", "DOG", "SUN", "RAIN", "STAR", "MOON", "BIRD", "FISH", "TREE", "LAMP", "BOOK", "CHAIR", "TRAIN", "CLOUD", "RIVER", "STONE", "PLANT", "HOUSE"];

function shiftLetter(ch: string, shift: number): string {
  const idx = ALPHABET.indexOf(ch);
  return ALPHABET[(idx + shift + 26) % 26];
}
function shiftWord(word: string, shift: number): string {
  return word
    .split("")
    .map((c) => shiftLetter(c, shift))
    .join("");
}
function reverseWord(word: string): string {
  return word.split("").reverse().join("");
}

// ---- Coding-Decoding ----
function tplCodingShift(r: () => number): QuestionSeed {
  const [w1, w2] = pickTwoWords(r);
  const shift = pick(r, [1, 2, 3, -1, -2, -3]);
  const coded1 = shiftWord(w1, shift);
  const correct = shiftWord(w2, shift);
  const distractors = [shiftWord(w2, -shift), shiftWord(w2, shift + 1), reverseWord(correct)];
  const { options, correct_option_key } = uniqueTextOptions(correct, distractors);
  return {
    question_type: "Coding-Decoding",
    question_text: `In a certain code, ${w1} is written as ${coded1}. How is ${w2} written in the same code?`,
    options,
    correct_option_key,
    difficulty: pickDifficulty(r),
    explanation: `Each letter is shifted by ${shift > 0 ? "+" : ""}${shift} in the alphabet. Applying the same shift to ${w2} gives ${correct}.`,
    shortcut: "Find the shift on the first letter of the example word and apply it directly — no need to decode the whole word first.",
    concept: "Letter-shift substitution code",
    exam_tip: "Verify the shift on at least two letters of the example before applying it — some codes shift letters by different amounts.",
  };
}

function tplCodingNumber(r: () => number): QuestionSeed {
  const [w1, w2] = pickTwoWords(r);
  const toNums = (w: string) =>
    w
      .split("")
      .map((c) => ALPHABET.indexOf(c) + 1)
      .join("-");
  const correct = toNums(w2);
  const wrongOffset = (w: string, off: number) =>
    w
      .split("")
      .map((c) => ALPHABET.indexOf(c) + 1 + off)
      .join("-");
  const distractors = [wrongOffset(w2, 1), wrongOffset(w2, -1), toNums(w1)];
  const { options, correct_option_key } = uniqueTextOptions(correct, distractors);
  return {
    question_type: "Coding-Decoding",
    question_text: `In a certain code, each letter of a word is replaced by its position in the alphabet (A=1, B=2, ...), separated by hyphens. If ${w1} is coded as ${toNums(w1)}, how is ${w2} coded?`,
    options,
    correct_option_key,
    difficulty: "easy",
    explanation: `${w2} → ${w2.split("").map((c) => `${c}=${ALPHABET.indexOf(c) + 1}`).join(", ")} → ${correct}.`,
    concept: "Letter-to-number position code",
    exam_tip: "A=1...Z=26 — memorize a few checkpoints (J=10, T=20) so you don't have to count from A every time.",
  };
}

function pickTwoWords(r: () => number): [string, string] {
  const w1 = pick(r, WORDS);
  let w2 = pick(r, WORDS);
  while (w2 === w1) w2 = pick(r, WORDS);
  return [w1, w2];
}

function uniqueTextOptions(correct: string, candidates: string[]) {
  const values = [correct, ...candidates.filter((c) => c !== correct)];
  const uniq = [...new Set(values)].slice(0, 4);
  while (uniq.length < 4) uniq.push(`${correct}X${uniq.length}`);
  const correctIdx = uniq.indexOf(correct);
  return { options: opts(uniq[0], uniq[1], uniq[2], uniq[3]), correct_option_key: ["A", "B", "C", "D"][correctIdx] };
}

// ---- Syllogisms ----
const SYL_TERMS = ["Cats", "Dogs", "Birds", "Pens", "Books", "Tables", "Chairs", "Flowers", "Cars", "Phones", "Rivers", "Mountains"];

function tplSyllogismAllAll(r: () => number): QuestionSeed {
  const [a, b, c] = pickThree(r);
  return {
    question_type: "Syllogisms",
    question_text: `Statements: All ${a} are ${b}. All ${b} are ${c}.\nConclusion: All ${a} are ${c}.\nDoes the conclusion logically follow?`,
    options: opts("Yes, it follows", "No, it does not follow", "Cannot be determined", "The statements are contradictory"),
    correct_option_key: "A",
    difficulty: "easy",
    explanation: `All ${a} are ${b}, and all ${b} are ${c}, so by transitivity all ${a} are ${c}. The conclusion follows.`,
    shortcut: "\"All A are B\" + \"All B are C\" always gives \"All A are C\" — this chain is always valid.",
    concept: "Syllogism — transitive 'All' chain",
    exam_tip: "The All-All-All chain is the one syllogism pattern that's always valid — memorize it.",
  };
}

function tplSyllogismSomeNo(r: () => number): QuestionSeed {
  const [a, b, c] = pickThree(r);
  return {
    question_type: "Syllogisms",
    question_text: `Statements: Some ${a} are ${b}. No ${b} is ${c}.\nConclusion: Some ${a} are not ${c}.\nDoes the conclusion logically follow?`,
    options: opts("Yes, it follows", "No, it does not follow", "Cannot be determined", "Both statements are false"),
    correct_option_key: "A",
    difficulty: "hard",
    explanation: `The ${a} that overlap with ${b} cannot be ${c} (since no ${b} is ${c}). That overlap is non-empty ("some ${a} are ${b}"), so those ${a} are definitely not ${c} — the conclusion follows.`,
    concept: "Syllogism — 'Some' and 'No' statements",
    exam_tip: "\"Some A are B\" + \"No B is C\" always validly gives \"Some A are not C\" — the overlap that makes the first statement true can't also be C.",
  };
}

function pickThree(r: () => number): [string, string, string] {
  const pool = [...SYL_TERMS];
  const a = pool.splice(randInt(r, 0, pool.length - 1), 1)[0];
  const b = pool.splice(randInt(r, 0, pool.length - 1), 1)[0];
  const c = pool.splice(randInt(r, 0, pool.length - 1), 1)[0];
  return [a, b, c];
}

// ---- Blood Relations ----
function tplBloodRelationFather(r: () => number): QuestionSeed {
  const [p] = pick2Names(r);
  return {
    question_type: "Blood Relations",
    question_text: `Pointing to a photograph, ${p} (a man) said, "She is the daughter of my mother's only son." How is the girl in the photograph related to ${p}?`,
    options: opts("Daughter", "Sister", "Niece", "Cousin"),
    correct_option_key: "A",
    difficulty: "medium",
    explanation: `"My mother's only son" is ${p} himself (${p} is male and has no brothers). So the girl is ${p}'s own daughter.`,
    concept: "Blood relations — indirect self-reference",
    exam_tip: "\"My mother's only son\" or \"my father's only son\" almost always refers to the speaker themselves.",
  };
}

function tplBloodRelationSibling(r: () => number): QuestionSeed {
  const [p, q] = pick2Names(r);
  return {
    question_type: "Blood Relations",
    question_text: `${p} introduces ${q} as "the son of my father's only daughter." If ${p} is a woman, how is ${q} related to ${p}?`,
    options: opts("Son", "Nephew", "Brother", "Cousin"),
    correct_option_key: "A",
    difficulty: "medium",
    explanation: `"My father's only daughter" is ${p} herself (she is a woman). So ${q}, her son, is ${p}'s own son.`,
    concept: "Blood relations — indirect self-reference via gender clue",
    exam_tip: "Check the stated gender of the speaker first — it decides whether the self-reference resolves to 'son' or 'daughter' phrasing.",
  };
}

function pick2Names(r: () => number): [string, string] {
  const names = ["Arjun", "Meera", "Rohan", "Kavya", "Vikram", "Priya", "Aman", "Sneha"];
  const p = pick(r, names);
  let q = pick(r, names);
  while (q === p) q = pick(r, names);
  return [p, q];
}

// ---- Series (letter) ----
function tplLetterSeriesSkip(r: () => number): QuestionSeed {
  const start = randInt(r, 0, 20);
  const step = pick(r, [2, 3, 4]);
  const terms = [0, 1, 2, 3].map((i) => ALPHABET[(start + i * step) % 26]);
  const next = ALPHABET[(start + 4 * step) % 26];
  const wrong1 = ALPHABET[(start + 4 * step + 1) % 26];
  const wrong2 = ALPHABET[(start + 3 * step) % 26];
  const wrong3 = ALPHABET[(start + 4 * step - 1 + 26) % 26];
  const { options, correct_option_key } = uniqueTextOptions(next, [wrong1, wrong2, wrong3]);
  return {
    question_type: "Series",
    question_text: `Find the next letter in the series: ${terms.join(", ")}, ?`,
    options,
    correct_option_key,
    difficulty: "easy",
    explanation: `Each letter skips ${step - 1} letters (step of ${step}) from the previous one. The next letter after ${terms[3]} is ${next}.`,
    concept: "Alphabet series with a constant letter-gap",
    exam_tip: "Convert letters to their alphabet positions (A=1...Z=26) if the gap isn't obvious at a glance.",
  };
}

function tplLetterSeriesDouble(r: () => number): QuestionSeed {
  const pairs = ["AZ", "BY", "CX", "DW", "EV", "FU"];
  const start = randInt(r, 0, pairs.length - 1);
  const seq = [0, 1, 2].map((i) => pairs[(start + i) % pairs.length]);
  const next = pairs[(start + 3) % pairs.length];
  const wrong1 = pairs[(start + 4) % pairs.length];
  const wrong2 = pairs[(start + 2) % pairs.length];
  const wrong3 = reverseWord(next);
  const { options, correct_option_key } = uniqueTextOptions(next, [wrong1, wrong2, wrong3]);
  return {
    question_type: "Series",
    question_text: `Find the next term in the series: ${seq.join(", ")}, ?`,
    options,
    correct_option_key,
    difficulty: "medium",
    explanation: `The first letter of each term moves forward through the alphabet while the second mirrors it from the end (A↔Z, B↔Y, ...). The next pair is ${next}.`,
    concept: "Alphabet series — paired forward/mirrored letters",
    exam_tip: "When a series has two letters per term, check each position's pattern separately.",
  };
}

export function generateLogical(): QuestionSeed[] {
  return generateUnique(
    300,
    [tplCodingShift, tplCodingNumber, tplSyllogismAllAll, tplSyllogismSomeNo, tplBloodRelationFather, tplBloodRelationSibling, tplLetterSeriesSkip, tplLetterSeriesDouble],
    13131313,
  );
}

if (require.main === module) {
  const qs = generateLogical();
  console.log(`generated ${qs.length} logical questions`);
  console.log(JSON.stringify(qs.slice(0, 4), null, 2));
}
