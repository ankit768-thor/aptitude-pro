import { supabase } from "@/lib/supabase/client";
import CompanyGrid from "@/components/CompanyGrid";

export default async function CompaniesPage() {
  const { data: companies } = await supabase
    .from("companies")
    .select("id, name, slug, category, difficulty, assessment_type")
    .order("name");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Company Preparation</h1>
      <p className="mt-1 text-sm text-slate-500">
        Browse each company&apos;s estimated assessment pattern and jump into targeted practice.
      </p>
      <div className="mt-6">
        <CompanyGrid companies={companies ?? []} />
      </div>
    </div>
  );
}
