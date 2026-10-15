import { supabase, assert } from "./lib";
import type { CompanyCategory, Difficulty, Subject } from "@/lib/types/database";

interface SectionSeed {
  topic_subject: Subject;
  section_name: string;
  weight_pct: number;
  typical_question_count: number;
  typical_time_minutes: number;
  notes?: string;
}

interface CompanySeed {
  name: string;
  slug: string;
  category: CompanyCategory;
  difficulty: Difficulty;
  assessment_type: string;
  recommended_prep_hours: number;
  overview: string;
  sections: SectionSeed[];
}

const C: CompanySeed[] = [];
function add(c: CompanySeed) {
  assert(
    Math.abs(c.sections.reduce((sum, s) => sum + s.weight_pct, 0) - 100) < 0.5,
    `${c.slug}: section weights must sum to ~100`,
  );
  C.push(c);
}

add({
  name: "Deloitte",
  slug: "deloitte",
  category: "consulting",
  difficulty: "medium",
  assessment_type: "Online Aptitude + Group Discussion + PI",
  recommended_prep_hours: 15,
  overview:
    "Deloitte's campus hiring process typically opens with an online aptitude round covering quant, reasoning, verbal, and data interpretation, followed by a group discussion and interview rounds.",
  sections: [
    { topic_subject: "quant", section_name: "Quantitative Aptitude", weight_pct: 35, typical_question_count: 18, typical_time_minutes: 20 },
    { topic_subject: "logical", section_name: "Logical Reasoning", weight_pct: 25, typical_question_count: 12, typical_time_minutes: 15 },
    { topic_subject: "verbal", section_name: "Verbal Ability", weight_pct: 25, typical_question_count: 12, typical_time_minutes: 15 },
    { topic_subject: "di", section_name: "Data Interpretation", weight_pct: 15, typical_question_count: 8, typical_time_minutes: 10 },
  ],
});

add({
  name: "Accenture",
  slug: "accenture",
  category: "consulting",
  difficulty: "medium",
  assessment_type: "Online Aptitude + Technical/HR Interview",
  recommended_prep_hours: 12,
  overview:
    "Accenture's campus hiring assessment leans heavily on logical reasoning alongside standard quant and verbal sections.",
  sections: [
    { topic_subject: "quant", section_name: "Quantitative Aptitude", weight_pct: 30, typical_question_count: 15, typical_time_minutes: 18 },
    { topic_subject: "logical", section_name: "Logical Reasoning", weight_pct: 30, typical_question_count: 15, typical_time_minutes: 18 },
    { topic_subject: "verbal", section_name: "Verbal Ability", weight_pct: 25, typical_question_count: 12, typical_time_minutes: 15 },
    { topic_subject: "di", section_name: "Data Interpretation", weight_pct: 15, typical_question_count: 8, typical_time_minutes: 10 },
  ],
});

add({
  name: "EY",
  slug: "ey",
  category: "consulting",
  difficulty: "medium",
  assessment_type: "Online Aptitude + Case Discussion + PI",
  recommended_prep_hours: 14,
  overview:
    "EY's campus assessment places a strong emphasis on verbal ability alongside quant and reasoning.",
  sections: [
    { topic_subject: "quant", section_name: "Quantitative Aptitude", weight_pct: 30, typical_question_count: 15, typical_time_minutes: 18 },
    { topic_subject: "logical", section_name: "Logical Reasoning", weight_pct: 25, typical_question_count: 12, typical_time_minutes: 15 },
    { topic_subject: "verbal", section_name: "Verbal Ability", weight_pct: 30, typical_question_count: 15, typical_time_minutes: 18 },
    { topic_subject: "di", section_name: "Data Interpretation", weight_pct: 15, typical_question_count: 8, typical_time_minutes: 10 },
  ],
});

add({
  name: "KPMG",
  slug: "kpmg",
  category: "consulting",
  difficulty: "medium",
  assessment_type: "Online Aptitude + PI",
  recommended_prep_hours: 12,
  overview: "KPMG's aptitude round covers quant, verbal, logical reasoning, and DI in a timed online test.",
  sections: [
    { topic_subject: "quant", section_name: "Quantitative Aptitude", weight_pct: 35, typical_question_count: 18, typical_time_minutes: 20 },
    { topic_subject: "logical", section_name: "Logical Reasoning", weight_pct: 20, typical_question_count: 10, typical_time_minutes: 12 },
    { topic_subject: "verbal", section_name: "Verbal Ability", weight_pct: 30, typical_question_count: 15, typical_time_minutes: 18 },
    { topic_subject: "di", section_name: "Data Interpretation", weight_pct: 15, typical_question_count: 8, typical_time_minutes: 10 },
  ],
});

add({
  name: "Goldman Sachs",
  slug: "goldman-sachs",
  category: "bfsi",
  difficulty: "hard",
  assessment_type: "Online Aptitude + Technical/Markets Interview",
  recommended_prep_hours: 20,
  overview:
    "Goldman Sachs' analyst hiring assessments are quant-heavy, with a strong emphasis on speed and accuracy under time pressure.",
  sections: [
    { topic_subject: "quant", section_name: "Quantitative Aptitude", weight_pct: 40, typical_question_count: 20, typical_time_minutes: 22 },
    { topic_subject: "logical", section_name: "Logical Reasoning", weight_pct: 20, typical_question_count: 10, typical_time_minutes: 12 },
    { topic_subject: "verbal", section_name: "Verbal Ability", weight_pct: 25, typical_question_count: 12, typical_time_minutes: 15 },
    { topic_subject: "di", section_name: "Data Interpretation", weight_pct: 15, typical_question_count: 8, typical_time_minutes: 10 },
  ],
});

add({
  name: "JPMorgan Chase",
  slug: "jpmorgan-chase",
  category: "bfsi",
  difficulty: "hard",
  assessment_type: "Online Aptitude + Superday Interviews",
  recommended_prep_hours: 18,
  overview:
    "JPMorgan Chase's campus recruiting process includes a timed quant/reasoning assessment ahead of superday interviews.",
  sections: [
    { topic_subject: "quant", section_name: "Quantitative Aptitude", weight_pct: 35, typical_question_count: 18, typical_time_minutes: 20 },
    { topic_subject: "logical", section_name: "Logical Reasoning", weight_pct: 25, typical_question_count: 12, typical_time_minutes: 15 },
    { topic_subject: "verbal", section_name: "Verbal Ability", weight_pct: 25, typical_question_count: 12, typical_time_minutes: 15 },
    { topic_subject: "di", section_name: "Data Interpretation", weight_pct: 15, typical_question_count: 8, typical_time_minutes: 10 },
  ],
});

add({
  name: "Hindustan Unilever",
  slug: "hindustan-unilever",
  category: "fmcg",
  difficulty: "hard",
  assessment_type: "Online Aptitude (Business Situation + Aptitude) + GD/PI",
  recommended_prep_hours: 16,
  overview:
    "HUL's campus hiring assessment (CBAT-style) blends business-situation judgement with core quant, verbal, and reasoning aptitude.",
  sections: [
    { topic_subject: "quant", section_name: "Quantitative Aptitude", weight_pct: 30, typical_question_count: 15, typical_time_minutes: 18 },
    { topic_subject: "logical", section_name: "Logical Reasoning", weight_pct: 25, typical_question_count: 12, typical_time_minutes: 15 },
    { topic_subject: "verbal", section_name: "Verbal Ability", weight_pct: 30, typical_question_count: 15, typical_time_minutes: 18 },
    { topic_subject: "di", section_name: "Data Interpretation", weight_pct: 15, typical_question_count: 8, typical_time_minutes: 10 },
  ],
});

add({
  name: "Amazon",
  slug: "amazon",
  category: "tech_ecommerce",
  difficulty: "medium",
  assessment_type: "Online Aptitude + Leadership Principles Interviews",
  recommended_prep_hours: 14,
  overview:
    "Amazon's campus hiring assessment covers quant and logical reasoning with a heavier reasoning weight, ahead of Leadership Principles interviews.",
  sections: [
    { topic_subject: "quant", section_name: "Quantitative Aptitude", weight_pct: 30, typical_question_count: 15, typical_time_minutes: 18 },
    { topic_subject: "logical", section_name: "Logical Reasoning", weight_pct: 35, typical_question_count: 18, typical_time_minutes: 20 },
    { topic_subject: "verbal", section_name: "Verbal Ability", weight_pct: 20, typical_question_count: 10, typical_time_minutes: 12 },
    { topic_subject: "di", section_name: "Data Interpretation", weight_pct: 15, typical_question_count: 8, typical_time_minutes: 10 },
  ],
});

const SECTION_NAMES: Record<Subject, string> = {
  quant: "Quantitative Aptitude",
  logical: "Logical Reasoning",
  verbal: "Verbal Ability",
  di: "Data Interpretation",
  numerical: "Numerical Ability",
  critical_reasoning: "Critical Reasoning",
};
const sec = (topic_subject: Subject, weight_pct: number, typical_question_count: number, typical_time_minutes: number): SectionSeed => ({
  topic_subject,
  section_name: SECTION_NAMES[topic_subject],
  weight_pct,
  typical_question_count,
  typical_time_minutes,
});

// ---- Consulting ----
add({
  name: "PwC",
  slug: "pwc",
  category: "consulting",
  difficulty: "medium",
  assessment_type: "Online Aptitude + Group Discussion + PI",
  recommended_prep_hours: 14,
  overview: "PwC's campus aptitude round is estimated to weigh quant and verbal ability most, with reasoning and DI making up the rest.",
  sections: [sec("quant", 30, 15, 18), sec("verbal", 30, 15, 18), sec("logical", 25, 12, 15), sec("di", 15, 8, 10)],
});
add({
  name: "ZS Associates",
  slug: "zs-associates",
  category: "consulting",
  difficulty: "hard",
  assessment_type: "Online Aptitude (quant, DI, reasoning) + Case Interviews",
  recommended_prep_hours: 18,
  overview: "ZS's online test is typically analytics-heavy — expect a large share of quant and data interpretation under tight time limits.",
  sections: [sec("quant", 35, 18, 20), sec("di", 30, 15, 18), sec("logical", 25, 12, 15), sec("verbal", 10, 5, 7)],
});

// ---- BFSI ----
add({
  name: "HDFC Bank",
  slug: "hdfc-bank",
  category: "bfsi",
  difficulty: "medium",
  assessment_type: "Online Aptitude + PI",
  recommended_prep_hours: 12,
  overview: "HDFC Bank's campus aptitude test is estimated to cover numerical ability and quant heavily, alongside reasoning and verbal sections.",
  sections: [sec("quant", 30, 15, 18), sec("numerical", 20, 10, 12), sec("logical", 25, 12, 15), sec("verbal", 25, 12, 15)],
});
add({
  name: "ICICI Bank",
  slug: "icici-bank",
  category: "bfsi",
  difficulty: "medium",
  assessment_type: "Online Aptitude + GD + PI",
  recommended_prep_hours: 12,
  overview: "ICICI Bank's campus assessment typically spans quant, data interpretation, reasoning, and English usage.",
  sections: [sec("quant", 30, 15, 18), sec("di", 20, 10, 12), sec("logical", 25, 12, 15), sec("verbal", 25, 12, 15)],
});
add({
  name: "Citi",
  slug: "citi",
  category: "bfsi",
  difficulty: "hard",
  assessment_type: "Online Aptitude + Technical/HR Interviews",
  recommended_prep_hours: 16,
  overview: "Citi's analyst-track aptitude test is estimated to be quant- and DI-heavy, with a numerical-reasoning component.",
  sections: [sec("quant", 35, 18, 20), sec("di", 20, 10, 12), sec("numerical", 15, 8, 10), sec("logical", 15, 8, 10), sec("verbal", 15, 8, 10)],
});
add({
  name: "American Express",
  slug: "american-express",
  category: "bfsi",
  difficulty: "medium",
  assessment_type: "Online Aptitude + Case/Behavioural Interviews",
  recommended_prep_hours: 14,
  overview: "American Express's campus aptitude round typically balances quant and reasoning with data interpretation and verbal ability.",
  sections: [sec("quant", 30, 15, 18), sec("logical", 30, 15, 18), sec("di", 20, 10, 12), sec("verbal", 20, 10, 12)],
});

// ---- FMCG ----
add({
  name: "ITC",
  slug: "itc",
  category: "fmcg",
  difficulty: "hard",
  assessment_type: "Online Aptitude + GD + PI",
  recommended_prep_hours: 15,
  overview: "ITC's campus aptitude test is estimated to blend quant, verbal, and reasoning in roughly equal measure, with some DI.",
  sections: [sec("quant", 30, 15, 18), sec("verbal", 30, 15, 18), sec("logical", 25, 12, 15), sec("di", 15, 8, 10)],
});
add({
  name: "Procter & Gamble",
  slug: "procter-and-gamble",
  category: "fmcg",
  difficulty: "hard",
  assessment_type: "Online Reasoning Assessment + Interviews",
  recommended_prep_hours: 16,
  overview: "P&G's assessment is typically reasoning-led — logical and numerical reasoning dominate, with lighter verbal coverage.",
  sections: [sec("logical", 35, 18, 20), sec("numerical", 25, 12, 15), sec("quant", 25, 12, 15), sec("verbal", 15, 8, 10)],
});
add({
  name: "Nestlé India",
  slug: "nestle-india",
  category: "fmcg",
  difficulty: "medium",
  assessment_type: "Online Aptitude + GD + PI",
  recommended_prep_hours: 12,
  overview: "Nestlé India's campus aptitude round is estimated to cover quant, verbal, reasoning, and basic data interpretation.",
  sections: [sec("quant", 30, 15, 18), sec("verbal", 25, 12, 15), sec("logical", 25, 12, 15), sec("di", 20, 10, 12)],
});
add({
  name: "Marico",
  slug: "marico",
  category: "fmcg",
  difficulty: "medium",
  assessment_type: "Online Aptitude + GD + PI",
  recommended_prep_hours: 10,
  overview: "Marico's campus aptitude test typically includes quant, logical reasoning, verbal ability, and short DI sets.",
  sections: [sec("quant", 30, 15, 18), sec("logical", 30, 15, 18), sec("verbal", 25, 12, 15), sec("di", 15, 8, 10)],
});
add({
  name: "Dabur",
  slug: "dabur",
  category: "fmcg",
  difficulty: "easy",
  assessment_type: "Online Aptitude + PI",
  recommended_prep_hours: 8,
  overview: "Dabur's campus aptitude round is estimated to be a standard mix of quant, reasoning, and verbal questions.",
  sections: [sec("quant", 35, 18, 20), sec("logical", 35, 18, 20), sec("verbal", 30, 15, 18)],
});

// ---- Tech / E-commerce ----
add({
  name: "Flipkart",
  slug: "flipkart",
  category: "tech_ecommerce",
  difficulty: "medium",
  assessment_type: "Online Aptitude + Case/Product Interviews",
  recommended_prep_hours: 14,
  overview: "Flipkart's campus aptitude test is typically reasoning- and DI-heavy, reflecting the analytical nature of its business roles.",
  sections: [sec("quant", 25, 12, 15), sec("logical", 30, 15, 18), sec("di", 30, 15, 18), sec("verbal", 15, 8, 10)],
});
add({
  name: "Microsoft",
  slug: "microsoft",
  category: "tech_ecommerce",
  difficulty: "hard",
  assessment_type: "Online Aptitude + Interviews",
  recommended_prep_hours: 16,
  overview: "Microsoft's business-role aptitude screen is estimated to emphasise logical reasoning and quant, with some numerical ability.",
  sections: [sec("logical", 35, 18, 20), sec("quant", 30, 15, 18), sec("numerical", 15, 8, 10), sec("verbal", 20, 10, 12)],
});
add({
  name: "Swiggy",
  slug: "swiggy",
  category: "tech_ecommerce",
  difficulty: "medium",
  assessment_type: "Online Aptitude + Case/Guesstimate Interviews",
  recommended_prep_hours: 12,
  overview: "Swiggy's campus aptitude round typically leans on DI and quant — the same skills its guesstimate-style interviews test.",
  sections: [sec("quant", 30, 15, 18), sec("di", 30, 15, 18), sec("logical", 25, 12, 15), sec("verbal", 15, 8, 10)],
});
add({
  name: "Zomato",
  slug: "zomato",
  category: "tech_ecommerce",
  difficulty: "medium",
  assessment_type: "Online Aptitude + Case Interviews",
  recommended_prep_hours: 12,
  overview: "Zomato's campus aptitude test is estimated to cover quant, DI, and reasoning, with a short verbal section.",
  sections: [sec("quant", 30, 15, 18), sec("di", 25, 12, 15), sec("logical", 30, 15, 18), sec("verbal", 15, 8, 10)],
});
add({
  name: "Paytm",
  slug: "paytm",
  category: "tech_ecommerce",
  difficulty: "medium",
  assessment_type: "Online Aptitude + Interviews",
  recommended_prep_hours: 10,
  overview: "Paytm's campus aptitude round typically mixes quant and numerical ability with logical reasoning and verbal ability.",
  sections: [sec("quant", 30, 15, 18), sec("numerical", 20, 10, 12), sec("logical", 30, 15, 18), sec("verbal", 20, 10, 12)],
});

export async function seedCompanies() {
  assert(C.length > 0, "no companies defined");
  const slugs = new Set<string>();
  for (const c of C) {
    assert(!slugs.has(c.slug), `duplicate slug ${c.slug}`);
    slugs.add(c.slug);
  }

  for (const c of C) {
    const { data: company, error } = await supabase
      .from("companies")
      .upsert(
        {
          name: c.name,
          slug: c.slug,
          category: c.category,
          difficulty: c.difficulty,
          assessment_type: c.assessment_type,
          num_sections: c.sections.length,
          recommended_prep_hours: c.recommended_prep_hours,
          overview: c.overview,
          is_seeded_estimate: true,
        },
        { onConflict: "slug" },
      )
      .select()
      .single();
    if (error) throw error;

    await supabase.from("company_sections").delete().eq("company_id", company.id);
    const { error: sectionsError } = await supabase.from("company_sections").insert(
      c.sections.map((s) => ({ ...s, company_id: company.id })),
    );
    if (sectionsError) throw sectionsError;
  }

  console.log(`Seeded ${C.length} companies.`);
}

if (require.main === module) {
  seedCompanies().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
