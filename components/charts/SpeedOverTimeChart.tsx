"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { DailyPoint } from "@/lib/actions/analytics";
import EmptyState from "@/components/charts/EmptyState";

export default function SpeedOverTimeChart({ data }: { data: DailyPoint[] }) {
  if (data.length === 0) return <EmptyState />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
        <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
        <Tooltip formatter={(value) => [`${value}s`, "Avg time"]} />
        <Line type="monotone" dataKey="value" stroke="#4338ca" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
