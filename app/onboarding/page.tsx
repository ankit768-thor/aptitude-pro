"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { completeOnboarding } from "@/lib/actions/onboarding";
import type { Program, Specialization, TargetRole } from "@/lib/types/database";

const PROGRAMS: { value: Program; label: string }[] = [
  { value: "mba", label: "MBA" },
  { value: "pgdm", label: "PGDM" },
  { value: "other", label: "Other Management Program" },
];

const SPECIALIZATIONS: { value: Specialization; label: string }[] = [
  { value: "finance", label: "Finance" },
  { value: "marketing", label: "Marketing" },
  { value: "hr", label: "HR" },
  { value: "operations", label: "Operations" },
  { value: "business_analytics", label: "Business Analytics" },
  { value: "product", label: "Product Management" },
  { value: "strategy", label: "Strategy" },
  { value: "general_management", label: "General Management" },
];

const TARGET_ROLES: { value: TargetRole; label: string }[] = [
  { value: "business_analyst", label: "Business Analyst" },
  { value: "financial_analyst", label: "Financial Analyst" },
  { value: "consultant", label: "Consultant" },
  { value: "management_trainee", label: "Management Trainee" },
  { value: "product_analyst", label: "Product Analyst" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "operations", label: "Operations" },
  { value: "hr", label: "HR" },
  { value: "other", label: "Other" },
];

interface CompanyOption {
  id: string;
  name: string;
  category: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [program, setProgram] = useState<Program | null>(null);
  const [specialization, setSpecialization] = useState<Specialization | null>(null);
  const [targetRole, setTargetRole] = useState<TargetRole | null>(null);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("companies")
      .select("id, name, category")
      .order("name")
      .then(({ data }) => setCompanies((data as CompanyOption[]) ?? []));
  }, [supabase]);

  function toggleCompany(id: string) {
    setSelectedCompanyIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  async function handleFinish() {
    if (!program || !specialization || !targetRole) return;
    setSubmitting(true);
    setError(null);
    try {
      await completeOnboarding({
        fullName,
        program,
        specialization,
        targetRole,
        companyIds: selectedCompanyIds,
      });
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const canAdvance =
    (step === 1 && fullName.trim().length > 0 && program !== null) ||
    (step === 2 && specialization !== null) ||
    (step === 3 && targetRole !== null) ||
    step === 4;

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-8 flex gap-2">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`h-1.5 flex-1 rounded-full ${n <= step ? "bg-slate-900" : "bg-slate-200"}`}
          />
        ))}
      </div>

      {step === 1 && (
        <section>
          <h1 className="text-xl font-semibold text-slate-900">Tell us about your program</h1>
          <input
            type="text"
            placeholder="Your name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-slate-500 focus:outline-none"
          />
          <div className="mt-4 flex flex-col gap-2">
            {PROGRAMS.map((p) => (
              <OptionRow key={p.value} label={p.label} selected={program === p.value} onClick={() => setProgram(p.value)} />
            ))}
          </div>
        </section>
      )}

      {step === 2 && (
        <section>
          <h1 className="text-xl font-semibold text-slate-900">Your specialization</h1>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {SPECIALIZATIONS.map((s) => (
              <OptionRow key={s.value} label={s.label} selected={specialization === s.value} onClick={() => setSpecialization(s.value)} />
            ))}
          </div>
        </section>
      )}

      {step === 3 && (
        <section>
          <h1 className="text-xl font-semibold text-slate-900">Your target role</h1>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {TARGET_ROLES.map((r) => (
              <OptionRow key={r.value} label={r.label} selected={targetRole === r.value} onClick={() => setTargetRole(r.value)} />
            ))}
          </div>
        </section>
      )}

      {step === 4 && (
        <section>
          <h1 className="text-xl font-semibold text-slate-900">I am preparing for…</h1>
          <p className="mt-1 text-sm text-slate-500">Select any number of target companies.</p>
          <div className="mt-4 flex flex-col gap-2">
            {companies.map((c) => (
              <label
                key={c.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={selectedCompanyIds.includes(c.id)}
                  onChange={() => toggleCompany(c.id)}
                />
                <span>{c.name}</span>
                <span className="ml-auto text-xs uppercase text-slate-400">{c.category}</span>
              </label>
            ))}
            {companies.length === 0 && (
              <p className="text-sm text-slate-400">No companies seeded yet.</p>
            )}
          </div>
        </section>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="rounded-lg px-4 py-2 text-sm text-slate-500 disabled:opacity-0"
        >
          Back
        </button>
        {step < 4 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={submitting}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Finish"}
          </button>
        )}
      </div>
    </div>
  );
}

function OptionRow({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-2.5 text-left text-sm ${
        selected ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-700 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}
