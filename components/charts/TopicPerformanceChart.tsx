"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { TopicPerformancePoint } from "@/lib/actions/analytics";
import EmptyState from "@/components/charts/EmptyState";

export default function TopicPerformanceChart({ data }: { data: TopicPerformancePoint[] }) {
  if (data.length === 0) return <EmptyState />;

  const top = data.slice(0, 8);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={top} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
        <YAxis type="category" dataKey="topicName" width={110} tick={{ fontSize: 10, fill: "#64748b" }} />
        <Tooltip formatter={(value) => [`${value}%`, "Accuracy"]} />
        <Bar dataKey="accuracyPct" fill="#0f172a" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
