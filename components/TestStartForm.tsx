"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { startTest } from "@/lib/actions/test";
import { getModeConfig, difficultyMix, sectionTargets, type CompanySectionLike } from "@/lib/algorithms/testAssembly";
import { SUBJECT_LABELS, MODE_LABELS, MODE_DESCRIPTIONS, type TimedMode } from "@/lib/constants";
import type { Difficulty, Subject } from "@/lib/types/database";

export interface CompanyWithSections {
  id: string;
  name: string;
  slug: string;
  difficulty: Difficulty;
  company_sections: CompanySectionLike[];
}

const MODES: TimedMode[] = ["quick", "sectional", "company_mock", "full_assessment"];

export default function TestStartForm({
  companies,
  initialCompanyId,
  initialMode,
}: {
  companies: CompanyWithSections[];
  initialCompanyId?: string;
  initialMode?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<TimedMode>(
    initialMode && MODES.includes(initialMode as TimedMode) ? (initialMode as TimedMode) : "quick",
  );
  const [companyId, setCompanyId] = useState<string>(initialCompanyId ?? "");
  const [subject, setSubject] = useState<Subject | "">("");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const company = companies.find((c) => c.id === companyId);
  const sections = company?.company_sections;
  const domainPickerEnabled = mode !== "full_assessment" && !companyId;

  const preview = useMemo(() => {
    const config = getModeConfig(mode, sections);
    const mix = difficultyMix(company?.difficulty);
    const targets = sectionTargets(mode, config.questionCount, sections, domainPickerEnabled && subject ? subject : undefined);
    return { config, targets, mix };
  }, [mode, sections, company?.difficulty, domainPickerEnabled, subject]);

  const canStart = mode !== "full_assessment" || Boolean(companyId);

  async function handleStart() {
    setError(null);
    setStarting(true);
    try {
      const { attemptId } = await startTest({
        mode,
        companyId: companyId || undefined,
        subject: domainPickerEnabled && subject ? subject : undefined,
      });
      router.push(`/test/${attemptId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the test");
      setStarting(false);
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg border px-4 py-3 text-left text-sm ${
              mode === m ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <p className="font-medium">{MODE_LABELS[m]}</p>
            <p className={`mt-0.5 text-xs ${mode === m ? "text-slate-300" : "text-slate-500"}`}>{MODE_DESCRIPTIONS[m]}</p>
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-1 text-sm text-slate-600">
        Target company {mode === "full_assessment" && <span className="text-red-500">(required)</span>}
        <select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
        >
          <option value="">{mode === "full_assessment" ? "Select a company…" : "Generic (no target company)"}</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      {domainPickerEnabled && (
        <label className="flex flex-col gap-1 text-sm text-slate-600">
          Domain
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value as Subject | "")}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          >
            <option value="">All domains</option>
            {(Object.keys(SUBJECT_LABELS) as Subject[]).map((s) => (
              <option key={s} value={s}>
                {SUBJECT_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm font-medium text-slate-900">Before you start</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <PreviewStat label="Questions" value={String(preview.config.questionCount)} />
          <PreviewStat label="Time limit" value={`${preview.config.timeLimitMinutes} min`} />
          <PreviewStat
            label="Negative marking"
            value={preview.config.negativeMarking ? `-${preview.config.negativeMarkingValue} / wrong` : "None"}
          />
        </div>
        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">Sections</p>
        <div className="mt-2 flex flex-col gap-1">
          {preview.targets.map((t) => (
            <div key={t.subject} className="flex justify-between text-sm text-slate-700">
              <span>{SUBJECT_LABELS[t.subject]}</span>
              <span className="text-slate-400">{t.targetCount} questions</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Once you start, the timer begins immediately and cannot be paused. Answers autosave as you go, so
          reloading the page won&apos;t lose your progress or reset the clock.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleStart}
        disabled={!canStart || starting}
        className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-40"
      >
        {starting ? "Starting…" : "Start test"}
      </button>
    </div>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
