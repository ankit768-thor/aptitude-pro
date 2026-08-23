import { supabase } from "@/lib/supabase/client";
import TestFlow, { type CompanyWithSections } from "@/components/TestFlow";

export default async function TestStartPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string; mode?: string }>;
}) {
  const { company: companySlug, mode } = await searchParams;

  const { data: companiesRaw } = await supabase
    .from("companies")
    .select("id, name, slug, difficulty, company_sections(topic_subject, section_name, weight_pct, typical_question_count, typical_time_minutes)")
    .order("name");

  // Relation embedding (company_sections(...)) isn't represented in our
  // hand-written Database type's Relationships metadata, so cast once here.
  const companies = (companiesRaw ?? []) as unknown as CompanyWithSections[];
  const initialCompanyId = companySlug ? companies.find((c) => c.slug === companySlug)?.id : undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Start a Timed Test</h1>
      <p className="mt-1 text-sm text-slate-500">
        Pick a mode and, optionally, a target company to match its assessment pattern.
      </p>
      <TestFlow companies={companies} initialCompanyId={initialCompanyId} initialMode={mode} />
    </div>
  );
}
