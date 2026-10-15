import { seedSubjectQuestions, opts, type QuestionSeed } from "./lib";

export const Q: QuestionSeed[] = [];
function add(q: QuestionSeed) {
  Q.push(q);
}

// ==== Critical Reasoning ====
add({
  question_type: "Critical Reasoning",
  question_text:
    "All employees who arrive late are marked absent for the day. Rajesh arrived late today. Which of the following can be logically concluded?",
  options: opts("Rajesh will be marked absent today", "Rajesh will be fired", "Rajesh was late yesterday too", "Rajesh's manager is upset"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "This is a direct application of the stated rule to the given fact — no extra assumption is needed.",
  concept: "Direct logical deduction from a stated rule",
  exam_tip: "When a rule is stated as an absolute ('all X are Y'), applying it to a matching case is a valid, direct conclusion.",
});
add({
  question_type: "Critical Reasoning",
  question_text:
    "Statement: The company's profits fell by 15% despite a 10% increase in sales. Which of the following best explains this apparent contradiction?",
  options: opts("The cost of raw materials increased sharply during the period", "The company hired more staff", "Sales were highest in the last quarter", "The company launched a new product"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Rising costs would explain falling profits even as revenue (sales) rose — directly resolving the apparent contradiction.",
  concept: "Explaining an apparent paradox",
  exam_tip: "For 'resolve the paradox' questions, look for the option that affects the side of the equation not already mentioned (here, costs, not sales).",
});
add({
  question_type: "Critical Reasoning",
  question_text:
    "Argument: 'Since the new policy was introduced, employee turnover has decreased. Therefore, the policy caused the decrease.' " +
    "Which of the following, if true, would most weaken this argument?",
  options: opts(
    "Turnover had already been steadily decreasing for two years before the policy was introduced",
    "The policy was well received by employees",
    "The company is headquartered in Mumbai",
    "The company's revenue increased during this period",
  ),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "A pre-existing downward trend suggests the decrease isn't caused by the new policy, undermining the causal claim.",
  concept: "Weakening a causal argument",
  exam_tip: "The strongest weakener for a 'this caused that' argument is usually one showing the effect existed before the supposed cause.",
});
add({
  question_type: "Critical Reasoning",
  question_text: "All cats are mammals. Some mammals are not pets. Which of the following can be validly concluded?",
  options: opts("Some cats are not pets", "All mammals are cats", "No cats are pets", "None of the above follows necessarily"),
  correct_option_key: "D",
  difficulty: "hard",
  explanation: "The mammals that aren't pets might not include any cats at all — nothing about cats specifically can be validly concluded.",
  concept: "Avoiding invalid syllogistic overlap assumptions",
  exam_tip: "'Some mammals are not pets' doesn't tell you WHICH mammals — never assume it applies to the specific subset (cats) mentioned elsewhere.",
});
add({
  question_type: "Critical Reasoning",
  question_text:
    "Statement: 'To reduce traffic congestion, the city should build more roads.' Which of the following, if true, would most weaken this recommendation?",
  options: opts(
    "Historical data shows that new roads often fill with new traffic within a few years, a phenomenon known as induced demand",
    "Building roads is expensive",
    "Some residents oppose new construction",
    "The city has a small budget for infrastructure",
  ),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Induced demand directly challenges the assumption that more roads reduce congestion, weakening the recommendation's core logic.",
  concept: "Weakening a policy recommendation",
  exam_tip: "Cost or opposition-based options (like B and C) are practical objections, not logical weakeners — the strongest weakener attacks the causal claim itself.",
});
add({
  question_type: "Critical Reasoning",
  question_text: "Claim: 'The new advertising campaign increased sales by 25%.' This claim assumes that:",
  options: opts("No other factor influenced the increase in sales during that period", "The advertising budget was large", "Customers liked the advertisement", "The product was of good quality"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Attributing the entire 25% increase to the campaign implicitly assumes no other factor (seasonality, pricing, competition) contributed.",
  concept: "Identifying the core causal assumption",
  exam_tip: "Any claim that attributes an outcome entirely to one cause assumes that no other explanation exists — look for that assumption first.",
});
add({
  question_type: "Critical Reasoning",
  question_text: "Statement: 'Company X's revenue increased by 30% this year, but its market share decreased.' Which of the following best explains this?",
  options: opts("The overall market grew faster than 30%", "The company reduced its marketing budget", "The company launched fewer products", "Competitors reduced prices"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "If the total market grew faster than the company's own 30% growth, the company's share of that larger market would fall even as its revenue rose.",
  concept: "Explaining an apparent paradox (share vs. absolute growth)",
  exam_tip: "Market SHARE depends on relative growth compared to the whole market, not just a company's own absolute growth.",
});
add({
  question_type: "Critical Reasoning",
  question_text:
    "Argument: 'Since students who study in groups score higher on average, all students should be required to study in groups.' " +
    "Which of the following, if true, would most weaken this argument?",
  options: opts(
    "Students who choose to study in groups may already be more motivated and disciplined than those who don't",
    "Group study rooms are limited on campus",
    "Some students prefer studying alone",
    "Group study was more common last year",
  ),
  correct_option_key: "A",
  difficulty: "hard",
  explanation: "This points to a self-selection bias: the correlation may reflect pre-existing motivation, not a causal benefit of group study itself.",
  concept: "Weakening a correlation-implies-causation argument",
  exam_tip: "Whenever an argument moves from 'X correlates with Y' to 'X causes Y', the strongest weakener usually exposes a hidden selection bias.",
});
add({
  question_type: "Critical Reasoning",
  question_text: "Statement: 'If it rains, the outdoor event will be cancelled. It did not rain today.' Which of the following can be validly concluded?",
  options: opts(
    "The outdoor event was not cancelled",
    "The outdoor event was held as scheduled",
    "Nothing can be validly concluded about whether the event was cancelled",
    "It will rain tomorrow",
  ),
  correct_option_key: "C",
  difficulty: "hard",
  explanation:
    "The rule only specifies what happens IF it rains — it says nothing about what happens if it doesn't. The event could still be cancelled for another reason.",
  concept: "Avoiding the 'denying the antecedent' logical fallacy",
  exam_tip: "'If A then B' does NOT imply 'if not A then not B' — this is one of the most commonly tested logical fallacies.",
});
add({
  question_type: "Critical Reasoning",
  question_text:
    "Statement: 'Every time the manager travels, the team's productivity increases.' Which of the following, if true, would most strengthen the claim " +
    "that the manager's absence itself causes the productivity increase?",
  options: opts(
    "On weeks when the manager was on leave for reasons other than travel, productivity also increased",
    "The manager travels frequently",
    "The team has 10 members",
    "Productivity is measured monthly",
  ),
  correct_option_key: "A",
  difficulty: "hard",
  explanation: "Showing the same effect occurs whenever the manager is simply absent (not just traveling) isolates absence as the true cause, strengthening the claim.",
  concept: "Strengthening a causal argument by isolating the variable",
  exam_tip: "The strongest strengthener for a causal claim rules out a competing explanation (here, distinguishing 'absence' from 'travel' specifically).",
});
add({
  question_type: "Critical Reasoning",
  question_text:
    "Statement: 'Company Y's customer complaints dropped by 40% after launching a new support chatbot.' Which of the following would most weaken the " +
    "claim that the chatbot caused the drop?",
  options: opts("The company also hired 20 additional human support staff during the same period", "The chatbot uses AI", "Customers like the chatbot", "The chatbot is available 24/7"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "The additional human staff offers an alternative explanation for the drop in complaints, weakening the claim that the chatbot alone caused it.",
  concept: "Weakening a causal claim with an alternative explanation",
  exam_tip: "Any option introducing a simultaneous, plausible alternative cause is usually the correct weakener in these questions.",
});
add({
  question_type: "Critical Reasoning",
  question_text: "All professional athletes train daily. Ravi trains daily. Which of the following can be validly concluded?",
  options: opts("Ravi is a professional athlete", "Ravi may or may not be a professional athlete", "Ravi is not a professional athlete", "All people who train daily are professional athletes"),
  correct_option_key: "B",
  difficulty: "hard",
  explanation:
    "Training daily is necessary for professional athletes per the statement, but it doesn't mean everyone who trains daily is one — this is the fallacy of affirming the consequent.",
  concept: "Avoiding the 'affirming the consequent' logical fallacy",
  exam_tip: "'All A are B' + 'X is B' does NOT imply 'X is A' — a frequently tested reasoning trap.",
});

// ==== Statement & Assumption ====
// Format: A) Only Assumption I is implicit  B) Only Assumption II is implicit
//         C) Both I and II are implicit      D) Neither I nor II is implicit
const SA_OPTIONS = () =>
  opts("Only Assumption I is implicit", "Only Assumption II is implicit", "Both I and II are implicit", "Neither I nor II is implicit");

add({
  question_type: "Statement & Assumption",
  question_text:
    "Statement: 'Please switch off the lights when leaving the room to save electricity.'\n" +
    "Assumption I: Lights left on consume electricity unnecessarily.\nAssumption II: Some people forget to switch off lights.",
  options: SA_OPTIONS(),
  correct_option_key: "C",
  difficulty: "medium",
  explanation: "The instruction's stated purpose ('to save electricity') implies I. The instruction being necessary at all implies II (otherwise no reminder would be needed).",
  concept: "Assumption identification behind an instruction",
  exam_tip: "An instruction's stated purpose is usually Assumption I; the reason the instruction is needed at all is usually the second assumption.",
});
add({
  question_type: "Statement & Assumption",
  question_text:
    "Statement: 'The government has made wearing helmets compulsory for two-wheeler riders.'\n" +
    "Assumption I: Wearing helmets reduces the risk of head injury.\nAssumption II: All two-wheeler riders will comply with the rule.",
  options: SA_OPTIONS(),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "I is the reasonable safety rationale behind the rule. II is too strong to assume — rules are enforced precisely because full compliance isn't guaranteed.",
  concept: "Distinguishing reasonable assumptions from overly strong ones",
  exam_tip: "An assumption claiming 100% compliance ('all', 'everyone', 'no one') is almost always too strong to be valid.",
});
add({
  question_type: "Statement & Assumption",
  question_text:
    "Statement: 'The meeting has been rescheduled to 3 PM.'\n" +
    "Assumption I: All attendees check their email regularly.\nAssumption II: The new time is more convenient for everyone.",
  options: SA_OPTIONS(),
  correct_option_key: "D",
  difficulty: "medium",
  explanation: "A simple reschedule notice doesn't necessarily assume everyone checks email, nor that the new time suits everyone — it could be for other reasons.",
  concept: "Recognizing when no strong assumption is implicit",
  exam_tip: "Not every statement carries a hidden assumption — plain factual announcements often assume neither option offered.",
});
add({
  question_type: "Statement & Assumption",
  question_text:
    "Statement: 'The company deducted a day's salary because Anil was absent without informing anyone.'\n" +
    "Assumption I: Anil was absent for a valid medical reason.\nAssumption II: Employees are expected to inform the company before taking leave.",
  options: SA_OPTIONS(),
  correct_option_key: "B",
  difficulty: "medium",
  explanation: "I is not assumed — the statement gives no reason for the absence. II is implicit — the deduction's justification rests on this expected norm being violated.",
  concept: "Identifying the norm-based assumption behind a consequence",
  exam_tip: "When an action is described as a consequence of violating a rule, the existence of that rule is almost always the implicit assumption.",
});
add({
  question_type: "Statement & Assumption",
  question_text:
    "Statement: 'Please carry a valid ID card to the examination hall.'\n" +
    "Assumption I: The exam authorities may need to verify candidates' identities.\nAssumption II: No candidate has ever forgotten their ID card before.",
  options: SA_OPTIONS(),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "I is the reasonable purpose behind the instruction. II is an unwarranted, overly strong claim not implied by the instruction.",
  concept: "Distinguishing reasonable assumptions from overly strong ones",
  exam_tip: "Watch for absolute claims like 'never' or 'always' in assumption options — they're rarely valid.",
});
add({
  question_type: "Statement & Assumption",
  question_text:
    "Statement: 'Save water — every drop counts.'\n" +
    "Assumption I: Water is a limited resource.\nAssumption II: This message will stop all water wastage completely.",
  options: SA_OPTIONS(),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "I underlies the entire message's rationale. II is an unwarranted, overly strong claim about the message's effectiveness.",
  concept: "Distinguishing reasonable assumptions from overly strong ones",
  exam_tip: "A message's underlying rationale is a valid assumption; a claim about the message's guaranteed effectiveness usually is not.",
});
add({
  question_type: "Statement & Assumption",
  question_text:
    "Statement: 'Wash your hands before eating to prevent illness.'\n" +
    "Assumption I: Hands can carry germs that cause illness.\nAssumption II: Some people don't wash their hands before eating.",
  options: SA_OPTIONS(),
  correct_option_key: "C",
  difficulty: "medium",
  explanation: "I is the stated rationale. II is implicit because the reminder would be unnecessary if everyone already did this.",
  concept: "Assumption identification behind an instruction",
  exam_tip: "As with most reminder-style statements, check for both the 'why' (rationale) and the 'why needed' (non-universal compliance) assumptions.",
});
add({
  question_type: "Statement & Assumption",
  question_text:
    "Statement: 'The store will remain closed on Sunday for renovation.'\n" +
    "Assumption I: Customers will be unhappy about the closure.\nAssumption II: Renovation always takes exactly one day.",
  options: SA_OPTIONS(),
  correct_option_key: "D",
  difficulty: "medium",
  explanation: "Neither assumption is necessarily implied — the statement doesn't address customer reaction or claim anything about renovation timelines in general.",
  concept: "Recognizing when no strong assumption is implicit",
  exam_tip: "A factual closure notice doesn't need to assume how people will feel about it or generalize about unrelated situations.",
});
add({
  question_type: "Statement & Assumption",
  question_text:
    "Statement: 'Late submissions will not be accepted under any circumstances.'\n" +
    "Assumption I: All students will submit on time.\nAssumption II: Some students might attempt to submit late.",
  options: SA_OPTIONS(),
  correct_option_key: "B",
  difficulty: "medium",
  explanation: "I is not assumed — in fact the strict rule implies the opposite concern. II is implicit, since the rule wouldn't need stating if lateness weren't a real possibility.",
  concept: "Identifying the implied concern behind a strict rule",
  exam_tip: "A strict rule against something typically assumes that thing is a realistic possibility, not that it will never happen.",
});
add({
  question_type: "Statement & Assumption",
  question_text:
    "Statement: 'Please keep your mobile phones on silent mode during the seminar.'\n" +
    "Assumption I: Phone ringtones can disturb the seminar.\nAssumption II: All attendees will comply with the request.",
  options: SA_OPTIONS(),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "I is the reasonable rationale behind the request. II is too strong an assumption to be necessarily implied.",
  concept: "Distinguishing reasonable assumptions from overly strong ones",
  exam_tip: "Requests imply their own rationale, but never imply guaranteed compliance — that would make the request pointless to state.",
});
add({
  question_type: "Statement & Assumption",
  question_text:
    "Statement: 'Recycle paper and plastic to help the environment.'\n" +
    "Assumption I: Recycling has a positive effect on the environment.\nAssumption II: Some people currently do not recycle.",
  options: SA_OPTIONS(),
  correct_option_key: "C",
  difficulty: "medium",
  explanation: "I is the stated rationale. II is implicit — an appeal to recycle wouldn't be needed if everyone already did.",
  concept: "Assumption identification behind an instruction",
  exam_tip: "Public appeals for behavior change almost always assume both a rationale AND a current shortfall in that behavior.",
});
add({
  question_type: "Statement & Assumption",
  question_text:
    "Statement: 'The annual sports day will be held on the school grounds this year.'\n" +
    "Assumption I: Last year's sports day was held elsewhere.\nAssumption II: The school grounds are the best venue available.",
  options: SA_OPTIONS(),
  correct_option_key: "D",
  difficulty: "medium",
  explanation: "Neither assumption is necessarily implied — the statement is a simple venue announcement without comparison to past years or other venues.",
  concept: "Recognizing when no strong assumption is implicit",
  exam_tip: "Don't infer history or comparative judgments ('best venue') from a statement that only announces a single fact.",
});

export async function seedCriticalReasoning() {
  await seedSubjectQuestions("critical_reasoning", Q);
}

if (require.main === module) {
  seedCriticalReasoning().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
