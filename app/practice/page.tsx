import { Suspense } from "react";
import PracticeClient from "@/components/PracticeClient";

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Practice</h1>
      <p className="mt-1 text-sm text-slate-500">
        Untimed practice with instant explanations. Filter by topic, difficulty, or company.
      </p>

      <Suspense fallback={<p className="mt-6 text-sm text-slate-400">Loading…</p>}>
        <PracticeClient />
      </Suspense>
    </div>
  );
}
