import { Suspense } from "react";
import TestStartClient from "@/components/TestStartClient";

export default function TestStartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Start a Timed Test</h1>
      <p className="mt-1 text-sm text-slate-500">
        Pick a mode and, optionally, a target company to match its assessment pattern.
      </p>
      <Suspense fallback={<p className="mt-6 text-sm text-slate-400">Loading…</p>}>
        <TestStartClient />
      </Suspense>
    </div>
  );
}
