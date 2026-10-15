"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import TestFlow, { type CompanyWithSections } from "@/components/TestFlow";

export default function TestStartClient() {
  const searchParams = useSearchParams();
  const companySlug = searchParams.get("company") ?? undefined;
  const mode = searchParams.get("mode") ?? undefined;

  const [companies, setCompanies] = useState<CompanyWithSections[] | null>(null);

  useEffect(() => {
    supabase
      .from("companies")
      .select("id, name, slug, category, difficulty, company_sections(topic_subject, section_name, weight_pct, typical_question_count, typical_time_minutes)")
      .order("name")
      .then(({ data }) => setCompanies((data ?? []) as unknown as CompanyWithSections[]));
  }, []);

  // Wait for companies to load before mounting TestFlow — it captures
  // initialCompanyId in useState on first render, so mounting it against an
  // empty list would permanently lose the ?company= preselection.
  if (companies === null) return <p className="mt-6 text-sm text-slate-400">Loading…</p>;

  const initialCompanyId = companySlug ? companies.find((c) => c.slug === companySlug)?.id : undefined;

  return <TestFlow companies={companies} initialCompanyId={initialCompanyId} initialMode={mode} />;
}
