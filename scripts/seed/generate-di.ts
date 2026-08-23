import type { QuestionSeed } from "./lib";
import { opts } from "./lib";
import { generateUnique, numericOptions, randInt } from "./genlib";

const CITIES = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Pune", "Hyderabad", "Kolkata", "Jaipur"];
const CATEGORIES = ["Sales", "Marketing", "Operations", "R&D", "HR", "Logistics", "Support", "Finance"];
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

function pickN<T>(r: () => number, pool: T[], n: number): T[] {
  const copy = [...pool];
  const out: T[] = [];
  for (let i = 0; i < n; i++) out.push(copy.splice(randInt(r, 0, copy.length - 1), 1)[0]);
  return out;
}

function buildTable(r: () => number, rowLabels: string[]): { text: string; rows: number[][] } {
  const rows = rowLabels.map(() => QUARTERS.map(() => randInt(r, 8, 25) * 10));
  const header = `           ${QUARTERS.map((q) => q.padEnd(6)).join("")}`;
  const lines = rowLabels.map((label, i) => `${label.padEnd(11)}${rows[i].map((v) => String(v).padEnd(6)).join("")}`);
  const text = `The table below shows quarterly figures (₹ lakh):\n\n${header}\n${lines.join("\n")}`;
  return { text, rows };
}

function tplTableRowTotal(r: () => number): QuestionSeed {
  const rowLabels = pickN(r, CITIES, 3);
  const { text, rows } = buildTable(r, rowLabels);
  const idx = randInt(r, 0, rowLabels.length - 1);
  const total = rows[idx].reduce((a, b) => a + b, 0);
  const { options, correct_option_key } = numericOptions(r, total, [total - 10, total + 20, total - 30]);
  return {
    question_type: "Tables",
    question_text: `${text}\n\nQuestion: What is ${rowLabels[idx]}'s total across all four quarters?`,
    options,
    correct_option_key,
    difficulty: "easy",
    explanation: `${rowLabels[idx]}'s total = ${rows[idx].join(" + ")} = ${total}.`,
    concept: "Table-based row total",
    exam_tip: "For 'total' questions, add straight along one row — don't touch the other rows.",
  };
}

function tplTableHighestInPeriod(r: () => number): QuestionSeed {
  const rowLabels = pickN(r, CITIES, 4);
  const { text, rows } = buildTable(r, rowLabels);
  const qIdx = randInt(r, 0, QUARTERS.length - 1);
  const colVals = rows.map((row) => row[qIdx]);
  const maxVal = Math.max(...colVals);
  const correctIdx = colVals.indexOf(maxVal);
  return {
    question_type: "Tables",
    question_text: `${text}\n\nQuestion: Which city had the highest figure in ${QUARTERS[qIdx]}?`,
    options: opts(rowLabels[0], rowLabels[1], rowLabels[2], rowLabels[3]),
    correct_option_key: ["A", "B", "C", "D"][correctIdx],
    difficulty: "easy",
    explanation: `${QUARTERS[qIdx]} values: ${rowLabels.map((l, i) => `${l}=${colVals[i]}`).join(", ")}. ${rowLabels[correctIdx]} is highest.`,
    concept: "Table-based comparison across a single column",
    exam_tip: "For 'which is highest in [period]' questions, scan only that one column, not the whole table.",
  };
}

function tplTablePctChange(r: () => number): QuestionSeed {
  const rowLabels = pickN(r, CITIES, 3);
  const { text, rows } = buildTable(r, rowLabels);
  const idx = randInt(r, 0, rowLabels.length - 1);
  const from = rows[idx][0];
  const to = rows[idx][3];
  const pctChange = Math.round(((to - from) / from) * 10000) / 100;
  const fmt = (n: number) => `${n}%`;
  const { options, correct_option_key } = numericOptions(r, pctChange, [Math.round(((to - from) / to) * 10000) / 100, pctChange + 5, pctChange - 10], fmt);
  return {
    question_type: "Tables",
    question_text: `${text}\n\nQuestion: What is the percentage change in ${rowLabels[idx]}'s figure from Q1 to Q4?`,
    options,
    correct_option_key,
    difficulty: "medium",
    explanation: `Change = ${to} − ${from} = ${to - from}. Percentage change = ${to - from}/${from} × 100 = ${pctChange}%.`,
    concept: "Percentage change from table values",
    exam_tip: "Percentage change is always (change ÷ original/Q1 value) × 100 — using Q4 as the base is the most common DI mistake.",
  };
}

function tplTableColumnSum(r: () => number): QuestionSeed {
  const rowLabels = pickN(r, CITIES, 3);
  const { text, rows } = buildTable(r, rowLabels);
  const qIdx = randInt(r, 0, QUARTERS.length - 1);
  const total = rows.reduce((sum, row) => sum + row[qIdx], 0);
  const { options, correct_option_key } = numericOptions(r, total, [total - 20, total + 30, total - 50]);
  return {
    question_type: "Tables",
    question_text: `${text}\n\nQuestion: What is the combined ${QUARTERS[qIdx]} figure across all cities?`,
    options,
    correct_option_key,
    difficulty: "easy",
    explanation: `${QUARTERS[qIdx]} total = ${rows.map((row) => row[qIdx]).join(" + ")} = ${total}.`,
    concept: "Table-based column sum",
    exam_tip: "Add across a single column (not down a row) for 'combined' questions about one time period.",
  };
}

function tplTableAverage(r: () => number): QuestionSeed {
  const rowLabels = pickN(r, CITIES, 3);
  const { text, rows } = buildTable(r, rowLabels);
  const idx = randInt(r, 0, rowLabels.length - 1);
  const total = rows[idx].reduce((a, b) => a + b, 0);
  const avg = Math.round((total / 4) * 100) / 100;
  const { options, correct_option_key } = numericOptions(r, avg, [total, avg + 10, avg - 5]);
  return {
    question_type: "Tables",
    question_text: `${text}\n\nQuestion: What is ${rowLabels[idx]}'s average quarterly figure for the year?`,
    options,
    correct_option_key,
    difficulty: "easy",
    explanation: `${rowLabels[idx]}'s total = ${total}. Average = ${total}/4 = ${avg}.`,
    concept: "Table-based average",
    exam_tip: "Divide the row total by the number of periods (4 quarters), not by the number of rows.",
  };
}

// ---- Pie Charts ----
function buildPie(r: () => number): { labels: string[]; pcts: number[]; total: number } {
  const labels = pickN(r, CATEGORIES, 5);
  let remaining = 100;
  const pcts: number[] = [];
  for (let i = 0; i < labels.length - 1; i++) {
    const v = randInt(r, 8, Math.min(30, remaining - (labels.length - 1 - i) * 5));
    pcts.push(v);
    remaining -= v;
  }
  pcts.push(remaining);
  const total = randInt(r, 40, 100) * 100;
  return { labels, pcts, total };
}
function pieText(labels: string[], pcts: number[], total: number): string {
  const lines = labels.map((l, i) => `${l}: ${pcts[i]}%`).join("\n");
  return `A company's total annual budget of ₹${total} lakh is distributed across departments as shown:\n\n${lines}`;
}

function tplPieValue(r: () => number): QuestionSeed {
  const { labels, pcts, total } = buildPie(r);
  const idx = randInt(r, 0, labels.length - 1);
  const value = Math.round((total * pcts[idx]) / 100);
  const { options, correct_option_key } = numericOptions(r, value, [Math.round(total * 0.1), value + 20, Math.round(total * (pcts[idx] + 5)) / 100]);
  return {
    question_type: "Pie Charts",
    question_text: `${pieText(labels, pcts, total)}\n\nQuestion: What is the budget (in ₹ lakh) allocated to ${labels[idx]}?`,
    options,
    correct_option_key,
    difficulty: "easy",
    explanation: `${labels[idx]}'s allocation = ${pcts[idx]}% of ${total} = ${value}.`,
    concept: "Pie chart — value from percentage share",
    exam_tip: "Multiply the total by the percentage (as a fraction) directly — no need to compute other slices first.",
  };
}

function tplPieAngle(r: () => number): QuestionSeed {
  const { labels, pcts, total } = buildPie(r);
  const idx = randInt(r, 0, labels.length - 1);
  const angle = Math.round(pcts[idx] * 3.6 * 100) / 100;
  const { options, correct_option_key } = numericOptions(r, angle, [pcts[idx], angle + 18, angle - 36], (n) => `${n}°`);
  return {
    question_type: "Pie Charts",
    question_text: `${pieText(labels, pcts, total)}\n\nQuestion: What is the central angle (in degrees) representing ${labels[idx]}'s share?`,
    options,
    correct_option_key,
    difficulty: "medium",
    explanation: `Central angle = (percentage/100) × 360° = (${pcts[idx]}/100) × 360 = ${angle}°.`,
    shortcut: "Multiply the percentage directly by 3.6 to get the angle in degrees.",
    concept: "Pie chart — converting percentage share to a central angle",
    exam_tip: "360° corresponds to 100%, so each 1% is exactly 3.6°.",
  };
}

function tplPieCompare(r: () => number): QuestionSeed {
  const { labels, pcts, total } = buildPie(r);
  const i = randInt(r, 0, labels.length - 1);
  const j = (i + 1 + randInt(r, 0, labels.length - 2)) % labels.length;
  const valA = Math.round((total * pcts[i]) / 100);
  const valB = Math.round((total * pcts[j]) / 100);
  const diffPct = Math.round(((valA - valB) / valB) * 10000) / 100;
  const { options, correct_option_key } = numericOptions(r, diffPct, [Math.abs(diffPct), diffPct + 10, -diffPct], (n) => `${n}%`);
  return {
    question_type: "Pie Charts",
    question_text: `${pieText(labels, pcts, total)}\n\nQuestion: By what percentage is ${labels[i]}'s budget more or less than ${labels[j]}'s?`,
    options,
    correct_option_key,
    difficulty: "hard",
    explanation: `${labels[i]} = ${valA}, ${labels[j]} = ${valB}. Difference% = (${valA}−${valB})/${valB} × 100 = ${diffPct}%.`,
    concept: "Pie chart — percentage difference between two slices",
    exam_tip: "Compute both actual values first, then apply the percentage-difference formula relative to the second value.",
  };
}

export function generateDi(): QuestionSeed[] {
  return generateUnique(
    300,
    [tplTableRowTotal, tplTableHighestInPeriod, tplTablePctChange, tplTableColumnSum, tplTableAverage, tplPieValue, tplPieAngle, tplPieCompare],
    998877,
  );
}

if (require.main === module) {
  const qs = generateDi();
  console.log(`generated ${qs.length} di questions`);
  console.log(JSON.stringify(qs.slice(0, 2), null, 2));
}
