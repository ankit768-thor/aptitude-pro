import { supabase, assert } from "./lib";
import type { Subject } from "@/lib/types/database";

interface TopicSeed {
  subject: Subject;
  question_type: string;
  name: string;
}

const T: TopicSeed[] = [];
function add(t: TopicSeed) {
  T.push(t);
}

// Quant
add({ subject: "quant", question_type: "Percentages", name: "Percentages" });
add({ subject: "quant", question_type: "Profit & Loss", name: "Profit & Loss" });
add({ subject: "quant", question_type: "Ratio", name: "Ratio & Proportion" });
add({ subject: "quant", question_type: "Averages", name: "Averages" });
add({ subject: "quant", question_type: "Time & Work", name: "Time & Work" });
add({ subject: "quant", question_type: "Time-Speed-Distance", name: "Time, Speed & Distance" });
add({ subject: "quant", question_type: "Probability", name: "Probability" });
add({ subject: "quant", question_type: "Permutation & Combination", name: "Permutation & Combination" });
add({ subject: "quant", question_type: "Number System", name: "Number System" });
add({ subject: "quant", question_type: "Simple & Compound Interest", name: "Simple & Compound Interest" });

// Verbal
add({ subject: "verbal", question_type: "Reading Comprehension", name: "Reading Comprehension" });
add({ subject: "verbal", question_type: "Grammar", name: "Grammar" });
add({ subject: "verbal", question_type: "Vocabulary", name: "Vocabulary" });
add({ subject: "verbal", question_type: "Para-jumbles", name: "Para-jumbles" });

// Logical
add({ subject: "logical", question_type: "Puzzles", name: "Puzzles" });
add({ subject: "logical", question_type: "Seating Arrangement", name: "Seating Arrangement" });
add({ subject: "logical", question_type: "Coding-Decoding", name: "Coding-Decoding" });
add({ subject: "logical", question_type: "Syllogisms", name: "Syllogisms" });
add({ subject: "logical", question_type: "Blood Relations", name: "Blood Relations" });
add({ subject: "logical", question_type: "Series", name: "Series" });

// Data Interpretation
add({ subject: "di", question_type: "Tables", name: "DI — Tables" });
add({ subject: "di", question_type: "Bar & Line Charts", name: "DI — Bar & Line Charts" });
add({ subject: "di", question_type: "Pie Charts", name: "DI — Pie Charts" });
add({ subject: "di", question_type: "Caselets", name: "DI — Caselets" });

// Numerical
add({ subject: "numerical", question_type: "Number Series", name: "Number Series" });
add({ subject: "numerical", question_type: "Data Sufficiency", name: "Data Sufficiency" });

// Critical Reasoning
add({ subject: "critical_reasoning", question_type: "Critical Reasoning", name: "Critical Reasoning" });
add({ subject: "critical_reasoning", question_type: "Statement & Assumption", name: "Statement & Assumption" });

export async function seedTopics() {
  assert(T.length > 0, "no topics defined");
  const seen = new Set<string>();
  for (const t of T) {
    const key = `${t.subject}::${t.question_type}::${t.name}`;
    assert(!seen.has(key), `duplicate topic ${key}`);
    seen.add(key);
  }

  const { error } = await supabase
    .from("topics")
    .upsert(T, { onConflict: "subject,question_type,name", ignoreDuplicates: false });
  if (error) throw error;

  console.log(`Seeded ${T.length} topics.`);
}

if (require.main === module) {
  seedTopics().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
