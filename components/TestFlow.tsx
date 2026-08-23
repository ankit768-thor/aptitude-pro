"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { assembleTest, type AssembledTest } from "@/lib/testEngine";
import { getModeConfig, sectionTargets, type CompanySectionLike } from "@/lib/algorithms/testAssembly";
import { scoreAttempt, type ScoredAnswer, type ScoreResult } from "@/lib/algorithms/scoring";
import { addHistoryEntry } from "@/lib/history";
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

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function TestFlow({
  companies,
  initialCompanyId,
  initialMode,
}: {
  companies: CompanyWithSections[];
  initialCompanyId?: string;
  initialMode?: string;
}) {
  const [mode, setMode] = useState<TimedMode>(
    initialMode && MODES.includes(initialMode as TimedMode) ? (initialMode as TimedMode) : "quick",
  );
  const [companyId, setCompanyId] = useState<string>(initialCompanyId ?? "");
  const [subject, setSubject] = useState<Subject | "">("");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [test, setTest] = useState<AssembledTest | null>(null);

  const company = companies.find((c) => c.id === companyId);
  const sections = company?.company_sections;
  const domainPickerEnabled = mode !== "full_assessment" && !companyId;

  const preview = useMemo(() => {
    const config = getModeConfig(mode, sections);
    const targets = sectionTargets(mode, config.questionCount, sections, domainPickerEnabled && subject ? subject : undefined);
    return { config, targets };
  }, [mode, sections, domainPickerEnabled, subject]);

  const canStart = mode !== "full_assessment" || Boolean(companyId);

  async function handleStart() {
    setError(null);
    setStarting(true);
    try {
      const assembled = await assembleTest(mode, companyId || undefined, domainPickerEnabled && subject ? subject : undefined);
      setTest(assembled);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the test");
    } finally {
      setStarting(false);
    }
  }

  if (!test) {
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

  return <RunningTest test={test} companyName={company?.name ?? null} onRestart={() => setTest(null)} />;
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

interface Answer {
  selected: string | null;
  marked: boolean;
  timeSpentSeconds: number;
}

function RunningTest({
  test,
  companyName,
  onRestart,
}: {
  test: AssembledTest;
  companyName: string | null;
  onRestart: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>(() =>
    Object.fromEntries(test.questions.map((q) => [q.id, { selected: null, marked: false, timeSpentSeconds: 0 }])),
  );
  const testEndsAtRef = useRef(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const visitStartedAtRef = useRef(0);

  useEffect(() => {
    testEndsAtRef.current = Date.now() + test.timeLimitMinutes * 60_000;
    visitStartedAtRef.current = Date.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = test.questions[index];

  function flush() {
    const now = Date.now();
    const delta = Math.round((now - visitStartedAtRef.current) / 1000);
    visitStartedAtRef.current = now;
    if (delta > 0) {
      setAnswers((prev) => ({ ...prev, [q.id]: { ...prev[q.id], timeSpentSeconds: prev[q.id].timeSpentSeconds + delta } }));
    }
  }

  function handleSubmit() {
    flush();
    const scoredAnswers: ScoredAnswer[] = test.questions.map((question) => {
      const a = answers[question.id];
      const isCorrect = a.selected ? a.selected === question.correctOptionKey : null;
      return {
        questionId: question.id,
        subject: question.subject,
        selectedOptionKey: a.selected,
        isCorrect,
        timeSpentSeconds: a.timeSpentSeconds,
      };
    });
    const scored = scoreAttempt(scoredAnswers, test.negativeMarking, test.negativeMarkingValue ?? 0);
    addHistoryEntry({ date: new Date().toISOString(), title: test.title, companyName, score: scored.score, accuracy: scored.accuracy });
    setResult(scored);
  }

  useEffect(() => {
    if (result) return;
    const tick = () => {
      const remaining = Math.max(0, Math.floor((testEndsAtRef.current - Date.now()) / 1000));
      setRemainingSeconds(remaining);
      if (remaining <= 0) handleSubmit();
    };
    const timeout = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  if (result) {
    return (
      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Your Result</p>
        <h2 className="mt-1 text-xl font-semibold text-slate-900">{test.title}</h2>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-sm text-slate-500">Score</p>
          <p className="mt-1 text-4xl font-semibold text-slate-900">{result.score}/100</p>
          <p className="mt-1 text-sm text-slate-500">{result.accuracy}% accuracy</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Correct" value={String(result.correct)} tone="text-emerald-700" />
          <Stat label="Incorrect" value={String(result.incorrect)} tone="text-red-700" />
          <Stat label="Skipped" value={String(result.skipped)} tone="text-slate-900" />
          <Stat label="Avg time/question" value={`${result.avgTimeSeconds}s`} tone="text-slate-900" />
        </div>

        <h3 className="mt-6 text-sm font-medium text-slate-900">Section Performance</h3>
        <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3 text-right">Accuracy</th>
                <th className="px-4 py-3 text-right">Correct</th>
                <th className="px-4 py-3 text-right">Avg Time</th>
              </tr>
            </thead>
            <tbody>
              {result.sectionPerformance.map((s) => (
                <tr key={s.subject} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-900">{SUBJECT_LABELS[s.subject]}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{s.accuracy}%</td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {s.correct}/{s.total}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">{s.avgTimeSeconds}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={onRestart} className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
          Take another test
        </button>
      </div>
    );
  }

  function selectOption(key: string) {
    flush();
    setAnswers((prev) => ({ ...prev, [q.id]: { ...prev[q.id], selected: key } }));
  }

  function toggleMark() {
    flush();
    setAnswers((prev) => ({ ...prev, [q.id]: { ...prev[q.id], marked: !prev[q.id].marked } }));
  }

  function goTo(newIndex: number) {
    flush();
    setIndex(Math.max(0, Math.min(test.questions.length - 1, newIndex)));
  }

  function paletteState(questionId: string, i: number): "current" | "marked" | "answered" | "unanswered" {
    if (i === index) return "current";
    if (answers[questionId]?.marked) return "marked";
    if (answers[questionId]?.selected) return "answered";
    return "unanswered";
  }
  const paletteStyles: Record<string, string> = {
    current: "bg-slate-900 text-white border-slate-900",
    marked: "bg-amber-100 text-amber-800 border-amber-300",
    answered: "bg-emerald-100 text-emerald-800 border-emerald-300",
    unanswered: "bg-white text-slate-600 border-slate-200",
  };

  const answeredCount = Object.values(answers).filter((a) => a.selected).length;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">{test.title}</p>
          <p className="text-xs text-slate-500">
            Question {index + 1} / {test.questions.length} · {SUBJECT_LABELS[q.subject]} · {answeredCount} answered
          </p>
        </div>
        {remainingSeconds !== null && (
          <div
            className={`rounded-lg border px-4 py-2 font-mono text-lg font-semibold ${
              remainingSeconds <= 60 ? "border-red-300 bg-red-50 text-red-700" : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            {formatTime(remainingSeconds)}
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-900">{q.questionText}</p>
          <div className="mt-4 flex flex-col gap-2">
            {q.options.map((opt) => {
              const isSelected = answers[q.id]?.selected === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => selectOption(opt.key)}
                  className={`rounded-lg border px-3 py-2.5 text-left text-sm text-slate-800 ${
                    isSelected ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="font-medium">{opt.key}.</span> {opt.text}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button onClick={() => goTo(index - 1)} disabled={index === 0} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 disabled:opacity-40">
              Previous
            </button>
            <button onClick={() => goTo(index + 1)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600">
              Skip
            </button>
            <button
              onClick={toggleMark}
              className={`rounded-lg border px-4 py-2 text-sm ${
                answers[q.id]?.marked ? "border-amber-300 bg-amber-50 text-amber-800" : "border-slate-200 text-slate-600"
              }`}
            >
              {answers[q.id]?.marked ? "Unmark" : "Mark for Review"}
            </button>
            {index + 1 < test.questions.length ? (
              <button onClick={() => goTo(index + 1)} className="ml-auto rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white">
                Next
              </button>
            ) : (
              <button onClick={handleSubmit} className="ml-auto rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white">
                Submit test
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Questions</p>
          <div className="mt-2 grid grid-cols-5 gap-1.5">
            {test.questions.map((question, i) => (
              <button key={question.id} onClick={() => goTo(i)} className={`rounded border py-1.5 text-xs font-medium ${paletteStyles[paletteState(question.id, i)]}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <button onClick={handleSubmit} className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
            Submit now
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`mt-0.5 text-lg font-semibold ${tone}`}>{value}</p>
    </div>
  );
}
