"use client";

import { useState } from "react";
import Link from "next/link";
import type { CompanyCategory, Difficulty } from "@/lib/types/database";

export interface CompanyListItem {
  id: string;
  name: string;
  slug: string;
  category: CompanyCategory;
  difficulty: Difficulty;
  assessment_type: string;
}

const CATEGORY_LABELS: Record<CompanyCategory, string> = {
  consulting: "Consulting",
  bfsi: "Finance / BFSI",
  fmcg: "FMCG",
  tech_ecommerce: "Tech / E-commerce",
};

export default function CompanyGrid({ companies }: { companies: CompanyListItem[] }) {
  const [category, setCategory] = useState<CompanyCategory | "all">("all");

  const filtered =
    category === "all" ? companies : companies.filter((c) => c.category === category);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <FilterChip label="All" active={category === "all"} onClick={() => setCategory("all")} />
        {(Object.keys(CATEGORY_LABELS) as CompanyCategory[]).map((cat) => (
          <FilterChip
            key={cat}
            label={CATEGORY_LABELS[cat]}
            active={category === cat}
            onClick={() => setCategory(cat)}
          />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={`/companies/${c.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
          >
            <p className="font-medium text-slate-900">{c.name}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
              {CATEGORY_LABELS[c.category]}
            </p>
            <p className="mt-3 text-sm text-slate-500">{c.assessment_type}</p>
            <span className="mt-3 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-600">
              {c.difficulty}
            </span>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-slate-400">No companies in this category yet.</p>
        )}
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm ${
        active ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}
