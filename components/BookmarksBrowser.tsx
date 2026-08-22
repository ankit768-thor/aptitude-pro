"use client";

import { useState } from "react";
import type { BookmarkedQuestion } from "@/lib/actions/bookmarks";
import { SUBJECT_LABELS } from "@/lib/constants";
import type { BookmarkCategory } from "@/lib/types/database";

const CATEGORY_LABELS: Record<BookmarkCategory, string> = {
  wrong: "Wrong Questions",
  important: "Important Questions",
  difficult: "Difficult Questions",
  interview: "Interview Questions",
};

const CATEGORIES: BookmarkCategory[] = ["wrong", "important", "difficult", "interview"];

export default function BookmarksBrowser({ bookmarks }: { bookmarks: BookmarkedQuestion[] }) {
  const [filter, setFilter] = useState<BookmarkCategory | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = filter === "all" ? bookmarks : bookmarks.filter((b) => b.categories.includes(filter));

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        <Chip label="All" active={filter === "all"} onClick={() => setFilter("all")} />
        {CATEGORIES.map((c) => (
          <Chip key={c} label={CATEGORY_LABELS[c]} active={filter === c} onClick={() => setFilter(c)} />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {filtered.map((b) => {
          const isOpen = openId === b.id;
          return (
            <div key={b.id} className="rounded-lg border border-slate-200 bg-white">
              <button
                onClick={() => setOpenId(isOpen ? null : b.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{b.questionText.split("\n")[0].slice(0, 90)}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {SUBJECT_LABELS[b.subject]} · {b.topicName} · {b.difficulty}
                  </p>
                </div>
                <div className="flex gap-1">
                  {b.categories.map((c) => (
                    <span key={c} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {CATEGORY_LABELS[c].replace(" Questions", "")}
                    </span>
                  ))}
                </div>
              </button>
              {isOpen && (
                <div className="border-t border-slate-100 px-4 py-3 text-sm">
                  <p className="whitespace-pre-line text-slate-800">{b.questionText}</p>
                  <div className="mt-3 flex flex-col gap-1">
                    {b.options.map((opt) => (
                      <p
                        key={opt.key}
                        className={opt.key === b.correctOptionKey ? "font-medium text-emerald-700" : "text-slate-600"}
                      >
                        {opt.key}. {opt.text}
                      </p>
                    ))}
                  </div>
                  <p className="mt-3 text-slate-700">
                    <span className="font-medium text-slate-900">Explanation: </span>
                    {b.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-400">
            No bookmarks {filter !== "all" ? `in ${CATEGORY_LABELS[filter]}` : "yet"}. Bookmark questions while
            practicing to see them here.
          </p>
        )}
      </div>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm ${
        active ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}
