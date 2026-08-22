"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { CompanyReadinessPoint } from "@/lib/actions/analytics";
import EmptyState from "@/components/charts/EmptyState";

export default function CompanyReadinessChart({ data }: { data: CompanyReadinessPoint[] }) {
  if (data.length === 0) return <EmptyState />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
        <Tooltip formatter={(value) => [`${value}%`, "Readiness"]} />
        <Bar dataKey="overallPct" fill="#0f766e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
