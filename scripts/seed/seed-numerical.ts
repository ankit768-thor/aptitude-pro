import { appendUnique } from "./genlib";
import { seedSubjectQuestions, opts, type QuestionSeed } from "./lib";
import { generateNumerical } from "./generate-numerical";

export const Q: QuestionSeed[] = [];
function add(q: QuestionSeed) {
  Q.push(q);
}

// ==== Number Series ====
add({
  question_type: "Number Series",
  question_text: "Find the next term: 2, 6, 12, 20, 30, ?",
  options: opts("42", "40", "44", "38"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Each term is n×(n+1): 1×2, 2×3, 3×4, 4×5, 5×6, 6×7=42.",
  concept: "Number series based on n(n+1)",
  exam_tip: "If differences between terms increase by 2 each time (4,6,8,10,...), suspect an n(n+1)-type pattern.",
});
add({
  question_type: "Number Series",
  question_text: "Find the next term: 3, 7, 15, 31, 63, ?",
  options: opts("127", "125", "129", "123"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Each term is double the previous plus 1: 3×2+1=7, 7×2+1=15, ..., 63×2+1=127.",
  concept: "Number series with a ×2+1 rule",
  exam_tip: "If a series roughly doubles each time, check for a ×2 ± constant rule rather than a simple addition pattern.",
});
add({
  question_type: "Number Series",
  question_text: "Find the next term: 1, 4, 9, 16, 25, ?",
  options: opts("36", "35", "49", "30"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "These are perfect squares: 1², 2², 3², 4², 5², 6²=36.",
  concept: "Perfect square series",
  exam_tip: "Memorize squares up to 15² — they appear constantly in number series questions.",
});
add({
  question_type: "Number Series",
  question_text: "Find the missing term: 5, 10, 20, 40, ?, 160",
  options: opts("80", "70", "90", "75"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Each term doubles the previous: 40×2=80, and 80×2=160 confirms it.",
  concept: "Geometric (doubling) series",
  exam_tip: "When a term is missing in the middle, verify your answer against BOTH the term before and after it.",
});
add({
  question_type: "Number Series",
  question_text: "Find the next term: 100, 90, 81, 73, 66, ?",
  options: opts("60", "61", "59", "62"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "The differences decrease by 1 each time: −10, −9, −8, −7, −6. 66 − 6 = 60.",
  concept: "Number series with decreasing differences",
  exam_tip: "List out the differences between consecutive terms first — the pattern is usually clearer in the differences than the terms themselves.",
});
add({
  question_type: "Number Series",
  question_text: "Find the next term: 2, 3, 5, 8, 13, 21, ?",
  options: opts("34", "33", "35", "32"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Each term is the sum of the two preceding terms (Fibonacci-style): 13+21=34.",
  concept: "Fibonacci-style series",
  exam_tip: "If each term looks close to the sum of the previous two, test the Fibonacci pattern immediately.",
});
add({
  question_type: "Number Series",
  question_text: "Find the missing term: 7, 14, 28, 56, ?, 224",
  options: opts("112", "110", "114", "108"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Each term doubles the previous: 56×2=112, and 112×2=224 confirms it.",
  concept: "Geometric (doubling) series",
  exam_tip: "For a missing middle term in a doubling series, halve the term after it as a quick cross-check.",
});
add({
  question_type: "Number Series",
  question_text: "Find the missing term: 1, 8, 27, 64, ?, 216",
  options: opts("125", "120", "130", "110"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "These are perfect cubes: 1³, 2³, 3³, 4³, 5³=125, 6³=216.",
  concept: "Perfect cube series",
  exam_tip: "Memorize cubes up to 10³ — recognizing them instantly saves valuable time.",
});
add({
  question_type: "Number Series",
  question_text: "Find the next term: 4, 9, 16, 25, 36, ?",
  options: opts("49", "48", "50", "45"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "These are squares of consecutive integers starting from 2: 2²,3²,4²,5²,6²,7²=49.",
  concept: "Perfect square series (offset)",
  exam_tip: "If a series resembles squares but is offset, identify the starting integer first (here, 2² not 1²).",
});
add({
  question_type: "Number Series",
  question_text: "Find the next term: 11, 13, 17, 19, 23, ?",
  options: opts("29", "27", "31", "25"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "These are consecutive prime numbers. The next prime after 23 is 29.",
  concept: "Prime number series",
  exam_tip: "If terms are all prime and don't follow an obvious arithmetic/geometric pattern, suspect a prime-number series.",
});
add({
  question_type: "Number Series",
  question_text: "Find the next term: 5, 15, 45, 135, ?",
  options: opts("405", "270", "395", "415"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Each term triples the previous one: 135×3=405.",
  concept: "Geometric (tripling) series",
  exam_tip: "A constant ratio between consecutive terms is the simplest and most common series pattern.",
});
add({
  question_type: "Number Series",
  question_text: "Find the next term: 6, 11, 21, 36, 56, ?",
  options: opts("81", "80", "82", "78"),
  correct_option_key: "A",
  difficulty: "hard",
  explanation: "The differences increase by 5 each time: 5, 10, 15, 20, 25. 56 + 25 = 81.",
  concept: "Number series with linearly increasing differences",
  exam_tip: "If the differences themselves form an arithmetic series, apply the next difference in that pattern to get the final answer.",
});

// ==== Data Sufficiency ====
// Format: A) Statement I alone is sufficient  B) Statement II alone is sufficient
//         C) Both statements together are needed (neither alone suffices)
//         D) Each statement alone is sufficient
const DS_OPTIONS = () =>
  opts(
    "Statement I alone is sufficient",
    "Statement II alone is sufficient",
    "Both statements together are needed, but neither alone suffices",
    "Each statement alone is sufficient",
  );

add({
  question_type: "Data Sufficiency",
  question_text: "What is the value of x?\nI. x + 5 = 12\nII. 2x = 14",
  options: DS_OPTIONS(),
  correct_option_key: "D",
  difficulty: "easy",
  explanation: "Statement I alone gives x=7. Statement II alone also gives x=7. Each statement alone is sufficient.",
  concept: "Data sufficiency — independent equations",
  exam_tip: "Always test each statement completely on its own before considering combining them.",
});
add({
  question_type: "Data Sufficiency",
  question_text: "Is n an even number?\nI. n is divisible by 4\nII. n is divisible by 6",
  options: DS_OPTIONS(),
  correct_option_key: "D",
  difficulty: "medium",
  explanation: "Divisibility by 4 guarantees evenness (Statement I alone sufficient). Divisibility by 6 also guarantees evenness (Statement II alone sufficient).",
  concept: "Data sufficiency — divisibility implications",
  exam_tip: "A number divisible by any even number is automatically even — you don't need the exact value.",
});
add({
  question_type: "Data Sufficiency",
  question_text: "What is the area of a rectangle?\nI. Its length is 10 cm\nII. Its perimeter is 40 cm",
  options: DS_OPTIONS(),
  correct_option_key: "C",
  difficulty: "medium",
  explanation:
    "Statement I alone gives only length, not width — insufficient. Statement II alone gives length+width=20, but not each individually — insufficient. " +
    "Together: length=10, so 2(10+width)=40 gives width=10, and area=100 cm² — sufficient together.",
  concept: "Data sufficiency — combining a direct value with a relational equation",
  exam_tip: "A perimeter alone never determines area — you always need at least one individual side length too.",
});
add({
  question_type: "Data Sufficiency",
  question_text: "Is x > y?\nI. x + 3 > y + 3\nII. x − y = 2",
  options: DS_OPTIONS(),
  correct_option_key: "D",
  difficulty: "medium",
  explanation: "Statement I simplifies directly to x>y — sufficient alone. Statement II means x is 2 more than y, so x>y — sufficient alone.",
  concept: "Data sufficiency — algebraic simplification",
  exam_tip: "Simplify each statement algebraically before judging sufficiency — 'x+3>y+3' is just 'x>y' in disguise.",
});
add({
  question_type: "Data Sufficiency",
  question_text: "What is the value of a?\nI. a² = 16\nII. a is positive",
  options: DS_OPTIONS(),
  correct_option_key: "C",
  difficulty: "medium",
  explanation:
    "Statement I alone gives a=±4 (not unique) — insufficient. Statement II alone gives no numeric value — insufficient. " +
    "Together: a²=16 and a is positive, so a=4 — sufficient together.",
  concept: "Data sufficiency — resolving sign ambiguity",
  exam_tip: "Whenever a statement involves a square, check whether both positive and negative roots are possible before calling it sufficient.",
});
add({
  question_type: "Data Sufficiency",
  question_text: "How many students are in the class?\nI. There are 3 more boys than girls\nII. There are 20 girls",
  options: DS_OPTIONS(),
  correct_option_key: "C",
  difficulty: "easy",
  explanation:
    "Statement I alone gives only a relation, not a total — insufficient. Statement II alone gives only girls, not the total — insufficient. " +
    "Together: girls=20, boys=23, total=43 — sufficient together.",
  concept: "Data sufficiency — combining a relation with a direct count",
  exam_tip: "A relational clue ('3 more than') is only useful once paired with at least one actual number.",
});
add({
  question_type: "Data Sufficiency",
  question_text: "Is triangle ABC equilateral?\nI. All three angles are equal\nII. All three sides are equal",
  options: DS_OPTIONS(),
  correct_option_key: "D",
  difficulty: "easy",
  explanation: "Equal angles alone guarantee an equilateral triangle (Statement I sufficient). Equal sides alone also guarantee it (Statement II sufficient).",
  concept: "Data sufficiency — geometric equivalences",
  exam_tip: "For triangles, 'all angles equal' and 'all sides equal' are each independently sufficient to prove equilateral — know this equivalence.",
});
add({
  question_type: "Data Sufficiency",
  question_text: "What is the value of y?\nI. 3y − 4 = 11\nII. y² = 25",
  options: DS_OPTIONS(),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Statement I alone gives 3y=15, y=5 — a unique value, sufficient. Statement II alone gives y=±5 — not unique, insufficient.",
  concept: "Data sufficiency — linear vs. quadratic uniqueness",
  exam_tip: "A linear equation with one unknown is always sufficient alone; a quadratic (like y²) often isn't, due to sign ambiguity.",
});
add({
  question_type: "Data Sufficiency",
  question_text: "Is x a prime number?\nI. x is an odd number\nII. x is greater than 10 and less than 14",
  options: DS_OPTIONS(),
  correct_option_key: "C",
  difficulty: "hard",
  explanation:
    "Statement I alone is insufficient (many odd numbers, like 9 or 15, aren't prime). Statement II alone is insufficient (x could be 11, 12, or 13; 12 isn't prime). " +
    "Together: odd numbers between 10 and 14 are 11 and 13, both prime — sufficient together.",
  concept: "Data sufficiency — narrowing a range with multiple constraints",
  exam_tip: "When a range is combined with a parity constraint, list out the actual candidate numbers rather than reasoning abstractly.",
});
add({
  question_type: "Data Sufficiency",
  question_text: "What is the cost price of an article?\nI. It was sold at a profit of 20%\nII. The selling price was ₹600",
  options: DS_OPTIONS(),
  correct_option_key: "C",
  difficulty: "medium",
  explanation:
    "Statement I alone gives only a percentage, no absolute value — insufficient. Statement II alone gives only SP, no relation to CP — insufficient. " +
    "Together: SP=600 and profit=20%, so CP = 600/1.2 = ₹500 — sufficient together.",
  concept: "Data sufficiency — profit/loss requiring both a rate and an absolute value",
  exam_tip: "A percentage-only statement in profit/loss questions is almost always insufficient alone — it needs an absolute rupee value to anchor it.",
});
add({
  question_type: "Data Sufficiency",
  question_text: "Is m/n an integer?\nI. m is a multiple of n\nII. n = 1",
  options: DS_OPTIONS(),
  correct_option_key: "D",
  difficulty: "medium",
  explanation: "If m is a multiple of n, m/n is always an integer — Statement I alone sufficient. If n=1, m/n=m, an integer — Statement II alone sufficient.",
  concept: "Data sufficiency — divisibility and identity cases",
  exam_tip: "n=1 is a classic 'trivial but sufficient' case — don't dismiss simple-looking statements without checking them.",
});
add({
  question_type: "Data Sufficiency",
  question_text: "What is the perimeter of a square?\nI. Its area is 49 cm²\nII. Its side is 7 cm",
  options: DS_OPTIONS(),
  correct_option_key: "D",
  difficulty: "easy",
  explanation: "Area=49 gives side=7, so perimeter=28 (Statement I alone sufficient). Side=7 directly gives perimeter=28 (Statement II alone sufficient).",
  concept: "Data sufficiency — square area/side/perimeter relationships",
  exam_tip: "For a square, knowing any one of area, side, or perimeter lets you derive the other two — treat them as fully equivalent statements.",
});

appendUnique(Q, generateNumerical());

export async function seedNumerical() {
  await seedSubjectQuestions("numerical", Q);
}

if (require.main === module) {
  seedNumerical().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
