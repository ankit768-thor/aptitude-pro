import { seedSubjectQuestions, opts, type QuestionSeed } from "./lib";

const Q: QuestionSeed[] = [];
function add(q: QuestionSeed) {
  Q.push(q);
}

// ==== Reading Comprehension — Passage 1 (e-commerce) ====
const PASSAGE_1 =
  "Passage: Over the last decade, e-commerce in India has grown at a compound annual rate exceeding 25%, " +
  "driven primarily by increasing smartphone penetration and improved logistics infrastructure. While metro " +
  "cities initially accounted for the bulk of online transactions, tier-2 and tier-3 cities now contribute " +
  "nearly half of all new customers, a shift attributed to affordable data plans and vernacular-language " +
  "interfaces. However, profitability remains elusive for most e-commerce firms, as heavy discounting to " +
  "acquire customers continues to erode margins. Analysts suggest that the next phase of growth will depend " +
  "less on customer acquisition and more on improving unit economics through better supply chain efficiency " +
  "and reduced return rates.";

add({
  question_type: "Reading Comprehension",
  question_text: `${PASSAGE_1}\n\nQuestion: According to the passage, what has primarily driven tier-2 and tier-3 city e-commerce growth?`,
  options: opts("Affordable data plans and vernacular-language interfaces", "Heavy discounting", "Improved profitability", "Metro city expansion"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "The passage directly attributes the shift to 'affordable data plans and vernacular-language interfaces.'",
  concept: "Direct fact retrieval from a passage",
  exam_tip: "For 'according to the passage' questions, find the exact sentence — don't rely on general impressions.",
});
add({
  question_type: "Reading Comprehension",
  question_text: `${PASSAGE_1}\n\nQuestion: What does the passage suggest is necessary for the next phase of e-commerce growth?`,
  options: opts("Better supply chain efficiency and reduced return rates", "More aggressive discounting", "Expansion into metro cities", "Higher smartphone penetration"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "The final sentence states growth will depend on 'improving unit economics through better supply chain efficiency and reduced return rates.'",
  concept: "Inference from a passage's concluding argument",
  exam_tip: "The last sentence of a business-style RC passage often carries the author's main forward-looking claim.",
});
add({
  question_type: "Reading Comprehension",
  question_text: `${PASSAGE_1}\n\nQuestion: Why does profitability remain elusive for most e-commerce firms, according to the passage?`,
  options: opts("Heavy discounting to acquire customers erodes margins", "Logistics infrastructure is poor", "Tier-2 cities don't shop online", "Data plans are too expensive"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "The passage states profitability is elusive 'as heavy discounting to acquire customers continues to erode margins.'",
  concept: "Cause-effect identification within a passage",
  exam_tip: "Watch for 'as' / 'because' / 'due to' clauses — they usually signal the answer to a 'why' question.",
});

// ==== Reading Comprehension — Passage 2 (remote work) ====
const PASSAGE_2 =
  "Passage: Remote work, once considered a temporary response to unusual circumstances, has become a " +
  "permanent fixture in many organizations' operating models. Proponents argue that it expands the talent " +
  "pool beyond geographic constraints and improves employee satisfaction by offering flexibility. Critics, " +
  "however, point to challenges in maintaining organizational culture and mentoring junior employees who " +
  "lack in-person exposure to senior colleagues. A hybrid model, combining designated in-office days with " +
  "remote flexibility, has emerged as a compromise favored by many companies, though its long-term " +
  "effectiveness is still being studied.";

add({
  question_type: "Reading Comprehension",
  question_text: `${PASSAGE_2}\n\nQuestion: According to the passage, what advantage does remote work offer employers?`,
  options: opts("It expands the talent pool beyond geographic constraints", "It reduces the need for management", "It eliminates the need for junior employees", "It guarantees higher profits"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "The passage states proponents argue remote work 'expands the talent pool beyond geographic constraints.'",
  concept: "Direct fact retrieval from a passage",
  exam_tip: "Distinguish claims attributed to 'proponents' from claims attributed to 'critics' — RC questions often test this.",
});
add({
  question_type: "Reading Comprehension",
  question_text: `${PASSAGE_2}\n\nQuestion: What challenge do critics associate with remote work?`,
  options: opts("Difficulty maintaining organizational culture and mentoring junior employees", "Higher salaries", "Reduced talent pool", "Increased office costs"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "The passage states critics 'point to challenges in maintaining organizational culture and mentoring junior employees.'",
  concept: "Direct fact retrieval from a passage",
  exam_tip: "Locate the sentence that introduces the opposing viewpoint (often after 'however' or 'critics').",
});
add({
  question_type: "Reading Comprehension",
  question_text: `${PASSAGE_2}\n\nQuestion: What compromise does the passage describe?`,
  options: opts("A hybrid model combining in-office days with remote flexibility", "Fully remote work for all employees", "Mandatory full-time office work", "Outsourcing all junior roles"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "The passage describes 'a hybrid model, combining designated in-office days with remote flexibility.'",
  concept: "Direct fact retrieval from a passage",
  exam_tip: "Compromise/solution sentences in RC passages are common answer sources — they often appear near the end.",
});

// ==== Grammar ====
add({
  question_type: "Grammar",
  question_text: "Choose the correctly punctuated sentence.",
  options: opts("Although it was raining, we decided to go for a walk.", "Although it was raining we decided, to go for a walk.", "Although, it was raining we decided to go for a walk.", "Although it was raining we decided to go, for a walk."),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "A comma is needed after an introductory subordinate clause ('Although it was raining'), not mid-sentence.",
  concept: "Comma placement after introductory clauses",
  exam_tip: "If a sentence starts with 'Although/Because/While + clause', a comma goes right before the main clause.",
});
add({
  question_type: "Grammar",
  question_text: "Fill in the blank: 'Neither of the students ___ submitted the assignment.'",
  options: opts("has", "have", "had have", "having"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "'Neither' is grammatically singular, so it takes the singular verb 'has'.",
  concept: "Subject-verb agreement with 'neither/either'",
  exam_tip: "'Neither', 'either', 'each', and 'every' are always followed by a singular verb.",
});
add({
  question_type: "Grammar",
  question_text: "Choose the grammatically correct sentence.",
  options: opts("She is one of the students who has completed the project.", "She is one of the students who have completed the project.", "She are one of the students who have completed the project.", "She is one of the student who have completed the project."),
  correct_option_key: "B",
  difficulty: "hard",
  explanation: "'Who' refers back to the plural 'students', so the verb must be plural: 'who have completed'.",
  concept: "Subject-verb agreement in 'one of the [plural] who' constructions",
  exam_tip: "In 'one of the X who...', the verb after 'who' agrees with X (plural), not with 'one'.",
});
add({
  question_type: "Grammar",
  question_text: "Fill in the blank: 'By the time we arrived, the meeting ___ already started.'",
  options: opts("has", "had", "have", "was"),
  correct_option_key: "B",
  difficulty: "medium",
  explanation: "The past perfect ('had started') is used for an action completed before another past action ('arrived').",
  concept: "Past perfect tense usage",
  exam_tip: "'By the time + past tense clause' is a strong signal that the other clause needs the past perfect.",
});
add({
  question_type: "Grammar",
  question_text: "Choose the correct sentence.",
  options: opts("Each of the employees have their own desk.", "Each of the employees has their own desk.", "Each of the employees has its own desk.", "Each of employees has their own desk."),
  correct_option_key: "B",
  difficulty: "medium",
  explanation: "'Each' is singular, taking 'has'; 'their' is the accepted gender-neutral possessive for the individual employees.",
  concept: "Subject-verb agreement with 'each'",
  exam_tip: "'Each of the [plural noun]' always takes a singular verb, regardless of the plural noun that follows.",
});
add({
  question_type: "Grammar",
  question_text: "Identify the correctly structured sentence.",
  options: opts("Not only he is smart, but also hardworking.", "Not only is he smart, but also hardworking.", "Not only is he smart, but he is also hardworking.", "He is not only smart but also he is hardworking."),
  correct_option_key: "C",
  difficulty: "hard",
  explanation: "'Not only...but also' requires parallel structure and subject-verb inversion after 'Not only': 'Not only is he smart, but he is also hardworking.'",
  concept: "Parallel structure with correlative conjunctions",
  exam_tip: "After a fronted 'Not only', invert the subject and verb, just like in a question.",
});
add({
  question_type: "Grammar",
  question_text: "Choose the correct word: 'The company's revenue ___ significantly over the past year.'",
  options: opts("have increased", "has increased", "had increase", "increasing"),
  correct_option_key: "B",
  difficulty: "easy",
  explanation: "'The company's revenue' is a singular subject, so it takes 'has increased'.",
  concept: "Subject-verb agreement with possessive singular subjects",
  exam_tip: "Ignore the plural-looking possessive ('company's') — identify the actual head noun ('revenue', singular).",
});
add({
  question_type: "Grammar",
  question_text: "Choose the correctly punctuated sentence.",
  options: opts("The manager said, that the deadline is tomorrow.", "The manager said that, the deadline is tomorrow.", "The manager said that the deadline is tomorrow.", "The manager, said that the deadline is tomorrow."),
  correct_option_key: "C",
  difficulty: "easy",
  explanation: "No comma is needed before or after 'that' when it introduces a reported clause.",
  concept: "Comma usage with reported speech ('that' clauses)",
  exam_tip: "'Said that + clause' never takes a comma around 'that' — a common over-punctuation mistake.",
});

// ==== Vocabulary ====
add({
  question_type: "Vocabulary",
  question_text: "Choose the word most nearly OPPOSITE in meaning to 'AUSTERE'.",
  options: opts("Lavish", "Strict", "Plain", "Harsh"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "'Austere' means strict, plain, or without luxury — the opposite is 'lavish'.",
  concept: "Antonyms",
  exam_tip: "Eliminate options that are synonyms first ('strict', 'plain', 'harsh' are all close to austere).",
});
add({
  question_type: "Vocabulary",
  question_text: "Choose the word most nearly SIMILAR in meaning to 'PRAGMATIC'.",
  options: opts("Idealistic", "Practical", "Emotional", "Theoretical"),
  correct_option_key: "B",
  difficulty: "easy",
  explanation: "'Pragmatic' means dealing with things sensibly and realistically — closest to 'practical'.",
  concept: "Synonyms",
  exam_tip: "'Pragmatic' is a frequently tested word in business-context vocabulary sections.",
});
add({
  question_type: "Vocabulary",
  question_text: "Choose the word most nearly OPPOSITE in meaning to 'TRANSPARENT'.",
  options: opts("Clear", "Obvious", "Opaque", "Honest"),
  correct_option_key: "C",
  difficulty: "easy",
  explanation: "'Transparent' means see-through or easily understood — its opposite is 'opaque'.",
  concept: "Antonyms",
  exam_tip: "In a business context, 'transparent' often means 'open/honest' — watch which sense the antonym targets.",
});
add({
  question_type: "Vocabulary",
  question_text: "Choose the word most nearly SIMILAR in meaning to 'MERIDIAN' (used figuratively, as in 'the meridian of one's career').",
  options: opts("Peak", "Valley", "Base", "Edge"),
  correct_option_key: "A",
  difficulty: "hard",
  explanation: "Used figuratively, 'meridian' refers to the highest point or zenith — closest to 'peak'.",
  concept: "Synonyms (figurative usage)",
  exam_tip: "Some vocabulary words shift meaning in figurative use — always check for a context clue in the question.",
});
add({
  question_type: "Vocabulary",
  question_text: "Choose the word most nearly OPPOSITE in meaning to 'FRUGAL'.",
  options: opts("Thrifty", "Economical", "Extravagant", "Careful"),
  correct_option_key: "C",
  difficulty: "easy",
  explanation: "'Frugal' means careful with money or resources — the opposite is 'extravagant'.",
  concept: "Antonyms",
  exam_tip: "'Thrifty' and 'economical' are synonyms, not antonyms, of 'frugal' — a common distractor trap.",
});
add({
  question_type: "Vocabulary",
  question_text: "Choose the word most nearly SIMILAR in meaning to 'CANDID'.",
  options: opts("Frank", "Secretive", "Deceptive", "Reserved"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "'Candid' means truthful and straightforward — closest to 'frank'.",
  concept: "Synonyms",
  exam_tip: "The other three options are all in the 'withholding truth' family — the opposite direction of 'candid'.",
});
add({
  question_type: "Vocabulary",
  question_text: "Choose the word most nearly OPPOSITE in meaning to 'VOLATILE' (as in 'a volatile market').",
  options: opts("Unstable", "Stable", "Explosive", "Unpredictable"),
  correct_option_key: "B",
  difficulty: "medium",
  explanation: "'Volatile' means liable to change rapidly and unpredictably — its opposite is 'stable'.",
  concept: "Antonyms (business-context usage)",
  exam_tip: "'Volatile' appears often in finance-flavored vocabulary questions — know it in the market/price sense.",
});
add({
  question_type: "Vocabulary",
  question_text: "Choose the word most nearly SIMILAR in meaning to 'MERCENARY' (as an adjective describing a person's motives).",
  options: opts("Charitable", "Motivated purely by profit", "Loyal", "Selfless"),
  correct_option_key: "B",
  difficulty: "hard",
  explanation: "As an adjective, 'mercenary' describes someone motivated solely by monetary gain.",
  concept: "Synonyms (adjective usage)",
  exam_tip: "Don't confuse the adjective sense ('mercenary motives') with the noun sense ('a mercenary', a hired soldier).",
});

// ==== Para-jumbles ====
add({
  question_type: "Para-jumbles",
  question_text:
    "Arrange P, Q, R, S into a logical paragraph:\nP) As a result, the company's stock price fell by 12% in a single day.\nQ) The quarterly earnings report was released on Monday morning.\nR) Analysts had expected much stronger numbers based on prior guidance.\nS) It showed revenue growth of just 2%, well below expectations.",
  options: opts("QRSP", "QSRP", "PQRS", "SQRP"),
  correct_option_key: "B",
  difficulty: "medium",
  explanation: "Logical flow: Q (report released) → S (what it showed) → R (analysts' expectation contrast) → P (resulting stock fall).",
  concept: "Paragraph sequencing (cause-effect chain)",
  exam_tip: "Look for the sentence that introduces the topic (usually first) and the one with 'as a result' (usually last).",
});
add({
  question_type: "Para-jumbles",
  question_text:
    "Arrange P, Q, R, S into a logical paragraph:\nP) This led to widespread adoption across industries within just a few years.\nQ) Cloud computing emerged as a transformative technology in the early 2000s.\nR) Companies realized they could reduce IT infrastructure costs significantly.\nS) It allowed businesses to access computing resources over the internet without owning physical servers.",
  options: opts("QRSP", "SQRP", "QSRP", "QSPR"),
  correct_option_key: "C",
  difficulty: "medium",
  explanation: "Logical flow: Q (introduces the technology) → S (explains what it enabled) → R (the realized benefit) → P (resulting adoption).",
  concept: "Paragraph sequencing (definition then consequence)",
  exam_tip: "The sentence naming the subject for the first time almost always opens the paragraph.",
});
add({
  question_type: "Para-jumbles",
  question_text:
    "Arrange P, Q, R, S into a logical paragraph:\nP) However, critics argue that this approach ignores long-term sustainability.\nQ) Many startups prioritize rapid growth over immediate profitability.\nR) This strategy, often called 'growth at all costs', has produced several successful unicorns.\nS) Investors continue to fund such startups because of the potential for high future returns.",
  options: opts("QRSP", "QSRP", "RQSP", "QRPS"),
  correct_option_key: "A",
  difficulty: "hard",
  explanation: "Logical flow: Q (states the priority) → R (names the strategy and its results) → S (why investors keep funding it) → P (critics' counterpoint).",
  concept: "Paragraph sequencing (claim, evidence, counterargument)",
  exam_tip: "A sentence starting with 'However' almost always closes the paragraph, offering a counterpoint.",
});
add({
  question_type: "Para-jumbles",
  question_text:
    "Arrange P, Q, R, S into a logical paragraph:\nP) Consequently, many firms have begun investing heavily in employee wellness programs.\nQ) Workplace stress has been linked to reduced productivity and higher turnover.\nR) These programs range from flexible schedules to on-site counseling services.\nS) Recent studies confirm that mental health directly affects performance.",
  options: opts("QSRP", "QSPR", "SQPR", "QPSR"),
  correct_option_key: "B",
  difficulty: "medium",
  explanation: "Logical flow: Q (states the link) → S (studies confirming it) → P (consequently, firms invest) → R (what those programs include).",
  concept: "Paragraph sequencing (claim, evidence, response, detail)",
  exam_tip: "A sentence detailing specifics of something just introduced ('these programs') must follow, not precede, that introduction.",
});
add({
  question_type: "Para-jumbles",
  question_text:
    "Arrange P, Q, R, S into a logical paragraph:\nP) The bank subsequently tightened its lending criteria for such loans.\nQ) A sharp rise in loan defaults was reported in the housing sector last quarter.\nR) This tightening is expected to slow down home purchases in the short term.\nS) The defaults were largely attributed to rising interest rates.",
  options: opts("QSPR", "QPSR", "SQPR", "QSRP"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Logical flow: Q (reports the rise) → S (attributes the cause) → P (the bank's response) → R (the expected effect of that response).",
  concept: "Paragraph sequencing (event, cause, response, effect)",
  exam_tip: "Track pronouns like 'this' and 'such' — 'this tightening' can only follow the sentence that introduces tightening.",
});
add({
  question_type: "Para-jumbles",
  question_text:
    "Arrange P, Q, R, S into a logical paragraph:\nP) This has forced retailers to rethink their supply chains entirely.\nQ) Global shipping costs rose sharply during the pandemic due to container shortages.\nR) Some companies responded by sourcing materials locally instead.\nS) The shortages caused significant delays in delivery timelines worldwide.",
  options: opts("QSPR", "QPSR", "SQPR", "QSRP"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Logical flow: Q (costs rose due to shortages) → S (the shortages' effect) → P (forced a rethink) → R (a specific response).",
  concept: "Paragraph sequencing (cause, effect, consequence, response)",
  exam_tip: "A sentence naming 'some companies' responding almost always comes last, after the problem is fully established.",
});

export async function seedVerbal() {
  await seedSubjectQuestions("verbal", Q);
}

if (require.main === module) {
  seedVerbal().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
