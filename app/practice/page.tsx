import { createClient } from "@/lib/supabase/server";
import { getMistakes } from "@/lib/actions/mistakes";
import PracticeRunner from "@/components/PracticeRunner";
import { SUBJECT_LABELS } from "@/lib/constants";
import type { Difficulty, Subject } from "@/lib/types/database";

const SUBJECTS = (Object.keys(SUBJECT_LABELS) as Subject[]).map((value) => ({ value, label: SUBJECT_LABELS[value] }));

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string; subject?: string; difficulty?: string; mistakes?: string }>;
}) {
  const { company: companySlug, subject, difficulty, mistakes } = await searchParams;
  const supabase = await createClient();

  const { data: companies } = await supabase.from("companies").select("id, name, slug").order("name");

  let initialCompanyId: string | undefined;
  if (companySlug) {
    initialCompanyId = companies?.find((c) => c.slug === companySlug)?.id;
  }

  let fixedQuestionIds: string[] | undefined;
  if (mistakes === "1") {
    const mistakeList = await getMistakes({
      subject: subject as Subject | undefined,
      difficulty: difficulty as Difficulty | undefined,
      companyId: initialCompanyId,
    });
    fixedQuestionIds = mistakeList.map((m) => m.id);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">{mistakes === "1" ? "Practice My Mistakes" : "Practice"}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {mistakes === "1"
          ? "A session built entirely from questions you've previously gotten wrong."
          : "Untimed practice with instant explanations. Filter by topic, difficulty, or company."}
      </p>

      <PracticeRunner
        subjects={SUBJECTS}
        companies={companies ?? []}
        initialCompanyId={initialCompanyId}
        initialSubject={subject}
        initialDifficulty={difficulty}
        fixedQuestionIds={fixedQuestionIds}
      />
    </div>
  );
}
