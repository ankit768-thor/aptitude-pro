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
    "Deloitte's placement process for MBA hires typically opens with an online aptitude round covering quant, reasoning, verbal, and data interpretation, followed by a group discussion and interview rounds.",
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
    "Accenture's MBA hiring assessment leans heavily on logical reasoning alongside standard quant and verbal sections.",
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
    "EY's assessment for MBA candidates places a strong emphasis on verbal ability alongside quant and reasoning.",
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
    "Goldman Sachs' assessments for MBA/analyst hiring are quant-heavy, with a strong emphasis on speed and accuracy under time pressure.",
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
    "JPMorgan Chase's MBA recruiting process includes a timed quant/reasoning assessment ahead of superday interviews.",
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
    "HUL's MBA hiring assessment (CBAT-style) blends business-situation judgement with core quant, verbal, and reasoning aptitude.",
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
    "Amazon's MBA-hire assessment covers quant and logical reasoning with a heavier reasoning weight, ahead of Leadership Principles interviews.",
  sections: [
    { topic_subject: "quant", section_name: "Quantitative Aptitude", weight_pct: 30, typical_question_count: 15, typical_time_minutes: 18 },
    { topic_subject: "logical", section_name: "Logical Reasoning", weight_pct: 35, typical_question_count: 18, typical_time_minutes: 20 },
    { topic_subject: "verbal", section_name: "Verbal Ability", weight_pct: 20, typical_question_count: 10, typical_time_minutes: 12 },
    { topic_subject: "di", section_name: "Data Interpretation", weight_pct: 15, typical_question_count: 8, typical_time_minutes: 10 },
  ],
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
