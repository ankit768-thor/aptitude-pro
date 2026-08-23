import { seedSubjectQuestions, opts, type QuestionSeed } from "./lib";
import { generateQuant } from "./generate-quant";

const Q: QuestionSeed[] = [];
function add(q: QuestionSeed) {
  Q.push(q);
}

// ==== Percentages ====
add({
  question_type: "Percentages",
  question_text: "If a number is first increased by 20% and then decreased by 20%, what is the net percentage change?",
  options: opts("No change", "4% increase", "4% decrease", "40% decrease"),
  correct_option_key: "C",
  difficulty: "easy",
  explanation: "Net % change = x + y + xy/100 = 20 - 20 + (20 × -20)/100 = -4%, i.e. a 4% decrease.",
  shortcut: "For a% increase followed by a% decrease, the net effect is always -a²/100.",
  concept: "Successive percentage change",
  exam_tip: "Memorize the successive-change formula — it saves a full calculation step under time pressure.",
});
add({
  question_type: "Percentages",
  question_text:
    "In an election between two candidates, one candidate got 60% of the total valid votes. 20% of the total votes were invalid. If the total number of votes cast was 7500, how many valid votes did the other candidate get?",
  options: opts("2400", "3600", "4500", "1800"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Valid votes = 80% of 7500 = 6000. The other candidate got 40% of 6000 = 2400.",
  concept: "Percentages applied to a two-stage quantity (valid votes, then vote share)",
  exam_tip: "Watch for problems that apply a percentage to a subset (valid votes), not the original total.",
});

// ==== Profit & Loss ====
add({
  question_type: "Profit & Loss",
  question_text:
    "A shopkeeper sells an article at 20% profit. If he had bought it at 10% less and sold it for ₹36 less, he would have gained 25%. Find the cost price.",
  options: opts("₹480", "₹400", "₹500", "₹450"),
  correct_option_key: "A",
  difficulty: "hard",
  explanation:
    "Let CP = x. Original SP = 1.2x. New CP = 0.9x, new SP = 1.25 × 0.9x = 1.125x. Given 1.2x − 1.125x = 36 ⇒ 0.075x = 36 ⇒ x = 480.",
  concept: "Profit/loss with a hypothetical altered cost price",
  exam_tip: "Set up both scenarios in terms of the same variable CP before touching the given difference.",
});
add({
  question_type: "Profit & Loss",
  question_text: "A man buys an item at a 20% discount on the marked price and sells it at the marked price. What is his profit percentage?",
  options: opts("20%", "25%", "30%", "16.67%"),
  correct_option_key: "B",
  difficulty: "easy",
  explanation: "CP = 0.8×MP, SP = MP. Profit% = (MP − 0.8MP)/0.8MP × 100 = 0.2/0.8 × 100 = 25%.",
  shortcut: "A discount of d% followed by selling at full price gives profit% = d/(100−d) × 100.",
  concept: "Discount converted to profit percentage",
  exam_tip: "Don't confuse the discount percentage with the resulting profit percentage — they're never equal.",
});

// ==== Ratio & Proportion ====
add({
  question_type: "Ratio",
  question_text: "Two numbers are in the ratio 3:5. If 10 is added to both, the ratio becomes 5:7. Find the two numbers.",
  options: opts("15, 25", "9, 15", "12, 20", "18, 30"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "(3x+10)/(5x+10) = 5/7 ⇒ 21x+70 = 25x+50 ⇒ 4x = 20 ⇒ x = 5. Numbers are 15 and 25.",
  concept: "Ratio equations with a constant added to both terms",
  exam_tip: "Always express both numbers as multiples of a single variable x before cross-multiplying.",
});
add({
  question_type: "Ratio",
  question_text: "The ratio of the present ages of A and B is 4:5. After 8 years the ratio becomes 5:6. Find A's current age.",
  options: opts("32", "28", "36", "40"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "(4x+8)/(5x+8) = 5/6 ⇒ 24x+48 = 25x+40 ⇒ x = 8. A's age = 4×8 = 32.",
  concept: "Ratio of ages with a future time shift",
  exam_tip: "Age-ratio problems almost always reduce to one linear equation once you set ages as 4x, 5x.",
});

// ==== Averages ====
add({
  question_type: "Averages",
  question_text: "The average of 5 numbers is 27. If one number is excluded, the average becomes 25. Find the excluded number.",
  options: opts("30", "35", "25", "40"),
  correct_option_key: "B",
  difficulty: "easy",
  explanation: "Sum of 5 numbers = 135. Sum of remaining 4 = 100. Excluded number = 135 − 100 = 35.",
  concept: "Average change on removing one element",
  exam_tip: "Convert averages to sums immediately — averages themselves can't be subtracted meaningfully.",
});
add({
  question_type: "Averages",
  question_text:
    "The average weight of 8 people increases by 2.5 kg when a new person replaces one who weighs 65 kg. Find the weight of the new person.",
  options: opts("85 kg", "75 kg", "90 kg", "80 kg"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Total weight increases by 8 × 2.5 = 20 kg. New person's weight = 65 + 20 = 85 kg.",
  shortcut: "Replacement problems: new value = old value + (n × change in average).",
  concept: "Average change on replacing one element",
  exam_tip: "This is one of the most common placement-test question patterns — memorize the shortcut formula.",
});

// ==== Time & Work ====
add({
  question_type: "Time & Work",
  question_text: "A can complete a work in 12 days and B can complete it in 18 days. Working together, how many days will they take?",
  options: opts("7.2 days", "6 days", "8 days", "9 days"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Combined rate = 1/12 + 1/18 = 5/36 per day. Time = 36/5 = 7.2 days.",
  shortcut: "Combined time = (A×B)/(A+B) = (12×18)/30 = 7.2 days.",
  concept: "Combined work rate",
  exam_tip: "Use the product-over-sum shortcut for two-person work problems to save calculation time.",
});
add({
  question_type: "Time & Work",
  question_text:
    "A can do a piece of work in 20 days. He works for 5 days and leaves. B finishes the remaining work in 10 days. In how many days can B alone complete the whole work?",
  options: opts("40/3 days (≈13.3)", "15 days", "12 days", "16 days"),
  correct_option_key: "A",
  difficulty: "hard",
  explanation:
    "A completes 5/20 = 1/4 of the work in 5 days, leaving 3/4. B does 3/4 in 10 days, so B's rate = (3/4)/10 = 3/40 per day. Full work alone = 40/3 days.",
  concept: "Partial work handed off between two workers",
  exam_tip: "Track work done as a fraction of the whole, not as 'days' — it avoids sign errors on handoff problems.",
});

// ==== Time, Speed & Distance ====
add({
  question_type: "Time-Speed-Distance",
  question_text: "A train 150 m long crosses a pole in 15 seconds. Find its speed in km/hr.",
  options: opts("36 km/hr", "30 km/hr", "40 km/hr", "45 km/hr"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Speed = 150/15 = 10 m/s = 10 × 18/5 = 36 km/hr.",
  shortcut: "To convert m/s to km/hr, multiply by 18/5.",
  concept: "Speed of a train crossing a stationary point",
  exam_tip: "During placement tests, avoid spending more than 90 seconds on unit-conversion questions like this.",
  company_slug: "deloitte",
});
add({
  question_type: "Time-Speed-Distance",
  question_text:
    "Two trains 120 m and 180 m long run in opposite directions on parallel tracks at 42 km/hr and 30 km/hr. Find the time they take to cross each other.",
  options: opts("15 s", "20 s", "10 s", "18 s"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation:
    "Relative speed (opposite directions) = 42+30 = 72 km/hr = 20 m/s. Total length = 300 m. Time = 300/20 = 15 s.",
  concept: "Relative speed — opposite-direction crossing",
  exam_tip: "Opposite directions always ADD speeds; same direction always SUBTRACTS them — a very common trap.",
});

// ==== Probability ====
add({
  question_type: "Probability",
  question_text: "A bag contains 4 red and 6 blue balls. One ball is drawn at random. Find the probability that it is red.",
  options: opts("2/5", "3/5", "1/2", "1/5"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "P(red) = 4/(4+6) = 4/10 = 2/5.",
  concept: "Basic probability of a single draw",
  exam_tip: "Always reduce the fraction to lowest terms before matching against the options.",
});
add({
  question_type: "Probability",
  question_text: "Two dice are rolled together. Find the probability that the sum of the numbers shown is 7.",
  options: opts("1/6", "1/12", "1/4", "5/36"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Favorable outcomes summing to 7: (1,6)(2,5)(3,4)(4,3)(5,2)(6,1) = 6. Total outcomes = 36. P = 6/36 = 1/6.",
  concept: "Two-dice sample space",
  exam_tip: "Memorize that sum=7 has the most combinations (6) of any sum on two dice — a frequently reused fact.",
});

// ==== Permutation & Combination ====
add({
  question_type: "Permutation & Combination",
  question_text: "In how many ways can 5 people be seated in a row?",
  options: opts("120", "60", "24", "720"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Number of arrangements = 5! = 120.",
  concept: "Basic factorial arrangement",
  exam_tip: "For 'arrange n distinct items in a row' questions, the answer is always n! — no further reasoning needed.",
});
add({
  question_type: "Permutation & Combination",
  question_text: "How many 3-letter words (no repetition) can be formed from the letters of the word 'MATH'?",
  options: opts("24", "12", "64", "6"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "4P3 = 4 × 3 × 2 = 24.",
  shortcut: "nPr = n!/(n−r)!",
  concept: "Permutations of a subset without repetition",
  exam_tip: "'Words' in P&C problems don't need to be real words — treat every letter as a distinct, orderable item.",
});

// ==== Number System ====
add({
  question_type: "Number System",
  question_text: "Find the remainder when 2^50 is divided by 7.",
  options: opts("4", "2", "1", "6"),
  correct_option_key: "A",
  difficulty: "hard",
  explanation:
    "Powers of 2 mod 7 cycle as 2, 4, 1 (period 3). 50 mod 3 = 2, so the remainder matches the 2nd term in the cycle: 4.",
  concept: "Cyclicity of remainders (modular arithmetic)",
  exam_tip: "For 'remainder of a^n mod m' questions, find the cycle length of a mod m first — it's almost always short.",
});
add({
  question_type: "Number System",
  question_text: "What is the sum of the first 20 natural numbers?",
  options: opts("210", "200", "190", "220"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Sum = n(n+1)/2 = 20 × 21/2 = 210.",
  shortcut: "Memorize n(n+1)/2 — it appears constantly across number-system and series questions.",
  concept: "Sum of the first n natural numbers",
  exam_tip: "This formula alone resolves a large share of quick arithmetic questions in placement tests.",
});

// ==== Simple & Compound Interest ====
add({
  question_type: "Simple & Compound Interest",
  question_text: "Find the compound interest on ₹10,000 at 10% p.a. for 2 years, compounded annually.",
  options: opts("₹2,100", "₹2,000", "₹2,200", "₹1,900"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "CI = P[(1+R/100)^T − 1] = 10000 × (1.1² − 1) = 10000 × 0.21 = ₹2,100.",
  concept: "Compound interest over 2 years",
  exam_tip: "For 2-year CI at rate R%, a quick shortcut is CI = P × (2R + R²/100)/100.",
});
add({
  question_type: "Simple & Compound Interest",
  question_text: "A sum of money doubles itself in 8 years at simple interest. Find the annual rate of interest.",
  options: opts("12.5%", "10%", "15%", "8%"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "If the sum doubles, SI = P. Using SI = P×R×T/100: P = P×R×8/100 ⇒ R = 100/8 = 12.5%.",
  shortcut: "For a sum doubling under SI in T years, R = 100/T.",
  concept: "Simple interest — rate from doubling time",
  exam_tip: "Doubling/tripling SI questions reduce to a one-line formula — don't set up the full equation from scratch.",
});

Q.push(...generateQuant());

export async function seedQuant() {
  await seedSubjectQuestions("quant", Q);
}

if (require.main === module) {
  seedQuant().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
