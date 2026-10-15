// Question-bank quality gate. Runs before every `npm run seed` and blocks it on
// any failure. Two layers:
//  1. Structural checks on every question (4 unique options, valid key,
//     non-empty fields, no duplicate questions, explanation states the answer).
//  2. Independent re-solving: for every templated question type, the answer is
//     recomputed from the question TEXT alone (not from generator variables) and
//     compared with the option marked correct, and must not match any distractor.
import type { QuestionSeed } from "./lib";
import type { Subject } from "@/lib/types/database";
import { Q as quant } from "./seed-quant";
import { Q as verbal } from "./seed-verbal";
import { Q as logical } from "./seed-logical";
import { Q as di } from "./seed-di";
import { Q as numerical } from "./seed-numerical";
import { Q as criticalReasoning } from "./seed-critical-reasoning";

const BANK: [Subject, QuestionSeed[]][] = [
  ["quant", quant],
  ["verbal", verbal],
  ["logical", logical],
  ["di", di],
  ["numerical", numerical],
  ["critical_reasoning", criticalReasoning],
];

type Answer = number | string;
const r2 = (n: number) => Math.round(n * 100) / 100;
const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function pctValue(text: string): number | null {
  if (text === "No change") return 0;
  const m = text.match(/^([\d.]+)% (increase|decrease)$/);
  return m ? Number(m[1]) * (m[2] === "increase" ? 1 : -1) : null;
}
function toNumber(text: string): number | null {
  const pct = pctValue(text);
  if (pct !== null) return pct;
  const cleaned = text.replace(/[₹,°%]/g, "").replace(/ (km|hr)$/, "").trim();
  return /^-?\d+(\.\d+)?$/.test(cleaned) ? Number(cleaned) : null;
}

function nextInSeries(terms: number[]): number | null {
  const ratio = terms[1] / terms[0];
  if (terms.every((t) => t !== 0) && Number.isInteger(ratio) && ratio > 1 && terms.every((t, i) => i === 0 || t === terms[i - 1] * ratio)) {
    return terms[terms.length - 1] * ratio;
  }
  const d = terms.slice(1).map((t, i) => t - terms[i]);
  const dd = d.slice(1).map((x, i) => x - d[i]);
  if (dd.every((x) => x === dd[0])) return terms[terms.length - 1] + d[d.length - 1] + dd[0];
  return null;
}
function nextLetterTerm(terms: string[]): string | null {
  const len = terms[0].length;
  if (!terms.every((t) => t.length === len && /^[A-Z]+$/.test(t))) return null;
  let out = "";
  for (let p = 0; p < len; p++) {
    const pos = terms.map((t) => ALPHA.indexOf(t[p]));
    const step = (pos[1] - pos[0] + 26) % 26;
    if (!pos.every((v, i) => i === 0 || (v - pos[i - 1] + 26) % 26 === step)) return null;
    out += ALPHA[(pos[pos.length - 1] + step) % 26];
  }
  return out;
}
function solveRatio(a: number, b: number, k: number, p: number, q: number): number | null {
  // (a x + k)/(b x + k) = p/q  =>  x = k(p - q)/(q a - p b)
  const x = (k * (p - q)) / (q * a - p * b);
  return Number.isInteger(x) && x > 0 ? x : null;
}
function parseTable(t: string): Map<string, number[]> {
  const rows = new Map<string, number[]>();
  for (const m of t.matchAll(/^([A-Za-z]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*$/gm)) {
    rows.set(m[1], [m[2], m[3], m[4], m[5]].map(Number));
  }
  return rows;
}
function parsePie(t: string) {
  const total = Number(t.match(/budget of ₹(\d+) lakh/)![1]);
  const pcts = new Map<string, number>();
  for (const m of t.matchAll(/^(.+): (\d+)%$/gm)) pcts.set(m[1], Number(m[2]));
  return { total, pcts };
}
const DS = {
  I: "Statement I alone is sufficient",
  II: "Statement II alone is sufficient",
  both: "Both statements together are needed, but neither alone suffices",
  each: "Each statement alone is sufficient",
};
function weakStatementTrue(stmt: string, x: number): boolean {
  let m;
  if ((m = stmt.match(/^x is an (even|odd) number$/))) return (x % 2 === 0) === (m[1] === "even");
  if ((m = stmt.match(/^x is greater than (-?\d+)$/))) return x > Number(m[1]);
  if ((m = stmt.match(/^x is a multiple of (\d+)$/))) return x % Number(m[1]) === 0;
  return false;
}

// Each solver reads ONLY the question text. Returns null when it doesn't apply.
// Throws when the question itself is defective (e.g. ambiguous, untrue premise).
function solve(qt: string): Answer | null {
  let m: RegExpMatchArray | null;
  if ((m = qt.match(/^Find the next (?:term|letter) in the series: (.+), \?$/)) || (m = qt.match(/^Find the next term: (.+), \?$/))) {
    const parts = m[1].split(", ");
    if (parts.every((p) => /^-?\d+$/.test(p))) return nextInSeries(parts.map(Number));
    return nextLetterTerm(parts);
  }
  if ((m = qt.match(/increased by (\d+)% and then decreased by (\d+)%/))) return r2(+m[1] - +m[2] - (+m[1] * +m[2]) / 100);
  if ((m = qt.match(/In a survey of (\d+) people, (\d+)% preferred/))) return (+m[1] * +m[2]) / 100;
  if ((m = qt.match(/one got (\d+)% of the valid votes\. (\d+)% of the total (\d+) votes cast were invalid/)))
    return (((+m[3] * (100 - +m[2])) / 100) * (100 - +m[1])) / 100;
  if ((m = qt.match(/at a (\d+)% discount on the marked price and sells it at the marked price/))) return r2((+m[1] / (100 - +m[1])) * 100);
  if ((m = qt.match(/buys an article for ₹(\d+) and sells it at a profit of (\d+)%/))) return (+m[1] * (100 + +m[2])) / 100;
  if ((m = qt.match(/buys a good for ₹(\d+) and, due to damage, sells it at a loss of (\d+)%/))) return (+m[1] * (100 - +m[2])) / 100;
  if ((m = qt.match(/ratio (\d+):(\d+)\. If (\d+) is added to both, the ratio becomes (\d+):(\d+)\. Find the larger/))) {
    const x = solveRatio(+m[1], +m[2], +m[3], +m[4], +m[5]);
    if (x === null) throw new Error("ratio equation has no positive integer solution");
    return +m[2] * x;
  }
  if ((m = qt.match(/ratio (\d+):(\d+)\. After (\d+) years, the ratio becomes (\d+):(\d+)\. Find A's current age/))) {
    const x = solveRatio(+m[1], +m[2], +m[3], +m[4], +m[5]);
    if (x === null) throw new Error("age-ratio equation has no positive integer solution");
    return +m[1] * x;
  }
  if ((m = qt.match(/average of (\d+) numbers is (\d+)\. A new number (\d+) is added/))) return r2((+m[1] * +m[2] + +m[3]) / (+m[1] + 1));
  if ((m = qt.match(/average weight of (\d+) students is (\d+) kg\. One student weighing (\d+) kg is replaced by a new student weighing (\d+) kg/)))
    return r2(+m[2] + (+m[4] - +m[3]) / +m[1]);
  if ((m = qt.match(/complete a piece of work in (\d+) days and B can complete it in (\d+) days\. Working together/)))
    return r2((+m[1] * +m[2]) / (+m[1] + +m[2]));
  if ((m = qt.match(/A and B can do a work in (\d+) and (\d+) days respectively\. They work together for (\d+) days, after which B leaves/)))
    return r2((1 - +m[3] * (1 / +m[1] + 1 / +m[2])) * +m[1]);
  if ((m = qt.match(/constant speed of (\d+) km\/hr for (\d+) hours/))) return +m[1] * +m[2];
  if ((m = qt.match(/(\d+) km apart, start moving towards each other at (\d+) km\/hr and (\d+) km\/hr/))) return r2(+m[1] / (+m[2] + +m[3]));
  if ((m = qt.match(/Two dice are thrown together\. What is the probability that the sum of the numbers shown is (\d+)\?/))) {
    let count = 0;
    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === +m[1]) count++;
    return `${count}/36`;
  }
  if (/drawn at random from a well-shuffled standard deck of 52 cards\. What is the probability that it is a (hearts|spades|clubs|diamonds) card/.test(qt)) return "13/52";
  if ((m = qt.match(/In how many ways can (\d+) distinct letters be arranged out of (\d+) distinct letters/))) return fact(+m[2]) / fact(+m[2] - +m[1]);
  if ((m = qt.match(/committee of (\d+) people be chosen from a group of (\d+) people/))) return fact(+m[2]) / (fact(+m[1]) * fact(+m[2] - +m[1]));
  if ((m = qt.match(/^Find the (LCM|HCF) of (\d+) and (\d+)\.$/))) {
    const h = gcd(+m[2], +m[3]);
    return m[1] === "HCF" ? h : (+m[2] * +m[3]) / h;
  }
  if ((m = qt.match(/remainder when (\d+) is divided by (\d+)/))) return +m[1] % +m[2];
  if ((m = qt.match(/simple interest on ₹(\d+) at (\d+)% per annum for (\d+) years/))) return (+m[1] * +m[2] * +m[3]) / 100;
  if ((m = qt.match(/compound interest on ₹(\d+) at (\d+)% per annum, compounded annually, for (\d+) years/)))
    return r2(+m[1] * Math.pow(1 + +m[2] / 100, +m[3]) - +m[1]);

  // ---- Logical ----
  if ((m = qt.match(/In a certain code, ([A-Z]+) is written as ([A-Z]+)\. How is ([A-Z]+) written/))) {
    const [w1, c1, w2] = [m[1], m[2], m[3]];
    if (w1.length !== c1.length) return null;
    const shift = (ALPHA.indexOf(c1[0]) - ALPHA.indexOf(w1[0]) + 26) % 26;
    if (![...w1].every((ch, i) => (ALPHA.indexOf(c1[i]) - ALPHA.indexOf(ch) + 26) % 26 === shift)) return null;
    return [...w2].map((ch) => ALPHA[(ALPHA.indexOf(ch) + shift) % 26]).join("");
  }
  if ((m = qt.match(/If ([A-Z]+) is coded as ([\d-]+), how is ([A-Z]+) coded/))) {
    const code = (w: string) => [...w].map((ch) => ALPHA.indexOf(ch) + 1).join("-");
    if (code(m[1]) !== m[2]) throw new Error("example code in the question is itself wrong");
    return code(m[3]);
  }
  if (/^Statements: All (\w+) are (\w+)\. All \2 are (\w+)\.\nConclusion: All \1 are \3\./.test(qt)) return "Yes, it follows";
  if (/^Statements: Some (\w+) are (\w+)\. No \2 is (\w+)\.\nConclusion: Some \1 are not \3\./.test(qt)) return "Yes, it follows";

  // ---- DI ----
  if (qt.includes("The table below shows quarterly figures")) {
    const rows = parseTable(qt);
    if ((m = qt.match(/What is (\w+)'s total across all four quarters/))) return rows.get(m[1])!.reduce((a, b) => a + b, 0);
    if ((m = qt.match(/What is (\w+)'s average quarterly figure/))) return r2(rows.get(m[1])!.reduce((a, b) => a + b, 0) / 4);
    if ((m = qt.match(/percentage change in (\w+)'s figure from Q1 to Q4/))) {
      const v = rows.get(m[1])!;
      return r2(((v[3] - v[0]) / v[0]) * 100);
    }
    if ((m = qt.match(/combined Q(\d) figure across all cities/))) return [...rows.values()].reduce((s, v) => s + v[+m![1] - 1], 0);
    if ((m = qt.match(/Which city had the highest figure in Q(\d)/))) {
      const col = [...rows.entries()].map(([k, v]) => [k, v[+m![1] - 1]] as const);
      const max = Math.max(...col.map(([, v]) => v));
      const winners = col.filter(([, v]) => v === max);
      if (winners.length > 1) throw new Error(`tie for highest (${winners.map(([k]) => k).join(", ")}) — ambiguous`);
      return winners[0][0];
    }
  }
  if (qt.includes("annual budget of ₹")) {
    const { total, pcts } = parsePie(qt);
    const sum = [...pcts.values()].reduce((a, b) => a + b, 0);
    if (sum !== 100) throw new Error(`pie shares sum to ${sum}%, not 100%`);
    if ((m = qt.match(/allocated to (.+)\?$/))) return (total * pcts.get(m[1])!) / 100;
    if ((m = qt.match(/representing (.+)'s share\?$/))) return r2(pcts.get(m[1])! * 3.6);
    if ((m = qt.match(/By what percentage is (.+?)'s budget more or less than (.+?)'s\?$/))) {
      const a = (total * pcts.get(m[1])!) / 100;
      const b = (total * pcts.get(m[2])!) / 100;
      return r2(((a - b) / b) * 100);
    }
  }

  // ---- Data sufficiency ----
  if ((m = qt.match(/^What is the value of x\?\nI\. x \+ (\d+) = (\d+)\nII\. (\d+)x = (\d+)$/))) {
    if (+m[2] - +m[1] !== +m[4] / +m[3]) throw new Error("the two statements give different values of x");
    return DS.each;
  }
  if (/^What is the value of x \+ y\?\nI\. x = \d+\nII\. y = \d+$/.test(qt)) return DS.both;
  if ((m = qt.match(/^What is the area of a rectangle\?\nI\. Its length is (\d+) cm\nII\. Its perimeter is (\d+) cm$/))) {
    if (+m[2] / 2 - +m[1] <= 0) throw new Error("perimeter too small for the given length");
    return DS.both;
  }
  if ((m = qt.match(/^What is the value of x\?\nI\. (.+)\nII\. (.+)$/))) {
    const exact = [m[1], m[2]].map((s) => s.match(/^x = (\d+)$/));
    if (exact.filter(Boolean).length !== 1) return null;
    const idx = exact[0] ? 0 : 1;
    const x = Number(exact[idx]![1]);
    if (!weakStatementTrue(idx === 0 ? m[2] : m[1], x)) throw new Error("the non-exact statement is false for the stated x");
    return idx === 0 ? DS.I : DS.II;
  }
  return null;
}

function same(a: Answer, optionText: string): boolean {
  if (typeof a === "string") return a.trim().toLowerCase() === optionText.trim().toLowerCase();
  const n = toNumber(optionText);
  return n !== null && Math.abs(n - a) < 0.006;
}
const norm = (s: string) => s.toLowerCase().replace(/[₹,]/g, "").replace(/(\.\d*?)0+\b/g, "$1");

const problems: string[] = [];
const seenText = new Map<string, Subject>();
let total = 0;
let solved = 0;

for (const [subject, questions] of BANK) {
  let subjectSolved = 0;
  for (const q of questions) {
    total++;
    const where = `[${subject}] ${q.question_text.slice(0, 90).replace(/\n/g, " ")}`;
    const fail = (msg: string) => problems.push(`${where}\n    → ${msg}`);

    const key = `${q.question_text}\n${q.options.map((o) => o.text).sort().join("|")}`;
    if (seenText.has(key)) fail(`duplicate question (also in ${seenText.get(key)})`);
    seenText.set(key, subject);
    if (q.options.length !== 4 || q.options.map((o) => o.key).join("") !== "ABCD") fail("must have exactly options A, B, C, D");
    const texts = q.options.map((o) => o.text.trim().toLowerCase());
    if (texts.some((t) => !t)) fail("empty option text");
    if (new Set(texts).size !== texts.length) fail(`duplicate option texts: ${q.options.map((o) => o.text).join(" | ")}`);
    const correct = q.options.find((o) => o.key === q.correct_option_key);
    if (!correct) {
      fail(`correct_option_key "${q.correct_option_key}" is not an option`);
      continue;
    }
    for (const field of ["question_text", "explanation", "concept", "exam_tip"] as const) if (!q[field]?.trim()) fail(`empty ${field}`);
    if (!["easy", "medium", "hard"].includes(q.difficulty)) fail(`bad difficulty ${q.difficulty}`);
    // Numeric answers must appear in the explanation's working — catches an
    // explanation that derives one number while a different option is marked.
    const answerNum = toNumber(correct.text);
    if (answerNum !== null && !norm(q.explanation).includes(String(Math.abs(answerNum))))
      fail(`explanation never arrives at the marked answer "${correct.text}"`);

    let expected: Answer | null;
    try {
      expected = solve(q.question_text);
    } catch (e) {
      fail(`defective question: ${(e as Error).message}`);
      continue;
    }
    if (expected === null) continue;
    subjectSolved++;
    if (!same(expected, correct.text)) fail(`independent solver says ${expected}, but marked answer is "${correct.text}"`);
    const clash = q.options.filter((o) => o.key !== q.correct_option_key && same(expected!, o.text));
    if (clash.length) fail(`a distractor ("${clash[0].text}") is also correct`);
  }
  solved += subjectSolved;
  console.log(`${subject.padEnd(19)} ${String(questions.length).padStart(4)} questions · ${String(subjectSolved).padStart(4)} independently re-solved`);
}

console.log(`\n${total} questions checked, ${solved} re-solved from question text alone, ${problems.length} problem(s).`);
if (problems.length) {
  console.log("\n" + problems.join("\n"));
  process.exit(1);
}
