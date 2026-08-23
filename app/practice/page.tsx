import { supabase } from "@/lib/supabase/client";
import PracticeRunner from "@/components/PracticeRunner";
import { SUBJECT_LABELS } from "@/lib/constants";
import type { Subject } from "@/lib/types/database";

const SUBJECTS = (Object.keys(SUBJECT_LABELS) as Subject[]).map((value) => ({ value, label: SUBJECT_LABELS[value] }));

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string; subject?: string; difficulty?: string }>;
}) {
  const { company: companySlug, subject, difficulty } = await searchParams;

  const { data: companies } = await supabase.from("companies").select("id, name, slug").order("name");

  let initialCompanyId: string | undefined;
  if (companySlug) {
    initialCompanyId = companies?.find((c) => c.slug === companySlug)?.id;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Practice</h1>
      <p className="mt-1 text-sm text-slate-500">
        Untimed practice with instant explanations. Filter by topic, difficulty, or company.
      </p>

      <PracticeRunner
        subjects={SUBJECTS}
        companies={companies ?? []}
        initialCompanyId={initialCompanyId}
        initialSubject={subject}
        initialDifficulty={difficulty}
      />
    </div>
  );
}
