"use client";

// No accounts — progress lives in the browser only, same as sql-mastery.

export interface HistoryEntry {
  date: string; // ISO
  title: string;
  companyName: string | null;
  score: number;
  accuracy: number;
}

const KEY = "apro_history";

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry: HistoryEntry) {
  const history = getHistory();
  history.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(history.slice(0, 200)));
}
