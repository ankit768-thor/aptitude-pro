"use client";

import { useState } from "react";
import { getHistory, type HistoryEntry } from "@/lib/history";
import { analyzeHistory } from "@/lib/historyAnalysis";
import { SUBJECT_LABELS } from "@/lib/constants";

const TREND_LABEL: Record<string, string> = {
  improving: "📈 Improving",
  declining: "📉 Declining",
  steady: "➖ Steady",
};

export default function HistoryPage() {
  const [history] = useState<HistoryEntry[]>(() => getHistory());
  const analysis = analyzeHistory(history);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Test History</h1>
      <p className="mt-1 text-sm text-slate-500">
        Every completed test on this device, most recent first. Saved in your browser only.
      </p>

      {analysis.testsTaken > 0 && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-900">Your analysis</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Tests taken" value={String(analysis.testsTaken)} />
            <Stat label="Avg. score" value={`${analysis.avgScore}/100`} />
            <Stat label="Avg. accuracy" value={`${analysis.avgAccuracy}%`} />
            <Stat label="Trend" value={analysis.trend ? TREND_LABEL[analysis.trend] : "Not enough data yet"} />
          </div>

          {analysis.bySubject.length > 0 && (
            <>
              <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-400">Accuracy by domain</p>
              <div className="mt-2 flex flex-col gap-1.5">
                {analysis.bySubject.map((s) => (
                  <div key={s.subject} className="flex items-center gap-3 text-sm">
                    <span className="w-40 shrink-0 text-slate-700">{SUBJECT_LABELS[s.subject]}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${s.accuracy >= 70 ? "bg-emerald-500" : s.accuracy >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${s.accuracy}%` }}
                      />
                    </div>
                    <span className="w-16 shrink-0 text-right text-slate-500">
                      {s.accuracy}% ({s.correct}/{s.total})
                    </span>
                  </div>
                ))}
              </div>
              {analysis.weakest && (
                <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  Weakest area: <span className="font-medium">{SUBJECT_LABELS[analysis.weakest.subject]}</span> at{" "}
                  {analysis.weakest.accuracy}% accuracy — worth a Quick Test or Numbered Test there next.
                </p>
              )}
            </>
          )}
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Test</th>
              <th className="px-4 py-3 text-right">Score</th>
              <th className="px-4 py-3 text-right">Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-600">
                  {new Date(h.date).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                </td>
                <td className="px-4 py-3 text-slate-600">{h.companyName ?? "—"}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{h.title}</td>
                <td className="px-4 py-3 text-right text-slate-700">{h.score}/100</td>
                <td className="px-4 py-3 text-right text-slate-700">{h.accuracy}%</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                  No completed tests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
