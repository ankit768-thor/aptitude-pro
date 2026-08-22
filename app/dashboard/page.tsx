import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getReadinessDashboard } from "@/lib/actions/readiness";
import { SUBJECT_LABELS } from "@/lib/constants";
import type { ReadinessBadge } from "@/lib/algorithms/readiness";

const BADGE_STYLE: Record<ReadinessBadge, { label: string; dot: string; box: string }> = {
  good: { label: "🟢 Good", dot: "bg-emerald-500", box: "border-emerald-200 bg-emerald-50" },
  needs_work: { label: "🟡 Needs Work", dot: "bg-amber-500", box: "border-amber-200 bg-amber-50" },
  at_risk: { label: "🔴 At Risk", dot: "bg-red-500", box: "border-red-200 bg-red-50" },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile?.onboarding_completed) redirect("/onboarding");

  const { data: topicStatsRaw } = await supabase
    .from("user_topic_stats")
    .select("questions_attempted, questions_correct, avg_time_seconds")
    .eq("user_id", user.id);

  const { count: attemptsCompleted } = await supabase
    .from("attempts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "completed");

  const stats = topicStatsRaw ?? [];
  const questionsAttempted = stats.reduce((sum, s) => sum + s.questions_attempted, 0);
  const questionsCorrect = stats.reduce((sum, s) => sum + s.questions_correct, 0);
  const accuracy = questionsAttempted > 0 ? Math.round((questionsCorrect / questionsAttempted) * 100) : 0;
  const avgTime = stats.length > 0 ? Math.round(stats.reduce((sum, s) => sum + s.avg_time_seconds, 0) / stats.length) : 0;

  const { readiness, weakAreas, recommendations, companies } = await getReadinessDashboard();
  const badge = BADGE_STYLE[readiness.badge];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Hi, {profile.full_name || "there"}</h1>
      <p className="mt-1 text-sm text-slate-500">Your placement preparation</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Questions attempted" value={String(questionsAttempted)} />
        <StatCard label="Accuracy" value={`${accuracy}%`} />
        <StatCard label="Avg solving time" value={`${avgTime}s`} />
        <StatCard label="Tests completed" value={String(attemptsCompleted ?? 0)} />
      </div>

      <div className={`mt-6 rounded-xl border p-5 ${badge.box}`}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-900">Placement Readiness</p>
          <span className="text-sm font-semibold">{badge.label}</span>
        </div>
        <p className="mt-1 text-3xl font-semibold text-slate-900">{readiness.score}/100</p>
        <p className="mt-2 text-sm text-slate-600">{readiness.statement}</p>
      </div>

      {weakAreas.length > 0 && (
        <>
          <h2 className="mt-8 text-lg font-semibold text-slate-900">Your Weak Areas</h2>
          <div className="mt-3 flex flex-col gap-2">
            {weakAreas.map((w) => (
              <div
                key={w.topicId}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{w.topicName}</p>
                  <p className="text-xs text-slate-500">
                    {w.neverAttempted ? "Not yet attempted" : `${w.accuracyPct}% accuracy · ${w.questionsAttempted} attempted`}
                  </p>
                </div>
                <Link
                  href={`/practice?subject=${w.subject}`}
                  className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                >
                  Practice
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {recommendations.length > 0 && (
        <>
          <h2 className="mt-8 text-lg font-semibold text-slate-900">Recommended Next</h2>
          <p className="mt-1 text-sm text-slate-500">Based on your recent performance.</p>
          <div className="mt-3 flex flex-col gap-2">
            {recommendations.map((r, i) => (
              <Link
                key={i}
                href={r.href}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 hover:bg-slate-50"
              >
                {r.text}
              </Link>
            ))}
          </div>
        </>
      )}

      <h2 className="mt-8 text-lg font-semibold text-slate-900">Your target companies</h2>
      <div className="mt-3 flex flex-col gap-2">
        {companies.map((c) => (
          <Link
            key={c.id}
            href={`/companies/${c.slug}`}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-800">{c.name}</p>
              <p className="text-sm font-semibold text-slate-900">{c.overallPct}%</p>
            </div>
            {c.sections.length > 0 && (
              <p className="mt-1 text-xs text-slate-500">
                {c.sections.map((s) => `${SUBJECT_LABELS[s.subject]} ${s.accuracyPct}%`).join(" · ")}
              </p>
            )}
          </Link>
        ))}
        {companies.length === 0 && (
          <p className="text-sm text-slate-400">
            No target companies yet.{" "}
            <Link href="/companies" className="text-slate-900 underline">
              Browse companies
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
