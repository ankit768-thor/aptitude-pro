import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  const { data: targetCompanies } = await supabase
    .from("user_target_companies")
    .select("companies(id, name, slug)")
    .eq("user_id", user.id);

  const stats = topicStatsRaw ?? [];
  const questionsAttempted = stats.reduce((sum, s) => sum + s.questions_attempted, 0);
  const questionsCorrect = stats.reduce((sum, s) => sum + s.questions_correct, 0);
  const accuracy = questionsAttempted > 0 ? Math.round((questionsCorrect / questionsAttempted) * 100) : 0;
  const avgTime = stats.length > 0 ? Math.round(stats.reduce((sum, s) => sum + s.avg_time_seconds, 0) / stats.length) : 0;

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

      <h2 className="mt-8 text-lg font-semibold text-slate-900">Your target companies</h2>
      <div className="mt-3 flex flex-col gap-2">
        {(targetCompanies ?? []).map((row) => {
          const company = (row as unknown as { companies: { id: string; name: string; slug: string } }).companies;
          if (!company) return null;
          return (
            <Link
              key={company.id}
              href={`/companies/${company.slug}`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              {company.name}
            </Link>
          );
        })}
        {(!targetCompanies || targetCompanies.length === 0) && (
          <p className="text-sm text-slate-400">
            No target companies yet.{" "}
            <Link href="/companies" className="text-slate-900 underline">
              Browse companies
            </Link>
          </p>
        )}
      </div>

      <div className="mt-6">
        <Link
          href="/test/start"
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Take a test
        </Link>
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
