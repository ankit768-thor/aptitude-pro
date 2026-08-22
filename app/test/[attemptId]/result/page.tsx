import Link from "next/link";
import { notFound } from "next/navigation";
import { getResult } from "@/lib/actions/test";
import { SUBJECT_LABELS } from "@/lib/constants";

export default async function TestResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;

  let result;
  try {
    result = await getResult(attemptId);
  } catch {
    notFound();
  }

  const { score, title } = result;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Your Result</p>
      <h1 className="mt-1 text-2xl font-semibold text-slate-900">{title}</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-center">
        <p className="text-sm text-slate-500">Score</p>
        <p className="mt-1 text-4xl font-semibold text-slate-900">{score.score}/100</p>
        <p className="mt-1 text-sm text-slate-500">{score.accuracy}% accuracy</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Correct" value={String(score.correct)} tone="emerald" />
        <Stat label="Incorrect" value={String(score.incorrect)} tone="red" />
        <Stat label="Skipped" value={String(score.skipped)} tone="slate" />
        <Stat label="Avg time/question" value={`${score.avgTimeSeconds}s`} tone="slate" />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-slate-900">Section Performance</h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3 text-right">Accuracy</th>
              <th className="px-4 py-3 text-right">Correct</th>
              <th className="px-4 py-3 text-right">Avg Time</th>
            </tr>
          </thead>
          <tbody>
            {score.sectionPerformance.map((s) => (
              <tr key={s.subject} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-slate-900">{SUBJECT_LABELS[s.subject]}</td>
                <td className="px-4 py-3 text-right text-slate-700">{s.accuracy}%</td>
                <td className="px-4 py-3 text-right text-slate-700">
                  {s.correct}/{s.total}
                </td>
                <td className="px-4 py-3 text-right text-slate-700">{s.avgTimeSeconds}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/test/start"
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Take another test
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "emerald" | "red" | "slate" }) {
  const toneClass = tone === "emerald" ? "text-emerald-700" : tone === "red" ? "text-red-700" : "text-slate-900";
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`mt-0.5 text-lg font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}
