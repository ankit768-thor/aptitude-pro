"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { DifficultyPerformancePoint } from "@/lib/actions/analytics";
import EmptyState from "@/components/charts/EmptyState";

const LABELS: Record<string, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };

export default function DifficultyPerformanceChart({ data }: { data: DifficultyPerformancePoint[] }) {
  const hasData = data.some((d) => d.attempted > 0);
  if (!hasData) return <EmptyState />;

  const chartData = data.map((d) => ({ label: LABELS[d.difficulty], accuracyPct: d.accuracyPct, attempted: d.attempted }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
        <Tooltip formatter={(value, _name, item) => [`${value}%`, `Accuracy (${item.payload.attempted} attempted)`]} />
        <Bar dataKey="accuracyPct" fill="#b45309" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
