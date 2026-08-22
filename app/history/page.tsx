import Link from "next/link";
import { getAttemptHistory } from "@/lib/actions/history";

const MODE_LABELS: Record<string, string> = {
  quick: "Quick Test",
  sectional: "Sectional Test",
  company_mock: "Company Mock",
  full_assessment: "Full Assessment",
  topic_practice: "Practice",
};

export default async function HistoryPage() {
  const history = await getAttemptHistory();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Practice History</h1>
      <p className="mt-1 text-sm text-slate-500">Every completed practice session and test, most recent first.</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Test</th>
              <th className="px-4 py-3 text-right">Score</th>
              <th className="px-4 py-3 text-right">Accuracy</th>
              <th className="px-4 py-3 text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.attemptId} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-600">
                  {h.date ? new Date(h.date).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">{h.companyName ?? "—"}</td>
                <td className="px-4 py-3">
                  <Link href={`/test/${h.attemptId}/result`} className="font-medium text-slate-900 hover:underline">
                    {h.title || MODE_LABELS[h.mode] || h.mode}
                  </Link>
                </td>
                <td className="px-4 py-3 text-right text-slate-700">{h.score}/100</td>
                <td className="px-4 py-3 text-right text-slate-700">{h.accuracy}%</td>
                <td className="px-4 py-3 text-right text-slate-700">
                  {h.timeSpentSeconds !== null ? `${Math.round(h.timeSpentSeconds / 60)} min` : "—"}
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                  No completed sessions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
