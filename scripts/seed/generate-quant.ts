import type { QuestionSeed } from "./lib";
import { generateUnique, numericOptions, pickDifficulty, randInt, pick, rng } from "./genlib";

function fmtPct(v: number): string {
  const rounded = Math.round(v * 100) / 100;
  if (rounded === 0) return "No change";
  return `${Math.abs(rounded)}% ${rounded > 0 ? "increase" : "decrease"}`;
}
const money = (n: number) => `₹${n}`;

// ---- Percentages ----
function tplPercentSuccessive(r: () => number): QuestionSeed {
  const opts_ = [10, 15, 20, 25, 30, 40];
  const x = pick(r, opts_);
  const y = pick(r, opts_);
  const correct = Math.round((x - y - (x * y) / 100) * 100) / 100;
  const { options, correct_option_key } = numericOptions(r, correct, [x - y, -(x - y), x + y, -(x + y)], fmtPct);
  return {
    question_type: "Percentages",
    question_text: `If a number is first increased by ${x}% and then decreased by ${y}%, what is the net percentage change?`,
    options,
    correct_option_key,
    difficulty: pickDifficulty(r),
    explanation: `Net % change = x + y' + xy'/100 where y' = -${y}. Net = ${x} - ${y} + (${x} × -${y})/100 = ${correct}%.`,
    shortcut: "For successive % changes a and b, net change = a + b + ab/100 (use a negative value for a decrease).",
    concept: "Successive percentage change",
    exam_tip: "Never just subtract the two percentages — the cross term ab/100 always matters.",
  };
}

function tplPercentOfTotal(r: () => number): QuestionSeed {
  const total = randInt(r, 20, 80) * 10;
  const pct = pick(r, [10, 15, 20, 25, 30, 40, 60, 75]);
  const correct = Math.round((total * pct) / 100);
  const { options, correct_option_key } = numericOptions(r, correct, [total - correct, correct + Math.round(total * 0.1), Math.round(total * 0.5)]);
  return {
    question_type: "Percentages",
    question_text: `In a survey of ${total} people, ${pct}% preferred brand A. How many people preferred brand A?`,
    options,
    correct_option_key,
    difficulty: pickDifficulty(r),
    explanation: `${pct}% of ${total} = (${pct}/100) × ${total} = ${correct}.`,
    concept: "Basic percentage of a quantity",
    exam_tip: "Convert the percentage to a fraction of a nice denominator (e.g. 25% = 1/4) to compute faster.",
  };
}

function tplPercentElection(r: () => number): QuestionSeed {
  const totalVotes = randInt(r, 40, 120) * 100;
  const invalidPct = pick(r, [10, 15, 20, 25]);
  const winPct = pick(r, [55, 60, 65, 70]);
  const validVotes = Math.round((totalVotes * (100 - invalidPct)) / 100);
  const loserVotes = Math.round((validVotes * (100 - winPct)) / 100);
  const { options, correct_option_key } = numericOptions(r, loserVotes, [validVotes - loserVotes, Math.round(totalVotes * (100 - winPct)) / 100, validVotes]);
  return {
    question_type: "Percentages",
    question_text: `In an election between two candidates, one got ${winPct}% of the valid votes. ${invalidPct}% of the total ${totalVotes} votes cast were invalid. How many valid votes did the losing candidate get?`,
    options,
    correct_option_key,
    difficulty: "medium",
    explanation: `Valid votes = ${100 - invalidPct}% of ${totalVotes} = ${validVotes}. Losing candidate got ${100 - winPct}% of ${validVotes} = ${loserVotes}.`,
    concept: "Percentages applied to a two-stage quantity (valid votes, then vote share)",
    exam_tip: "Apply the invalid-vote percentage first — the win percentage always applies to valid votes only.",
  };
}

// ---- Profit & Loss ----
function tplProfitMarkupDiscount(r: () => number): QuestionSeed {
  const discount = pick(r, [10, 15, 20, 25, 30]);
  const correct = Math.round((discount / (100 - discount)) * 10000) / 100;
  const { options, correct_option_key } = numericOptions(r, correct, [discount, 100 - discount, 2 * discount], (n) => `${n}%`);
  return {
    question_type: "Profit & Loss",
    question_text: `A man buys an item at a ${discount}% discount on the marked price and sells it at the marked price. What is his profit percentage?`,
    options,
    correct_option_key,
    difficulty: pickDifficulty(r),
    explanation: `CP = ${100 - discount}% of MP, SP = MP. Profit% = discount/(100−discount) × 100 = ${discount}/${100 - discount} × 100 = ${correct}%.`,
    shortcut: "A discount of d% followed by selling at full marked price gives profit% = d/(100−d) × 100.",
    concept: "Discount converted to profit percentage",
    exam_tip: "Don't confuse the discount percentage with the resulting profit percentage — they're never equal.",
  };
}

function tplProfitCP(r: () => number): QuestionSeed {
  const cp = randInt(r, 20, 90) * 10;
  const profitPct = pick(r, [10, 15, 20, 25, 30, 40]);
  const sp = Math.round(cp * (1 + profitPct / 100));
  const { options, correct_option_key } = numericOptions(r, sp, [cp, sp - cp, Math.round(cp * (1 - profitPct / 100))], money);
  return {
    question_type: "Profit & Loss",
    question_text: `A shopkeeper buys an article for ${money(cp)} and sells it at a profit of ${profitPct}%. Find the selling price.`,
    options,
    correct_option_key,
    difficulty: pickDifficulty(r),
    explanation: `SP = CP × (1 + profit%/100) = ${cp} × ${1 + profitPct / 100} = ${sp}.`,
    concept: "Selling price from cost price and profit percentage",
    exam_tip: "SP = CP × (100 + profit%)/100 — memorize this as a single multiplication, not two steps.",
  };
}

function tplLossPercent(r: () => number): QuestionSeed {
  const cp = randInt(r, 20, 90) * 10;
  const lossPct = pick(r, [5, 10, 15, 20, 25]);
  const sp = Math.round(cp * (1 - lossPct / 100));
  const { options, correct_option_key } = numericOptions(r, sp, [cp, cp - sp, Math.round(cp * (1 + lossPct / 100))], money);
  return {
    question_type: "Profit & Loss",
    question_text: `A trader buys a good for ${money(cp)} and, due to damage, sells it at a loss of ${lossPct}%. Find the selling price.`,
    options,
    correct_option_key,
    difficulty: pickDifficulty(r),
    explanation: `SP = CP × (1 − loss%/100) = ${cp} × ${1 - lossPct / 100} = ${sp}.`,
    concept: "Selling price from cost price and loss percentage",
    exam_tip: "A loss% always reduces CP, unlike a profit% which increases it — don't flip the sign under pressure.",
  };
}

// ---- Ratio & Proportion ----
function tplRatioAdd(r: () => number): QuestionSeed {
  const a = randInt(r, 2, 6);
  const b = a + randInt(r, 1, 5);
  const add = randInt(r, 4, 20);
  const x = randInt(r, 2, 8);
  const num1 = a * x;
  const num2 = b * x;
  const n1 = num1 + add;
  const n2 = num2 + add;
  const g = gcd(n1, n2);
  const { options, correct_option_key } = numericOptions(r, num2, [num1, n2, n1]);
  return {
    question_type: "Ratio",
    question_text: `Two numbers are in the ratio ${a}:${b}. If ${add} is added to both, the ratio becomes ${n1 / g}:${n2 / g}. Find the larger of the two original numbers.`,
    options,
    correct_option_key,
    difficulty: "medium",
    explanation: `Let the numbers be ${a}x and ${b}x. (${a}x+${add})/(${b}x+${add}) = ${n1 / g}/${n2 / g} ⇒ x = ${x}. The numbers are ${num1} and ${num2}; the larger is ${num2}.`,
    concept: "Ratio equations with a constant added to both terms",
    exam_tip: "Always express both numbers as multiples of a single variable x before solving.",
  };
}
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function tplRatioAges(r: () => number): QuestionSeed {
  const a = randInt(r, 2, 6);
  const b = a + randInt(r, 1, 4);
  const x = randInt(r, 3, 10);
  const years = pick(r, [4, 5, 6, 8, 10]);
  const aAge = a * x;
  const bAge = b * x;
  const futureA = aAge + years;
  const futureB = bAge + years;
  const g = gcd(futureA, futureB);
  const { options, correct_option_key } = numericOptions(r, aAge, [bAge, aAge + years, aAge - years]);
  return {
    question_type: "Ratio",
    question_text: `The present ages of A and B are in the ratio ${a}:${b}. After ${years} years, the ratio becomes ${futureA / g}:${futureB / g}. Find A's current age.`,
    options,
    correct_option_key,
    difficulty: "medium",
    explanation: `Let ages be ${a}x and ${b}x. (${a}x+${years})/(${b}x+${years}) = ${futureA / g}/${futureB / g} ⇒ x = ${x}. A's age = ${a}×${x} = ${aAge}.`,
    concept: "Ratio of ages with a future time shift",
    exam_tip: "Age-ratio problems almost always reduce to one linear equation once you set ages as ax, bx.",
  };
}

// ---- Averages ----
function tplAverageNewEntry(r: () => number): QuestionSeed {
  const n = randInt(r, 5, 15);
  const avg = randInt(r, 20, 60);
  const newVal = randInt(r, 60, 120);
  const newAvg = Math.round(((n * avg + newVal) / (n + 1)) * 100) / 100;
  const { options, correct_option_key } = numericOptions(r, newAvg, [avg, newVal, Math.round((avg + newVal) / 2)]);
  return {
    question_type: "Averages",
    question_text: `The average of ${n} numbers is ${avg}. A new number ${newVal} is added to the set. Find the new average.`,
    options,
    correct_option_key,
    difficulty: pickDifficulty(r),
    explanation: `Sum of ${n} numbers = ${n} × ${avg} = ${n * avg}. New sum = ${n * avg + newVal}. New average = ${n * avg + newVal}/${n + 1} = ${newAvg}.`,
    concept: "Average after adding one new value",
    exam_tip: "Work with the total sum, not the average directly, whenever the count of items changes.",
  };
}

function tplAverageReplace(r: () => number): QuestionSeed {
  const n = randInt(r, 8, 20);
  const avg = randInt(r, 30, 70);
  const oldVal = randInt(r, 20, 50);
  const newVal = oldVal + randInt(r, 5, 40);
  const newAvg = Math.round((avg + (newVal - oldVal) / n) * 100) / 100;
  const { options, correct_option_key } = numericOptions(r, newAvg, [avg, avg + (newVal - oldVal), avg - (newVal - oldVal) / n]);
  return {
    question_type: "Averages",
    question_text: `The average weight of ${n} students is ${avg} kg. One student weighing ${oldVal} kg is replaced by a new student weighing ${newVal} kg. Find the new average weight.`,
    options,
    correct_option_key,
    difficulty: "medium",
    explanation: `Change in total = ${newVal} − ${oldVal} = ${newVal - oldVal}. Change in average = ${newVal - oldVal}/${n} = ${Math.round(((newVal - oldVal) / n) * 100) / 100}. New average = ${avg} + ${Math.round(((newVal - oldVal) / n) * 100) / 100} = ${newAvg}.`,
    concept: "Average after replacing one member of the set",
    exam_tip: "You only need the difference between the old and new value — not either value alone.",
  };
}

// ---- Time & Work ----
function tplWorkTogether(r: () => number): QuestionSeed {
  const a = pick(r, [10, 12, 15, 18, 20, 24]);
  const b = pick(r, [10, 12, 15, 18, 20, 24].filter((v) => v !== a));
  const lcm = (a * b) / gcd(a, b);
  const correct = Math.round((lcm / (lcm / a + lcm / b)) * 100) / 100;
  const { options, correct_option_key } = numericOptions(r, correct, [a + b, (a + b) / 2, Math.min(a, b)]);
  return {
    question_type: "Time & Work",
    question_text: `A can complete a piece of work in ${a} days and B can complete it in ${b} days. Working together, in how many days will they complete the work?`,
    options,
    correct_option_key,
    difficulty: pickDifficulty(r),
    explanation: `Combined 1-day work = 1/${a} + 1/${b}. Time together = ${a}×${b}/(${a}+${b}) = ${correct} days.`,
    shortcut: "Time together = (A × B)/(A + B) days — a direct formula, no need to find LCM manually.",
    concept: "Combined work rate",
    exam_tip: "Add work rates (1/time), never add the times directly.",
  };
}

function tplWorkWithLeaving(r: () => number): QuestionSeed {
  const a = pick(r, [10, 12, 15, 20]);
  const b = pick(r, [15, 20, 24, 30].filter((v) => v !== a));
  const daysBTogether = randInt(r, 2, 5);
  const workDoneTogether = daysBTogether * (1 / a + 1 / b);
  const remaining = 1 - workDoneTogether;
  const correct = Math.round(remaining * a * 100) / 100;
  const { options, correct_option_key } = numericOptions(r, correct, [a - daysBTogether, a, daysBTogether]);
  return {
    question_type: "Time & Work",
    question_text: `A and B can do a work in ${a} and ${b} days respectively. They work together for ${daysBTogether} days, after which B leaves. In how many more days will A alone finish the remaining work?`,
    options,
    correct_option_key,
    difficulty: "hard",
    explanation: `Work done together in ${daysBTogether} days = ${daysBTogether}(1/${a}+1/${b}) = ${Math.round(workDoneTogether * 100) / 100}. Remaining work = ${Math.round(remaining * 100) / 100}, which A alone finishes in remaining × ${a} = ${correct} days.`,
    concept: "Work remaining after a partner leaves partway",
    exam_tip: "Compute the fraction of work already done first, then convert only the remaining fraction using the solo worker's rate.",
  };
}

// ---- Time-Speed-Distance ----
function tplSpeedDistance(r: () => number): QuestionSeed {
  const speed = randInt(r, 4, 12) * 10;
  const time = randInt(r, 2, 8);
  const distance = speed * time;
  const { options, correct_option_key } = numericOptions(r, distance, [speed + time, distance / 2, distance * 2], (n) => `${n} km`);
  return {
    question_type: "Time-Speed-Distance",
    question_text: `A car travels at a constant speed of ${speed} km/hr for ${time} hours. What distance does it cover?`,
    options,
    correct_option_key,
    difficulty: "easy",
    explanation: `Distance = Speed × Time = ${speed} × ${time} = ${distance} km.`,
    concept: "Distance = Speed × Time",
    exam_tip: "Keep speed and time units consistent (hours with km/hr, etc.) before multiplying.",
  };
}

function tplRelativeSpeed(r: () => number): QuestionSeed {
  const speedA = randInt(r, 4, 10) * 10;
  const speedB = randInt(r, 4, 10) * 10;
  const distance = randInt(r, 20, 60) * 10;
  const relSpeed = speedA + speedB;
  const timeHrs = Math.round((distance / relSpeed) * 100) / 100;
  const { options, correct_option_key } = numericOptions(r, timeHrs, [distance / speedA, distance / speedB, distance / (speedA - speedB || 1)], (n) => `${n} hr`);
  return {
    question_type: "Time-Speed-Distance",
    question_text: `Two trains, ${distance} km apart, start moving towards each other at ${speedA} km/hr and ${speedB} km/hr respectively. After how many hours will they meet?`,
    options,
    correct_option_key,
    difficulty: "medium",
    explanation: `Relative speed (towards each other) = ${speedA} + ${speedB} = ${relSpeed} km/hr. Time to meet = ${distance}/${relSpeed} = ${timeHrs} hr.`,
    shortcut: "For objects moving towards each other, add their speeds; for the same direction, subtract.",
    concept: "Relative speed — opposite directions",
    exam_tip: "Always identify direction (same vs. opposite) before deciding to add or subtract speeds.",
  };
}

// ---- Probability ----
function tplProbabilityDice(r: () => number): QuestionSeed {
  const target = pick(r, [4, 6, 7, 8, 9, 10]);
  const favorable: Record<number, number> = { 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1 };
  const fav = favorable[target] ?? 1;
  const { options, correct_option_key } = numericOptions(r, fav, [fav + 1, Math.max(1, fav - 1), fav + 2], (n) => `${n}/36`);
  return {
    question_type: "Probability",
    question_text: `Two dice are thrown together. What is the probability that the sum of the numbers shown is ${target}?`,
    options,
    correct_option_key,
    difficulty: "medium",
    explanation: `Total outcomes = 36. Outcomes summing to ${target}: ${fav}. Probability = ${fav}/36.`,
    concept: "Classical probability with two dice",
    exam_tip: "List favorable (a, b) pairs systematically for a target sum — it's faster than trying to formula-derive it.",
  };
}

function tplProbabilityCards(r: () => number): QuestionSeed {
  const suit = pick(r, ["hearts", "spades", "clubs", "diamonds"]);
  const { options, correct_option_key } = numericOptions(r, 13, [12, 4, 26], (n) => `${n}/52`);
  return {
    question_type: "Probability",
    question_text: `A card is drawn at random from a well-shuffled standard deck of 52 cards. What is the probability that it is a ${suit} card?`,
    options,
    correct_option_key,
    difficulty: "easy",
    explanation: `There are 13 cards of each suit in a 52-card deck, so probability = 13/52.`,
    concept: "Classical probability — single card draw",
    exam_tip: "A standard deck always has 4 suits of 13 cards each — memorize this instead of recomputing it.",
  };
}

// ---- Permutation & Combination ----
function tplPermutation(r: () => number): QuestionSeed {
  const n = randInt(r, 5, 9);
  const k = randInt(r, 2, n - 1);
  function fact(x: number): number {
    return x <= 1 ? 1 : x * fact(x - 1);
  }
  const correct = fact(n) / fact(n - k);
  const { options, correct_option_key } = numericOptions(r, correct, [fact(n) / (fact(k) * fact(n - k)), fact(n), fact(k)]);
  return {
    question_type: "Permutation & Combination",
    question_text: `In how many ways can ${k} distinct letters be arranged out of ${n} distinct letters?`,
    options,
    correct_option_key,
    difficulty: "medium",
    explanation: `Number of arrangements = P(${n},${k}) = ${n}!/(${n}-${k})! = ${correct}.`,
    concept: "Permutations of r items chosen from n",
    exam_tip: "Use permutations when order matters, combinations when it doesn't.",
  };
}

function tplCombination(r: () => number): QuestionSeed {
  const n = randInt(r, 6, 12);
  const k = randInt(r, 2, 5);
  function fact(x: number): number {
    return x <= 1 ? 1 : x * fact(x - 1);
  }
  const correct = fact(n) / (fact(k) * fact(n - k));
  const { options, correct_option_key } = numericOptions(r, correct, [fact(n) / fact(n - k), n * k, Math.round(correct * 1.5)]);
  return {
    question_type: "Permutation & Combination",
    question_text: `In how many ways can a committee of ${k} people be chosen from a group of ${n} people?`,
    options,
    correct_option_key,
    difficulty: "medium",
    explanation: `Number of committees = C(${n},${k}) = ${n}!/(${k}!×(${n}-${k})!) = ${correct}.`,
    concept: "Combinations of r items chosen from n",
    exam_tip: "Committee/selection problems (order doesn't matter) always use combinations, never permutations.",
  };
}

// ---- Number System ----
function tplLCMHCF(r: () => number): QuestionSeed {
  const a = pick(r, [12, 15, 18, 20, 24, 30]);
  const b = pick(r, [12, 15, 18, 20, 24, 30].filter((v) => v !== a));
  const h = gcd(a, b);
  const l = (a * b) / h;
  const askLcm = r() < 0.5;
  const correct = askLcm ? l : h;
  const { options, correct_option_key } = numericOptions(r, correct, [askLcm ? h : l, a * b, a + b]);
  return {
    question_type: "Number System",
    question_text: `Find the ${askLcm ? "LCM" : "HCF"} of ${a} and ${b}.`,
    options,
    correct_option_key,
    difficulty: "easy",
    explanation: `HCF(${a}, ${b}) = ${h}. LCM(${a}, ${b}) = (${a}×${b})/HCF = ${l}. So the ${askLcm ? "LCM" : "HCF"} is ${correct}.`,
    shortcut: "LCM × HCF = product of the two numbers — use this to find one from the other quickly.",
    concept: "LCM and HCF of two numbers",
    exam_tip: "Prime-factorize both numbers when the direct product-over-HCF method feels error-prone.",
  };
}

function tplDivisibilityRemainder(r: () => number): QuestionSeed {
  const divisor = pick(r, [7, 9, 11, 13]);
  const n = randInt(r, 200, 999);
  const remainder = n % divisor;
  const { options, correct_option_key } = numericOptions(r, remainder, [divisor - remainder, divisor, remainder + 1]);
  return {
    question_type: "Number System",
    question_text: `What is the remainder when ${n} is divided by ${divisor}?`,
    options,
    correct_option_key,
    difficulty: "easy",
    explanation: `${n} = ${Math.floor(n / divisor)} × ${divisor} + ${remainder}, so the remainder is ${remainder}.`,
    concept: "Remainders on division",
    exam_tip: "For a quick check, verify divisor × quotient + remainder reconstructs the original number.",
  };
}

// ---- Simple & Compound Interest ----
function tplSimpleInterest(r: () => number): QuestionSeed {
  const p = randInt(r, 10, 50) * 100;
  const rate = pick(r, [5, 6, 8, 10, 12]);
  const time = randInt(r, 2, 6);
  const si = Math.round((p * rate * time) / 100);
  const { options, correct_option_key } = numericOptions(r, si, [p, si / 2, si * 2], money);
  return {
    question_type: "Simple & Compound Interest",
    question_text: `Find the simple interest on ${money(p)} at ${rate}% per annum for ${time} years.`,
    options,
    correct_option_key,
    difficulty: "easy",
    explanation: `SI = (P×R×T)/100 = (${p}×${rate}×${time})/100 = ${si}.`,
    concept: "Simple interest formula",
    exam_tip: "SI grows linearly with time — double the years exactly doubles the interest.",
  };
}

function tplCompoundInterest(r: () => number): QuestionSeed {
  const p = randInt(r, 10, 40) * 100;
  const rate = pick(r, [5, 10, 20]);
  const time = pick(r, [2, 3]);
  const ci = Math.round(p * Math.pow(1 + rate / 100, time) - p);
  const si = Math.round((p * rate * time) / 100);
  const { options, correct_option_key } = numericOptions(r, ci, [si, p, ci - (ci - si)], money);
  return {
    question_type: "Simple & Compound Interest",
    question_text: `Find the compound interest on ${money(p)} at ${rate}% per annum, compounded annually, for ${time} years.`,
    options,
    correct_option_key,
    difficulty: "medium",
    explanation: `Amount = P(1+R/100)^T = ${p}×(1+${rate}/100)^${time} = ${Math.round(p * Math.pow(1 + rate / 100, time))}. CI = Amount − P = ${ci}.`,
    shortcut: "For 2 years, CI = SI + P×(R/100)² — a quick check against the full formula.",
    concept: "Compound interest formula",
    exam_tip: "CI always exceeds SI (for the same P, R, T > 1 year) — a computed CI ≤ SI signals an arithmetic error.",
  };
}

export function generateQuant(): QuestionSeed[] {
  return generateUnique(
    300,
    [
      tplPercentSuccessive,
      tplPercentOfTotal,
      tplPercentElection,
      tplProfitMarkupDiscount,
      tplProfitCP,
      tplLossPercent,
      tplRatioAdd,
      tplRatioAges,
      tplAverageNewEntry,
      tplAverageReplace,
      tplWorkTogether,
      tplWorkWithLeaving,
      tplSpeedDistance,
      tplRelativeSpeed,
      tplProbabilityDice,
      tplProbabilityCards,
      tplPermutation,
      tplCombination,
      tplLCMHCF,
      tplDivisibilityRemainder,
      tplSimpleInterest,
      tplCompoundInterest,
    ],
    424242,
  );
}

if (require.main === module) {
  const qs = generateQuant();
  console.log(`generated ${qs.length} quant questions`);
  console.log(JSON.stringify(qs.slice(0, 3), null, 2));
  void rng;
}
