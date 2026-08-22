"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveAnswer, submitTest, type RunnerData } from "@/lib/actions/test";
import { SUBJECT_LABELS } from "@/lib/constants";

interface LocalAnswer {
  selected: string | null;
  marked: boolean;
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function TestRunner({ data }: { data: RunnerData }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, LocalAnswer>>(() =>
    Object.fromEntries(data.questions.map((q) => [q.id, { selected: q.selectedOptionKey, marked: q.isMarkedForReview }])),
  );
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>(() =>
    Object.fromEntries(data.questions.map((q) => [q.id, 0])),
  );
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const visitStartedAtRef = useRef(0);
  const submittedRef = useRef(false);

  useEffect(() => {
    visitStartedAtRef.current = Date.now();
  }, []);

  const q = data.questions[index];

  const flushCurrentQuestionTime = useCallback(() => {
    const now = Date.now();
    const delta = Math.round((now - visitStartedAtRef.current) / 1000);
    visitStartedAtRef.current = now;
    if (delta <= 0 || !q) return 0;
    setTimeSpent((prev) => ({ ...prev, [q.id]: (prev[q.id] ?? 0) + delta }));
    return delta;
  }, [q]);

  const handleSubmit = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    flushCurrentQuestionTime();
    await submitTest(data.attemptId);
    router.push(`/test/${data.attemptId}/result`);
  }, [data.attemptId, flushCurrentQuestionTime, router]);

  // Countdown timer; auto-submits once when it hits zero. The initial tick
  // is deferred to a macrotask (setTimeout 0) rather than called directly in
  // the effect body, so the first setState is async like every later tick.
  useEffect(() => {
    if (data.testEndsAt === null) return;
    const testEndsAt = data.testEndsAt;

    function tick() {
      const remaining = Math.max(0, Math.floor((testEndsAt - Date.now()) / 1000));
      setRemainingSeconds(remaining);
      if (remaining <= 0) {
        handleSubmit();
      }
    }

    const timeout = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [data.testEndsAt, handleSubmit]);

  function persist(questionId: string, next: LocalAnswer, elapsedDelta: number) {
    const total = (timeSpent[questionId] ?? 0) + elapsedDelta;
    saveAnswer({
      attemptId: data.attemptId,
      questionId,
      selectedOptionKey: next.selected,
      isMarkedForReview: next.marked,
      timeSpentSeconds: total,
    }).catch(() => {
      // Best-effort autosave — a transient failure here shouldn't block the
      // user from continuing; the final submit still reflects local state
      // for whatever did get saved along the way.
    });
  }

  function selectOption(key: string) {
    const delta = flushCurrentQuestionTime();
    const next = { selected: key, marked: answers[q.id]?.marked ?? false };
    setAnswers((prev) => ({ ...prev, [q.id]: next }));
    persist(q.id, next, delta);
  }

  function toggleMark() {
    const delta = flushCurrentQuestionTime();
    const next = { selected: answers[q.id]?.selected ?? null, marked: !(answers[q.id]?.marked ?? false) };
    setAnswers((prev) => ({ ...prev, [q.id]: next }));
    persist(q.id, next, delta);
  }

  function goTo(newIndex: number) {
    flushCurrentQuestionTime();
    setIndex(Math.max(0, Math.min(data.questions.length - 1, newIndex)));
  }

  function skip() {
    goTo(index + 1);
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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">{data.title}</p>
          <p className="text-xs text-slate-500">
            Question {index + 1} / {data.questions.length} · {SUBJECT_LABELS[q.subject]} · {answeredCount} answered
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
            <button
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 disabled:opacity-40"
            >
              Previous
            </button>
            <button onClick={skip} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600">
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
            {index + 1 < data.questions.length ? (
              <button
                onClick={() => goTo(index + 1)}
                className="ml-auto rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="ml-auto rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit test"}
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Questions</p>
          <div className="mt-2 grid grid-cols-5 gap-1.5">
            {data.questions.map((question, i) => (
              <button
                key={question.id}
                onClick={() => goTo(i)}
                className={`rounded border py-1.5 text-xs font-medium ${paletteStyles[paletteState(question.id, i)]}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-1.5 text-xs text-slate-500">
            <Legend swatch="bg-emerald-100 border-emerald-300" label="Answered" />
            <Legend swatch="bg-amber-100 border-amber-300" label="Marked for review" />
            <Legend swatch="bg-white border-slate-200" label="Unanswered" />
            <Legend swatch="bg-slate-900 border-slate-900" label="Current" />
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit now"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded border ${swatch}`} />
      {label}
    </div>
  );
}
