"use client";

import { useEffect, useRef, useState } from "react";
import {
  startPracticeSession,
  submitPracticeAnswer,
  finishPracticeSession,
  type PracticeQuestion,
} from "@/lib/actions/practice";
import { toggleBookmark } from "@/lib/actions/bookmarks";
import type { BookmarkCategory, Difficulty } from "@/lib/types/database";

const BOOKMARK_CATEGORIES: { value: BookmarkCategory; label: string }[] = [
  { value: "wrong", label: "Wrong" },
  { value: "important", label: "Important" },
  { value: "difficult", label: "Difficult" },
  { value: "interview", label: "Interview" },
];

interface Props {
  subjects: { value: string; label: string }[];
  companies: { id: string; name: string; slug: string }[];
  initialCompanyId?: string;
  initialSubject?: string;
  initialDifficulty?: string;
  // When set (e.g. from "Practice My Mistakes"), skips the filter form and
  // starts a session sourced from exactly these question IDs.
  fixedQuestionIds?: string[];
}

const VALID_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export default function PracticeRunner({
  subjects,
  companies,
  initialCompanyId,
  initialSubject,
  initialDifficulty,
  fixedQuestionIds,
}: Props) {
  const [subject, setSubject] = useState<string>(
    initialSubject && subjects.some((s) => s.value === initialSubject) ? initialSubject : "",
  );
  const [difficulty, setDifficulty] = useState<Difficulty | "">(
    initialDifficulty && VALID_DIFFICULTIES.includes(initialDifficulty as Difficulty) ? (initialDifficulty as Difficulty) : "",
  );
  const [companyId, setCompanyId] = useState<string>(initialCompanyId ?? "");

  const [loading, setLoading] = useState(Boolean(fixedQuestionIds?.length));
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState<number>(0);
  const [finished, setFinished] = useState(false);
  const [bookmarked, setBookmarked] = useState<BookmarkCategory[]>([]);
  const autoStartedRef = useRef(false);
  const [noFixedQuestions, setNoFixedQuestions] = useState(false);

  useEffect(() => {
    if (fixedQuestionIds?.length && !autoStartedRef.current) {
      autoStartedRef.current = true;
      startPracticeSession({ questionIds: fixedQuestionIds }).then((result) => {
        setLoading(false);
        if (!result.attemptId) {
          setNoFixedQuestions(true);
          return;
        }
        setAttemptId(result.attemptId);
        setQuestions(result.questions);
        setQuestionStartedAt(Date.now());
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleToggleBookmark(category: BookmarkCategory) {
    const q = questions[index];
    setBookmarked((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
    await toggleBookmark(q.id, category).catch(() => {});
  }

  async function handleStart() {
    setLoading(true);
    const result = await startPracticeSession({
      subject: subject || undefined,
      difficulty: (difficulty as Difficulty) || undefined,
      companyId: companyId || undefined,
    });
    setLoading(false);
    setAttemptId(result.attemptId);
    setQuestions(result.questions);
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setCorrectCount(0);
    setFinished(false);
    setQuestionStartedAt(Date.now());
  }

  async function handleCheck() {
    if (!selected || !attemptId) return;
    const q = questions[index];
    const isCorrect = selected === q.correct_option_key;
    setRevealed(true);
    if (isCorrect) setCorrectCount((c) => c + 1);

    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartedAt) / 1000));
    await submitPracticeAnswer({
      attemptId,
      questionId: q.id,
      topicId: q.topic_id,
      selectedKey: selected,
      isCorrect,
      timeSpentSeconds: timeSpent,
    });
  }

  async function handleNext() {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
      setBookmarked([]);
      setQuestionStartedAt(Date.now());
    } else if (attemptId) {
      await finishPracticeSession(attemptId);
      setFinished(true);
    }
  }

  if (finished) {
    return (
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-center">
        <p className="text-sm text-slate-500">Session complete</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">
          {correctCount}/{questions.length}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {Math.round((correctCount / Math.max(1, questions.length)) * 100)}% accuracy
        </p>
        <button
          onClick={() => {
            setAttemptId(null);
            setQuestions([]);
          }}
          className="mt-4 rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Practice again
        </button>
      </div>
    );
  }

  if (!attemptId && fixedQuestionIds?.length) {
    if (noFixedQuestions) {
      return <p className="mt-6 text-sm text-slate-500">No matching questions to practice right now.</p>;
    }
    return <p className="mt-6 text-sm text-slate-500">Loading your mistakes…</p>;
  }

  if (!attemptId) {
    return (
      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5">
        <Select label="Topic" value={subject} onChange={setSubject} options={[{ value: "", label: "All topics" }, ...subjects]} />
        <Select
          label="Difficulty"
          value={difficulty}
          onChange={(v) => setDifficulty(v as Difficulty | "")}
          options={[
            { value: "", label: "All difficulties" },
            { value: "easy", label: "Easy" },
            { value: "medium", label: "Medium" },
            { value: "hard", label: "Hard" },
          ]}
        />
        <Select
          label="Company"
          value={companyId}
          onChange={setCompanyId}
          options={[{ value: "", label: "Any company" }, ...companies.map((c) => ({ value: c.id, label: c.name }))]}
        />
        <button
          onClick={handleStart}
          disabled={loading}
          className="mt-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Loading…" : "Start practice"}
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
        No questions match those filters yet.{" "}
        <button onClick={() => setAttemptId(null)} className="text-slate-900 underline">
          Try different filters
        </button>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="mt-6">
      <p className="text-xs text-slate-400">
        Question {index + 1} / {questions.length} · {q.topic_name} · {q.difficulty}
      </p>
      <div className="mt-3 rounded-xl border border-slate-200 bg-white p-5">
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-900">{q.question_text}</p>
        <div className="mt-4 flex flex-col gap-2">
          {q.options.map((opt) => {
            const isSelected = selected === opt.key;
            const isCorrectOpt = opt.key === q.correct_option_key;
            let style = "border-slate-200 hover:bg-slate-50";
            if (revealed && isCorrectOpt) style = "border-emerald-500 bg-emerald-50";
            else if (revealed && isSelected && !isCorrectOpt) style = "border-red-400 bg-red-50";
            else if (isSelected) style = "border-slate-900";

            return (
              <button
                key={opt.key}
                onClick={() => !revealed && setSelected(opt.key)}
                disabled={revealed}
                className={`rounded-lg border px-3 py-2.5 text-left text-sm text-slate-800 ${style}`}
              >
                <span className="font-medium">{opt.key}.</span> {opt.text}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="mt-4 flex flex-col gap-2 rounded-lg bg-slate-50 p-4 text-sm">
            <p>
              <span className="font-medium text-slate-900">Correct answer: </span>
              {q.correct_option_key}
            </p>
            <p className="text-slate-700">
              <span className="font-medium text-slate-900">Explanation: </span>
              {q.explanation}
            </p>
            {q.shortcut && (
              <p className="text-slate-700">
                <span className="font-medium text-slate-900">Shortcut: </span>
                {q.shortcut}
              </p>
            )}
            {q.concept && (
              <p className="text-slate-700">
                <span className="font-medium text-slate-900">Concept: </span>
                {q.concept}
              </p>
            )}
            {q.exam_tip && (
              <p className="text-slate-700">
                <span className="font-medium text-slate-900">Exam tip: </span>
                {q.exam_tip}
              </p>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">Bookmark:</span>
              {BOOKMARK_CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => handleToggleBookmark(c.value)}
                  className={`rounded-full px-2.5 py-1 text-xs ${
                    bookmarked.includes(c.value)
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          {!revealed ? (
            <button
              onClick={handleCheck}
              disabled={!selected}
              className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              Check answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white"
            >
              {index + 1 < questions.length ? "Next" : "Finish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-600">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
