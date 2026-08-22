"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { MistakeQuestion } from "@/lib/actions/mistakes";
import { SUBJECT_LABELS } from "@/lib/constants";
import type { Difficulty, Subject } from "@/lib/types/database";

export default function MistakesBrowser({
  mistakes,
  companies,
}: {
  mistakes: MistakeQuestion[];
  companies: { id: string; name: string; slug: string }[];
}) {
  const [subject, setSubject] = useState<Subject | "">("");
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [companySlug, setCompanySlug] = useState<string>("");
  const companyName = companies.find((c) => c.slug === companySlug)?.name ?? "";

  const filtered = useMemo(
    () =>
      mistakes.filter(
        (m) =>
          (!subject || m.subject === subject) &&
          (!difficulty || m.difficulty === difficulty) &&
          (!companyName || m.companyName === companyName),
      ),
    [mistakes, subject, difficulty, companyName],
  );

  const bySubjectCount = useMemo(() => {
    const counts = new Map<Subject, number>();
    for (const m of mistakes) counts.set(m.subject, (counts.get(m.subject) ?? 0) + 1);
    return counts;
  }, [mistakes]);

  const practiceHref = `/practice?mistakes=1${subject ? `&subject=${subject}` : ""}${difficulty ? `&difficulty=${difficulty}` : ""}${companySlug ? `&company=${companySlug}` : ""}`;

  return (
    <div className="mt-6">
      {mistakes.length === 0 ? (
        <p className="text-sm text-slate-400">No mistakes yet — keep practicing and this will fill in automatically.</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 text-sm text-slate-600">
            {Array.from(bySubjectCount.entries()).map(([s, count]) => (
              <span key={s} className="rounded-full bg-slate-100 px-3 py-1">
                {count} in {SUBJECT_LABELS[s]}
              </span>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject | "")}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            >
              <option value="">All topics</option>
              {(Object.keys(SUBJECT_LABELS) as Subject[]).map((s) => (
                <option key={s} value={s}>
                  {SUBJECT_LABELS[s]}
                </option>
              ))}
            </select>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty | "")}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            >
              <option value="">All difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              value={companySlug}
              onChange={(e) => setCompanySlug(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            >
              <option value="">Any company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Link
            href={practiceHref}
            className="mt-4 inline-block rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Practice My Mistakes ({filtered.length})
          </Link>

          <div className="mt-4 flex flex-col gap-2">
            {filtered.map((m) => (
              <div key={m.id} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <p className="whitespace-pre-line text-sm text-slate-800">{m.questionText.split("\n")[0]}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {SUBJECT_LABELS[m.subject]} · {m.topicName} · {m.difficulty}
                  {m.companyName ? ` · ${m.companyName}` : ""}
                </p>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-sm text-slate-400">No mistakes match those filters.</p>}
          </div>
        </>
      )}
    </div>
  );
}
