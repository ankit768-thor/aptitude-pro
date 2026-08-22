import { seedSubjectQuestions, opts, type QuestionSeed } from "./lib";

const Q: QuestionSeed[] = [];
function add(q: QuestionSeed) {
  Q.push(q);
}

// ==== Tables — City-wise quarterly sales (₹ lakh) ====
const TABLE_DATA =
  "The table below shows quarterly sales (in ₹ lakh) for three cities in 2023:\n\n" +
  "City       Q1    Q2    Q3    Q4\n" +
  "Mumbai     120   150   130   160\n" +
  "Delhi      100   110   140   150\n" +
  "Bengaluru   90   130   120   140";

add({
  question_type: "Tables",
  question_text: `${TABLE_DATA}\n\nQuestion: What is Mumbai's total sales for the year?`,
  options: opts("560", "540", "580", "600"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Mumbai's total = 120+150+130+160 = 560.",
  concept: "Table-based total calculation",
  exam_tip: "For 'total' questions, add straight down the row — no need to compute other rows first.",
});
add({
  question_type: "Tables",
  question_text: `${TABLE_DATA}\n\nQuestion: Which city had the highest sales in Q3?`,
  options: opts("Mumbai", "Delhi", "Bengaluru", "Cannot be determined"),
  correct_option_key: "B",
  difficulty: "easy",
  explanation: "Q3 sales: Mumbai=130, Delhi=140, Bengaluru=120. Delhi is highest.",
  concept: "Table-based comparison across a single column",
  exam_tip: "For 'which is highest in [period]' questions, scan only that one column, not the whole table.",
});
add({
  question_type: "Tables",
  question_text: `${TABLE_DATA}\n\nQuestion: What is the percentage increase in Mumbai's sales from Q1 to Q4?`,
  options: opts("33.33%", "25%", "40%", "20%"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Increase = 160−120 = 40. Percentage increase = 40/120 × 100 = 33.33%.",
  concept: "Percentage change from table values",
  exam_tip: "Percentage change is always (change ÷ original value) × 100 — using the wrong base is the most common DI mistake.",
});
add({
  question_type: "Tables",
  question_text: `${TABLE_DATA}\n\nQuestion: What is the combined Q2 sales of all three cities?`,
  options: opts("390", "400", "380", "410"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Q2 total = 150 (Mumbai) + 110 (Delhi) + 130 (Bengaluru) = 390.",
  concept: "Table-based column sum",
  exam_tip: "Add across a single column (not down a row) for 'combined' questions about one time period.",
});
add({
  question_type: "Tables",
  question_text: `${TABLE_DATA}\n\nQuestion: What is Delhi's average quarterly sales for the year?`,
  options: opts("125", "120", "130", "110"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Delhi's total = 100+110+140+150 = 500. Average = 500/4 = 125.",
  concept: "Average from table values",
  exam_tip: "Average = total ÷ number of periods — compute the total first to avoid arithmetic slips.",
});
add({
  question_type: "Tables",
  question_text: `${TABLE_DATA}\n\nQuestion: What is the difference between the total annual sales of Mumbai and Bengaluru?`,
  options: opts("80", "90", "70", "100"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Mumbai total = 560. Bengaluru total = 90+130+120+140 = 480. Difference = 560−480 = 80.",
  concept: "Difference of table row totals",
  exam_tip: "Compute both totals fully before subtracting — partial subtraction quarter by quarter is error-prone.",
});
add({
  question_type: "Tables",
  question_text: `${TABLE_DATA}\n\nQuestion: In which quarter did Bengaluru record its lowest sales?`,
  options: opts("Q1", "Q2", "Q3", "Q4"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Bengaluru's sales: Q1=90, Q2=130, Q3=120, Q4=140. The lowest is Q1 at 90.",
  concept: "Table-based minimum identification",
  exam_tip: "Scan just the one row asked about — don't waste time cross-checking other cities.",
});

// ==== Bar & Line Charts — Monthly rainfall ====
const RAINFALL_DATA =
  "The line chart below shows monthly rainfall (in mm) for a city:\n\n" +
  "Month     Rainfall (mm)\n" +
  "January        20\n" +
  "February       35\n" +
  "March          50\n" +
  "April          45";

add({
  question_type: "Bar & Line Charts",
  question_text: `${RAINFALL_DATA}\n\nQuestion: In which month was rainfall highest?`,
  options: opts("January", "February", "March", "April"),
  correct_option_key: "C",
  difficulty: "easy",
  explanation: "March recorded 50mm, the highest value among the four months.",
  concept: "Chart-based maximum identification",
  exam_tip: "On a line/bar chart, the highest point or tallest bar directly answers 'which is highest' questions.",
});
add({
  question_type: "Bar & Line Charts",
  question_text: `${RAINFALL_DATA}\n\nQuestion: What is the total rainfall over the four months?`,
  options: opts("150", "140", "160", "130"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Total = 20+35+50+45 = 150mm.",
  concept: "Chart-based total calculation",
  exam_tip: "Add all values first before answering any percentage or ratio question based on the same chart.",
});
add({
  question_type: "Bar & Line Charts",
  question_text: `${RAINFALL_DATA}\n\nQuestion: What percentage of the total rainfall fell in February?`,
  options: opts("23.33%", "20%", "25%", "30%"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Total rainfall = 150mm. February's share = 35/150 × 100 = 23.33%.",
  concept: "Percentage share from chart data",
  exam_tip: "Percentage share = (part ÷ whole) × 100 — recompute the whole (total) if it wasn't given directly.",
});
add({
  question_type: "Bar & Line Charts",
  question_text: `${RAINFALL_DATA}\n\nQuestion: By how much did rainfall increase from January to March?`,
  options: opts("30mm", "25mm", "35mm", "20mm"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Increase = 50 (March) − 20 (January) = 30mm.",
  concept: "Absolute change from chart data",
  exam_tip: "'By how much' asks for an absolute difference, not a percentage — don't over-complicate the calculation.",
});

// ==== Pie Charts — Household budget ====
const BUDGET_DATA =
  "The pie chart below shows how a household's monthly income of ₹50,000 is allocated:\n\n" +
  "Category      Share\n" +
  "Food           30%\n" +
  "Rent           25%\n" +
  "Transport      15%\n" +
  "Savings        20%\n" +
  "Other          10%";

add({
  question_type: "Pie Charts",
  question_text: `${BUDGET_DATA}\n\nQuestion: How much is spent on Rent?`,
  options: opts("₹12,500", "₹10,000", "₹15,000", "₹11,000"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Rent = 25% of ₹50,000 = ₹12,500.",
  concept: "Pie chart percentage-to-value conversion",
  exam_tip: "Multiply the percentage (as a decimal) directly by the total to get the category's absolute value.",
});
add({
  question_type: "Pie Charts",
  question_text: `${BUDGET_DATA}\n\nQuestion: How much more is spent on Food than on Transport?`,
  options: opts("₹7,500", "₹6,000", "₹9,000", "₹5,000"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Food = 30% of 50,000 = ₹15,000. Transport = 15% of 50,000 = ₹7,500. Difference = ₹15,000 − ₹7,500 = ₹7,500.",
  concept: "Pie chart difference between two categories",
  exam_tip: "You can subtract the percentages first (30%−15%=15%) and apply that to the total in one step, instead of computing both values separately.",
});
add({
  question_type: "Pie Charts",
  question_text: `${BUDGET_DATA}\n\nQuestion: What amount is saved each month?`,
  options: opts("₹10,000", "₹12,000", "₹8,000", "₹9,000"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Savings = 20% of ₹50,000 = ₹10,000.",
  concept: "Pie chart percentage-to-value conversion",
  exam_tip: "20% of a number is simply that number divided by 5 — a fast mental-math shortcut.",
});
add({
  question_type: "Pie Charts",
  question_text: `${BUDGET_DATA}\n\nQuestion: What is the ratio of Food spending to Savings?`,
  options: opts("3:2", "2:3", "5:3", "3:5"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Food is 30% and Savings is 20% of the same total, so the ratio is 30:20 = 3:2.",
  concept: "Ratio between two pie-chart categories",
  exam_tip: "When comparing two slices of the same pie, you can use the percentages directly as a ratio — no need to convert to rupees.",
});

// ==== Caselets ====
const CASELET_DATA =
  "A company has three departments — Sales, Marketing, and Operations — with 40, 25, and 35 employees " +
  "respectively. The average salary is ₹45,000 in Sales, ₹50,000 in Marketing, and ₹40,000 in Operations.";

add({
  question_type: "Caselets",
  question_text: `${CASELET_DATA}\n\nQuestion: What is the total number of employees in the company?`,
  options: opts("100", "90", "110", "95"),
  correct_option_key: "A",
  difficulty: "easy",
  explanation: "Total employees = 40+25+35 = 100.",
  concept: "Caselet — direct total",
  exam_tip: "Extract the raw numbers from the narrative first, ignoring the salary figures until they're needed.",
});
add({
  question_type: "Caselets",
  question_text: `${CASELET_DATA}\n\nQuestion: What is the total monthly salary bill of the Sales department?`,
  options: opts("₹18,00,000", "₹15,00,000", "₹20,00,000", "₹17,00,000"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Sales salary bill = 40 employees × ₹45,000 = ₹18,00,000.",
  concept: "Caselet — department total from average and headcount",
  exam_tip: "Total = average × count is the core relationship for every caselet involving 'average salary/marks/score'.",
});
add({
  question_type: "Caselets",
  question_text: `${CASELET_DATA}\n\nQuestion: What is the company's overall average monthly salary across all three departments?`,
  options: opts("₹44,500", "₹45,000", "₹43,000", "₹46,000"),
  correct_option_key: "A",
  difficulty: "hard",
  explanation:
    "Total salary bill = (40×45,000) + (25×50,000) + (35×40,000) = 18,00,000 + 12,50,000 + 14,00,000 = 44,50,000. " +
    "Overall average = 44,50,000 / 100 = ₹44,500.",
  concept: "Caselet — weighted average across groups",
  exam_tip: "Never average the three department averages directly (45,000+50,000+40,000)/3 — group sizes differ, so it must be a weighted average.",
});
add({
  question_type: "Caselets",
  question_text: `${CASELET_DATA}\n\nQuestion: Which department has the highest total salary bill?`,
  options: opts("Sales", "Marketing", "Operations", "Cannot be determined"),
  correct_option_key: "A",
  difficulty: "medium",
  explanation: "Sales = ₹18,00,000, Marketing = 25×50,000 = ₹12,50,000, Operations = 35×40,000 = ₹14,00,000. Sales is highest.",
  concept: "Caselet — comparing computed totals, not raw averages",
  exam_tip: "The department with the highest average salary isn't necessarily the one with the highest total bill — always compute totals before comparing.",
});

export async function seedDi() {
  await seedSubjectQuestions("di", Q);
}

if (require.main === module) {
  seedDi().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
