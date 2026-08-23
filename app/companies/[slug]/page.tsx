import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { SUBJECT_LABELS } from "@/lib/constants";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!company) notFound();

  const { data: sections } = await supabase
    .from("company_sections")
    .select("*")
    .eq("company_id", company.id)
    .order("weight_pct", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {company.category.replace("_", " ")}
      </p>
      <h1 className="mt-1 text-2xl font-semibold text-slate-900">{company.name} Placement Test</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{company.overview}</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Difficulty" value={company.difficulty} />
        <Stat label="Assessment type" value={company.assessment_type} />
        <Stat label="Sections" value={String(company.num_sections)} />
        <Stat label="Recommended prep" value={`${company.recommended_prep_hours}h`} />
      </div>

      {company.is_seeded_estimate && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span className="font-medium">Company-style practice.</span> This pattern is an
          editorial estimate based on public information, not a verified or sourced past paper.
        </div>
      )}

      <h2 className="mt-8 text-lg font-semibold text-slate-900">Assessment Areas</h2>
      <div className="mt-3 flex flex-col gap-2">
        {(sections ?? []).map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-slate-900">
                {SUBJECT_LABELS[s.topic_subject] ?? s.topic_subject}
              </p>
              {s.notes && <p className="mt-0.5 text-xs text-slate-500">{s.notes}</p>}
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>{s.typical_question_count} questions · {s.typical_time_minutes} min</p>
              <p className="mt-0.5">{s.weight_pct}% weight</p>
            </div>
          </div>
        ))}
        {(!sections || sections.length === 0) && (
          <p className="text-sm text-slate-400">No sections seeded for this company yet.</p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/practice?company=${company.slug}`}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Practice these topics
        </Link>
        <Link
          href={`/test/start?company=${company.slug}&mode=company_mock`}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Take timed mock
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium capitalize text-slate-900">{value}</p>
    </div>
  );
}
