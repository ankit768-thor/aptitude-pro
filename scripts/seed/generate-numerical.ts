import type { QuestionSeed } from "./lib";
import { opts } from "./lib";
import { generateUnique, numericOptions, pick, randInt } from "./genlib";

const DS_OPTIONS = () =>
  opts(
    "Statement I alone is sufficient",
    "Statement II alone is sufficient",
    "Both statements together are needed, but neither alone suffices",
    "Each statement alone is sufficient",
  );

// ---- Number Series ----
function tplArithmetic(r: () => number): QuestionSeed {
  const start = randInt(r, 1, 30);
  const step = randInt(r, 2, 12) * (r() < 0.2 ? -1 : 1);
  const terms = [0, 1, 2, 3, 4].map((i) => start + i * step);
  const next = start + 5 * step;
  const { options, correct_option_key } = numericOptions(r, next, [next + step, next - step, next + 2 * step]);
  return {
    question_type: "Number Series",
    question_text: `Find the next term: ${terms.join(", ")}, ?`,
    options,
    correct_option_key,
    difficulty: "easy",
    explanation: `Each term ${step > 0 ? "increases" : "decreases"} by ${Math.abs(step)}. Next term = ${terms[4]} ${step > 0 ? "+" : "-"} ${Math.abs(step)} = ${next}.`,
    concept: "Arithmetic series with a constant common difference",
    exam_tip: "Check the difference between consecutive terms first — a constant difference means it's a simple AP.",
  };
}

function tplGeometric(r: () => number): QuestionSeed {
  const start = randInt(r, 1, 6);
  const ratio = pick(r, [2, 3]);
  const terms = [0, 1, 2, 3].map((i) => start * Math.pow(ratio, i));
  const next = start * Math.pow(ratio, 4);
  const { options, correct_option_key } = numericOptions(r, next, [next / ratio, next + start, next * ratio]);
  return {
    question_type: "Number Series",
    question_text: `Find the next term: ${terms.join(", ")}, ?`,
    options,
    correct_option_key,
    difficulty: "medium",
    explanation: `Each term is multiplied by ${ratio} to get the next. ${terms[3]} × ${ratio} = ${next}.`,
    concept: "Geometric series with a constant ratio",
    exam_tip: "If each term divided by the previous gives the same constant, it's a geometric series.",
  };
}

function tplSquareOffset(r: () => number): QuestionSeed {
  const k = randInt(r, 1, 6);
  const c = randInt(r, -5, 5);
  const terms = [0, 1, 2, 3].map((i) => (k + i) * (k + i) + c);
  const next = (k + 4) * (k + 4) + c;
  const { options, correct_option_key } = numericOptions(r, next, [next - 2 * (k + 4) + 1, next + (k + 4), next - (k + 4)]);
  return {
    question_type: "Number Series",
    question_text: `Find the next term: ${terms.join(", ")}, ?`,
    options,
    correct_option_key,
    difficulty: "medium",
    explanation: `Each term is a perfect square${c !== 0 ? ` ${c > 0 ? "plus" : "minus"} ${Math.abs(c)}` : ""}: ${[0, 1, 2, 3, 4].map((i) => `${k + i}²${c !== 0 ? (c > 0 ? `+${c}` : c) : ""}`).join(", ")} = ${[...terms, next].join(", ")}.`,
    concept: "Perfect-square series with a constant offset",
    exam_tip: "If terms are close to consecutive squares, subtract the nearest square to spot a constant offset.",
  };
}

function tplDifferenceOfDifferences(r: () => number): QuestionSeed {
  const start = randInt(r, 1, 10);
  const firstDiff = randInt(r, 2, 6);
  const diffStep = randInt(r, 1, 4);
  const terms = [start];
  let diff = firstDiff;
  for (let i = 0; i < 4; i++) {
    terms.push(terms[terms.length - 1] + diff);
    diff += diffStep;
  }
  const next = terms[terms.length - 1] + diff;
  const { options, correct_option_key } = numericOptions(r, next, [next - diffStep, next + diffStep, terms[terms.length - 1] + firstDiff]);
  return {
    question_type: "Number Series",
    question_text: `Find the next term: ${terms.join(", ")}, ?`,
    options,
    correct_option_key,
    difficulty: "hard",
    explanation: `The differences between terms increase by ${diffStep} each time (${firstDiff}, ${firstDiff + diffStep}, ...). The next difference is ${diff}, so the next term = ${terms[terms.length - 1]} + ${diff} = ${next}.`,
    concept: "Series with a steadily increasing difference",
    exam_tip: "When the first-level differences aren't constant, check if THEY form their own arithmetic series.",
  };
}

// ---- Data Sufficiency ----
function tplDsEachAloneSufficient(r: () => number): QuestionSeed {
  const a = randInt(r, 2, 15);
  const x = randInt(r, 3, 20);
  const b = a + x;
  const c = pick(r, [2, 3, 4]);
  const d = c * x;
  return {
    question_type: "Data Sufficiency",
    question_text: `What is the value of x?\nI. x + ${a} = ${b}\nII. ${c}x = ${d}`,
    options: DS_OPTIONS(),
    correct_option_key: "D",
    difficulty: "easy",
    explanation: `Statement I alone: x = ${b} − ${a} = ${x}. Statement II alone: x = ${d}/${c} = ${x}. Each statement alone is sufficient.`,
    concept: "Data sufficiency — independent equations",
    exam_tip: "Always test each statement completely on its own before considering combining them.",
  };
}

function tplDsOneAloneSufficient(r: () => number): QuestionSeed {
  const x = randInt(r, 10, 60);
  const first = r() < 0.5;
  const suffStmt = `x = ${x}`;
  const trueDivisors = [2, 3, 5].filter((d) => x % d === 0);
  const weakOptions = [`x is ${x % 2 === 0 ? "an even" : "an odd"} number`, `x is greater than ${x - randInt(r, 5, 15)}`];
  if (trueDivisors.length > 0) weakOptions.push(`x is a multiple of ${pick(r, trueDivisors)}`);
  const weakStmt = pick(r, weakOptions);
  const stmtI = first ? suffStmt : weakStmt;
  const stmtII = first ? weakStmt : suffStmt;
  return {
    question_type: "Data Sufficiency",
    question_text: `What is the value of x?\nI. ${stmtI}\nII. ${stmtII}`,
    options: DS_OPTIONS(),
    correct_option_key: first ? "A" : "B",
    difficulty: "medium",
    explanation: `"${suffStmt}" alone pins down x exactly. "${weakStmt}" alone is true of many possible values of x, so it isn't sufficient by itself.`,
    concept: "Data sufficiency — one exact statement vs. one non-determining statement",
    exam_tip: "A statement that's consistent with many different values can never be sufficient on its own.",
  };
}

function tplDsBothTogether(r: () => number): QuestionSeed {
  const x = randInt(r, 5, 40);
  const y = randInt(r, 5, 40);
  return {
    question_type: "Data Sufficiency",
    question_text: `What is the value of x + y?\nI. x = ${x}\nII. y = ${y}`,
    options: DS_OPTIONS(),
    correct_option_key: "C",
    difficulty: "medium",
    explanation: `Statement I alone gives x but not y — insufficient. Statement II alone gives y but not x — insufficient. Together, x + y = ${x} + ${y} = ${x + y} — sufficient.`,
    concept: "Data sufficiency — needing both statements to combine into the asked quantity",
    exam_tip: "When the question asks for a combination of two unknowns, check whether each statement alone gives only one of them.",
  };
}

function tplDsRectangleAreaPerimeter(r: () => number): QuestionSeed {
  const length = randInt(r, 6, 20);
  const width = randInt(r, 4, 18);
  const perimeter = 2 * (length + width);
  return {
    question_type: "Data Sufficiency",
    question_text: `What is the area of a rectangle?\nI. Its length is ${length} cm\nII. Its perimeter is ${perimeter} cm`,
    options: DS_OPTIONS(),
    correct_option_key: "C",
    difficulty: "medium",
    explanation: `Statement I alone gives only length, not width — insufficient. Statement II alone gives length+width=${perimeter / 2}, but not each individually — insufficient. Together: width = ${perimeter / 2} − ${length} = ${width}, so area = ${length} × ${width} = ${length * width} cm² — sufficient together.`,
    concept: "Data sufficiency — combining a direct value with a relational equation",
    exam_tip: "A perimeter alone never determines area — you always need at least one individual side length too.",
  };
}

export function generateNumerical(): QuestionSeed[] {
  return generateUnique(
    300,
    [tplArithmetic, tplGeometric, tplSquareOffset, tplDifferenceOfDifferences, tplDsEachAloneSufficient, tplDsOneAloneSufficient, tplDsBothTogether, tplDsRectangleAreaPerimeter],
    5566778,
  );
}

if (require.main === module) {
  const qs = generateNumerical();
  console.log(`generated ${qs.length} numerical questions`);
  console.log(JSON.stringify(qs.slice(0, 2), null, 2));
}
