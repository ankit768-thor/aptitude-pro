import { appendUnique } from "./genlib";
import { seedSubjectQuestions, opts, type QuestionSeed } from "./lib";
import { generateLogical } from "./generate-logical";

export const Q: QuestionSeed[] = [];
function add(q: QuestionSeed) {
  Q.push(q);
}

// ==== Puzzles ====
add({
  question_type: "Puzzles",
  question_text:
    "Five friends A, B, C, D, E sit in a row. D is to the immediate left of A. B is to the immediate right of A. C is to the immediate right of B. E sits at the right end (not the left end). What is the order from left to right?",
  options: opts("D-A-B-C-E", "E-D-A-B-C", "A-B-C-D-E", "D-A-C-B-E"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "D-A-B-C forms a fixed block. Since E must be at the right end (not the left), the order is D-A-B-C-E.",
  concept: "Linear arrangement from relative-position clues",
  exam_tip: "Build the fixed block from the relative clues first, then place the remaining person using the elimination clue.",
});
add({
  question_type: "Puzzles",
  question_text: "If Monday falls on the 1st of a month, what day of the week will the 29th of that month fall on?",
  options: opts("Monday", "Sunday", "Tuesday", "Saturday"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "29 − 1 = 28 days later. 28 ÷ 7 = exactly 4 weeks, so the 29th falls on the same day: Monday.",
  shortcut: "Any date that is a multiple of 7 days after a known date falls on the same weekday.",
  concept: "Calendar/day-of-week reasoning",
  exam_tip: "Always work with the day difference mod 7 — it's faster than counting day by day.",
});
add({
  question_type: "Puzzles",
  question_text:
    "A is taller than B. C is shorter than A but taller than B. D is taller than everyone else. Arrange them in descending order of height.",
  options: opts("D-A-C-B", "A-D-C-B", "D-C-A-B", "A-D-B-C"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "D is tallest. A > C > B is given directly. So the full order is D-A-C-B.",
  concept: "Ordering from comparative clues",
  exam_tip: "Chain the comparisons into a single ordered list before matching to the options.",
});
add({
  question_type: "Puzzles",
  question_text:
    "Six boxes are stacked one above another. Box R is at the bottom. Box S is directly above R. Box Q is directly above S. Box P is directly above Q. Box T is at the very top. Arrange the boxes from top to bottom.",
  options: opts("T-P-Q-S-R", "T-Q-P-S-R", "P-T-Q-S-R", "T-P-S-Q-R"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Building up from the bottom: R, S, Q, P, and T at the top gives (top to bottom) T-P-Q-S-R.",
  concept: "Vertical stacking arrangement",
  exam_tip: "Build the stack from a fixed anchor (here, the bottom box) upward, then read it in the direction asked.",
});
add({
  question_type: "Puzzles",
  question_text:
    "Among four houses on a street (left to right), the blue house is to the left of the yellow house. The red house is immediately to the left of the yellow house. The red house is to the right of the blue house. The yellow house is to the left of the green house. What is the left-to-right order?",
  options: opts("Blue-Red-Yellow-Green", "Blue-Yellow-Red-Green", "Red-Blue-Yellow-Green", "Blue-Red-Green-Yellow"),
  correct_option_key: "A",
  difficulty: "hard",
  explanation:
    "Red is immediately left of Yellow, and Blue is left of Red, so the order so far is Blue-Red-Yellow. Yellow is left of Green, so Green comes last: Blue-Red-Yellow-Green.",
  concept: "Linear arrangement with 'immediately left/right of' clues",
  exam_tip: "'Immediately left/right of' clues are the strongest constraint — anchor your arrangement with those first.",
});

// ==== Seating Arrangement ====
add({
  question_type: "Seating Arrangement",
  question_text:
    "Five people P, Q, R, S, T sit in a row facing north, numbered 1 to 5 from left to right. R sits at position 3. Q sits immediately to the left of R. T sits immediately to the right of R. P sits at position 1. Where does S sit?",
  options: opts("Position 5", "Position 1", "Position 2", "Position 4"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "R=3, Q=2, T=4, P=1. The only remaining position, 5, must be S.",
  concept: "Linear seating with numbered positions",
  exam_tip: "Fill in every fixed position first; whoever is left over automatically takes the one open slot.",
});
add({
  question_type: "Seating Arrangement",
  question_text:
    "Six people A, B, C, D, E, F sit in a row facing north, positions 1 to 6 from left to right. A sits at position 2. B sits immediately to the right of A. C sits at the rightmost end. D sits immediately to the left of C. E sits at position 1. Where does F sit?",
  options: opts("Position 4", "Position 3", "Position 5", "Position 6"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "A=2, B=3, C=6, D=5, E=1. The only remaining position, 4, must be F.",
  concept: "Linear seating with numbered positions",
  exam_tip: "Sketch the six slots and cross off each name as its position is fixed — errors usually come from skipping this step.",
});
add({
  question_type: "Seating Arrangement",
  question_text:
    "Five friends sit in a row. Aman sits second from the left. Bhavna sits immediately to the right of Aman. Deepa sits immediately to the left of Aman. Chetan sits at the rightmost end. Who sits at the leftmost end?",
  options: opts("Deepa", "Bhavna", "Chetan", "Esha"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Aman=2, Deepa=1 (left of Aman), Bhavna=3, Chetan=5. Deepa, at position 1, is at the leftmost end.",
  concept: "Linear seating — deriving an endpoint",
  exam_tip: "'Second from the left' fixes an absolute position (2) — use it as your anchor before placing relative clues.",
});
add({
  question_type: "Seating Arrangement",
  question_text:
    "Four people W, X, Y, Z sit around a square table, one on each side, all facing the center. W sits opposite X. Y sits immediately to the right of W. Where does Z sit relative to Y?",
  options: opts("Opposite Y", "Immediate right of Y", "Same side as Y", "Immediate left of W"),
  correct_option_key: "A",
  difficulty: "hard",
  explanation:
    "With W opposite X and Y immediately right of W, the only remaining side (immediately left of W, immediately right of X) is Z's — which is directly opposite Y.",
  concept: "Circular/square-table seating",
  exam_tip: "On a 4-seat square table, each person has exactly one person opposite them and two people adjacent.",
});
add({
  question_type: "Seating Arrangement",
  question_text:
    "Seven people sit in a row numbered 1 to 7 from left to right. M sits exactly in the middle. N sits three places to the left of M. O sits immediately to the right of M. Where does N sit?",
  options: opts("Position 1", "Position 2", "Position 3", "Position 7"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "The middle of 7 seats is position 4, so M=4. Three places left of M is 4−3=1, so N sits at position 1.",
  concept: "Linear seating — middle-position anchoring",
  exam_tip: "For an odd-numbered row, the middle position is (n+1)/2 — memorize this to save time.",
});

// ==== Coding-Decoding ====
add({
  question_type: "Coding-Decoding",
  question_text: "If CAT is coded as DBU, how is DOG coded (using the same letter-shift rule)?",
  options: opts("EPH", "EPI", "FPH", "EPG"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Each letter is shifted forward by 1 (C→D, A→B, T→U). Applying the same shift: D→E, O→P, G→H, giving EPH.",
  concept: "Letter-shift coding",
  exam_tip: "Find the shift amount from the example pair first, then apply it mechanically to the new word.",
});
add({
  question_type: "Coding-Decoding",
  question_text: "In a code language, 'ROSE' is written as 'URVH'. How is 'LOTUS' written in the same code?",
  options: opts("ORWXV", "ORWXW", "ORWYV", "PRWXV"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Each letter is shifted forward by 3 (R→U, O→R, S→V, E→H). Applying +3 to L,O,T,U,S gives O,R,W,X,V — 'ORWXV'.",
  concept: "Letter-shift coding",
  exam_tip: "Verify your derived shift against all four letters of the example before applying it to the new word.",
});
add({
  question_type: "Coding-Decoding",
  question_text: "If 'PAPER' is coded as 'QBQFS', what is the code for 'PENCIL' using the same rule?",
  options: opts("QFODJM", "QFODJN", "QFPDJM", "QGODJM"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Each letter is shifted forward by 1. Applying +1 to P,E,N,C,I,L gives Q,F,O,D,J,M — 'QFODJM'.",
  concept: "Letter-shift coding",
  exam_tip: "Write each letter's alphabet position above it to avoid off-by-one shift errors under time pressure.",
});
add({
  question_type: "Coding-Decoding",
  question_text: "If A=1, B=2, C=3 ... Z=26, what is the sum of the letter-values of the word 'CAB'?",
  options: opts("6", "5", "7", "8"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "C=3, A=1, B=2. Sum = 3+1+2 = 6.",
  concept: "Alphabet-to-number coding",
  exam_tip: "For sum-of-letters questions, just add the positions directly — no need to memorize the full alphabet order.",
});
add({
  question_type: "Coding-Decoding",
  question_text: "In a certain code, a word is written by simply reversing its letters. How is 'FLOWER' written in this code?",
  options: opts("REWOLF", "FLOWER", "ROWELF", "REOWLF"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Reversing 'FLOWER' letter by letter gives 'REWOLF'.",
  concept: "Reversal coding",
  exam_tip: "Write the word backward one letter at a time rather than trying to reverse it mentally in one step.",
});

// ==== Syllogisms ====
add({
  question_type: "Syllogisms",
  question_text:
    "Statements: All roses are flowers. Some flowers are red.\nConclusion I: Some roses are red.\nConclusion II: All flowers are roses.\nWhich conclusion(s) follow?",
  options: opts("Only I follows", "Only II follows", "Both follow", "Neither follows"),
  correct_option_key: "D",
  difficulty: "hard",
  explanation:
    "'Some flowers are red' doesn't guarantee overlap with the specific subset that are roses, so Conclusion I doesn't necessarily follow. Conclusion II reverses the first statement's direction and doesn't follow either.",
  concept: "Syllogism validity (avoiding unwarranted overlap assumptions)",
  exam_tip: "'Some X are Y' + 'All Z are X' does NOT guarantee 'some Z are Y' — a very common syllogism trap.",
});
add({
  question_type: "Syllogisms",
  question_text:
    "Statements: All dogs are animals. All animals are living beings.\nConclusion I: All dogs are living beings.\nConclusion II: All living beings are dogs.\nWhich conclusion(s) follow?",
  options: opts("Only I follows", "Only II follows", "Both follow", "Neither follows"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "By transitivity, all dogs are living beings (Conclusion I). Conclusion II reverses the logic and does not follow.",
  concept: "Syllogism validity (transitive chaining)",
  exam_tip: "'All A are B' + 'All B are C' validly gives 'All A are C' — but never the reverse.",
});
add({
  question_type: "Syllogisms",
  question_text:
    "Statements: No fish are mammals. All whales are mammals.\nConclusion I: No whales are fish.\nConclusion II: Some mammals are not fish.\nWhich conclusion(s) follow?",
  options: opts("Only I follows", "Only II follows", "Both follow", "Neither follows"),
  correct_option_key: "C",
  difficulty: "hard",
  explanation:
    "Since whales are mammals and no mammals are fish, no whales are fish (Conclusion I follows). Also, since whales exist and are mammals but not fish, 'some mammals are not fish' follows (Conclusion II).",
  concept: "Syllogism validity ('No A are B' combined with a subset clause)",
  exam_tip: "When one premise is a full exclusion ('No A are B'), any subset of B automatically inherits that exclusion from A.",
});
add({
  question_type: "Syllogisms",
  question_text:
    "Statements: Some teachers are writers. All writers are readers.\nConclusion I: Some teachers are readers.\nConclusion II: All teachers are readers.\nWhich conclusion(s) follow?",
  options: opts("Only I follows", "Only II follows", "Both follow", "Neither follows"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "The teachers who are writers are also readers, so 'some teachers are readers' follows. It doesn't extend to ALL teachers.",
  concept: "Syllogism validity ('Some' premises limit the conclusion's scope)",
  exam_tip: "A conclusion can never be stronger (e.g., 'All') than what a 'Some' premise supports.",
});
add({
  question_type: "Syllogisms",
  question_text:
    "Statements: All squares are rectangles. All rectangles are quadrilaterals.\nConclusion I: All squares are quadrilaterals.\nConclusion II: All quadrilaterals are squares.\nWhich conclusion(s) follow?",
  options: opts("Only I follows", "Only II follows", "Both follow", "Neither follows"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "By transitivity, all squares are quadrilaterals (Conclusion I). Conclusion II reverses the logic and does not follow.",
  concept: "Syllogism validity (transitive chaining)",
  exam_tip: "Real-world geometric knowledge can help sanity-check syllogism answers, but always verify using the stated premises only.",
});

// ==== Blood Relations ====
add({
  question_type: "Blood Relations",
  question_text: "Pointing to a photograph, a man said, 'She is the daughter of my grandfather's only son.' How is the woman related to the man?",
  options: opts("Sister", "Daughter", "Cousin", "Mother"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "The grandfather's only son must be the man's father. The daughter of the man's father is his sister.",
  concept: "Blood relations via a single-son constraint",
  exam_tip: "'Only son/daughter' is a strong clue — it pins the relation to exactly one specific family member.",
});
add({
  question_type: "Blood Relations",
  question_text: "Introducing a woman, a man said, 'Her mother is the only daughter of my mother.' How is the man related to the woman?",
  options: opts("Maternal uncle", "Father", "Brother", "Grandfather"),
  correct_option_key: "A",
  difficulty: "hard",
  explanation:
    "The only daughter of the man's mother is the man's sister. Her mother is the woman's mother — so the man is the woman's mother's brother, i.e., her maternal uncle.",
  concept: "Blood relations via nested clauses",
  exam_tip: "Untangle nested relation clauses one clause at a time, starting from the innermost reference.",
});
add({
  question_type: "Blood Relations",
  question_text: "A is B's sister. C is B's mother. D is C's father. E is D's mother. How is A related to D?",
  options: opts("Granddaughter", "Daughter", "Niece", "Sister"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "C is A and B's mother. D is C's father, making D the grandfather of both A and B — so A is D's granddaughter.",
  concept: "Multi-generational blood relations",
  exam_tip: "Draw a quick family tree with generations stacked vertically — it prevents errors in longer relation chains.",
});
add({
  question_type: "Blood Relations",
  question_text: "Pointing to a man, a woman says, 'His mother is the only daughter of my mother.' How is the woman related to the man?",
  options: opts("Mother", "Sister", "Aunt", "Grandmother"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "The only daughter of the woman's mother is the woman herself. So the man's mother is the woman — she is his mother.",
  concept: "Blood relations via self-reference",
  exam_tip: "When a clue describes 'the only daughter/son of my parent', check whether it could refer to the speaker themselves.",
});
add({
  question_type: "Blood Relations",
  question_text: "P is the brother of Q. R is the mother of P. S is the father of R. How is Q related to S?",
  options: opts("Grandchild", "Grandmother", "Aunt", "Cousin"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "R is the mother of both P and Q (siblings). S is R's father, making S the grandfather of both P and Q — so Q is S's grandchild.",
  concept: "Multi-generational blood relations",
  exam_tip: "When a sibling's gender is unspecified, use gender-neutral relation terms like 'grandchild' rather than guessing.",
});

// ==== Series ====
add({
  question_type: "Series",
  question_text: "Find the next term: A, C, F, J, O, ?",
  options: opts("U", "T", "V", "W"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "The gaps between letters increase by 1 each time (+2, +3, +4, +5, +6). O + 6 positions = U.",
  concept: "Letter series with increasing gaps",
  exam_tip: "Convert letters to their alphabet positions (A=1...Z=26) to spot the numeric pattern quickly.",
});
add({
  question_type: "Series",
  question_text: "Find the missing term: Z, X, U, Q, ?",
  options: opts("L", "K", "M", "N"),
  correct_option_key: "A",
  difficulty: "hard",
  explanation: "The gaps decrease going backward by increasing amounts (−2, −3, −4, −5). Q − 5 positions = L.",
  concept: "Letter series with increasing gaps (descending)",
  exam_tip: "Descending letter series are easier to solve by converting to numbers and working forward instead of backward.",
});
add({
  question_type: "Series",
  question_text: "Find the next term: B, D, G, K, P, ?",
  options: opts("V", "U", "W", "T"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "The gaps increase by 1 each time (+2, +3, +4, +5, +6). P + 6 positions = V.",
  concept: "Letter series with increasing gaps",
  exam_tip: "Always verify the pattern holds for at least 3 consecutive gaps before applying it to find the answer.",
});
add({
  question_type: "Series",
  question_text: "Find the missing term: AZ, BY, CX, DW, ?",
  options: opts("EV", "EU", "FV", "EW"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "The first letter moves forward (A→B→C→D→E) while the second moves backward (Z→Y→X→W→V), giving 'EV'.",
  concept: "Two-letter series with opposite-direction patterns",
  exam_tip: "When a series has two letters per term, check each position's pattern independently.",
});
add({
  question_type: "Series",
  question_text: "Find the next term: 2, 4, 8, 16, 32, ?",
  options: opts("64", "60", "66", "62"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Each term doubles the previous one. 32 × 2 = 64.",
  concept: "Geometric (doubling) series",
  exam_tip: "Check ratios between consecutive terms first — a constant ratio signals a geometric series.",
});

appendUnique(Q, generateLogical());

export async function seedLogical() {
  await seedSubjectQuestions("logical", Q);
}

if (require.main === module) {
  seedLogical().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
