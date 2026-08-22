"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { DailyPoint } from "@/lib/actions/analytics";
import EmptyState from "@/components/charts/EmptyState";

export default function AccuracyOverTimeChart({ data }: { data: DailyPoint[] }) {
  if (data.length === 0) return <EmptyState />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
        <Tooltip formatter={(value) => [`${value}%`, "Accuracy"]} />
        <Line type="monotone" dataKey="value" stroke="#0f172a" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
