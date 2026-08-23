"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import PracticeRunner from "@/components/PracticeRunner";
import { SUBJECT_LABELS } from "@/lib/constants";
import type { Subject } from "@/lib/types/database";

const SUBJECTS = (Object.keys(SUBJECT_LABELS) as Subject[]).map((value) => ({ value, label: SUBJECT_LABELS[value] }));

export default function PracticeClient() {
  const searchParams = useSearchParams();
  const companySlug = searchParams.get("company") ?? undefined;
  const subject = searchParams.get("subject") ?? undefined;
  const difficulty = searchParams.get("difficulty") ?? undefined;

  const [companies, setCompanies] = useState<{ id: string; name: string; slug: string }[] | null>(null);

  useEffect(() => {
    supabase
      .from("companies")
      .select("id, name, slug")
      .order("name")
      .then(({ data }) => setCompanies(data ?? []));
  }, []);

  // Wait for companies to load before mounting PracticeRunner — it captures
  // initialCompanyId in useState on first render, so mounting it against an
  // empty list would permanently lose the ?company= preselection.
  if (companies === null) return <p className="mt-6 text-sm text-slate-400">Loading…</p>;

  const initialCompanyId = companySlug ? companies.find((c) => c.slug === companySlug)?.id : undefined;

  return (
    <PracticeRunner
      subjects={SUBJECTS}
      companies={companies}
      initialCompanyId={initialCompanyId}
      initialSubject={subject}
      initialDifficulty={difficulty}
    />
  );
}
