"use client";

import { useState } from "react";
import { getHistory, type HistoryEntry } from "@/lib/history";

export default function HistoryPage() {
  const [history] = useState<HistoryEntry[]>(() => getHistory());

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Test History</h1>
      <p className="mt-1 text-sm text-slate-500">
        Every completed test on this device, most recent first. Saved in your browser only.
      </p>

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
