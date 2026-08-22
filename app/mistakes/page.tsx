import { getMistakes } from "@/lib/actions/mistakes";
import { createClient } from "@/lib/supabase/server";
import MistakesBrowser from "@/components/MistakesBrowser";

export default async function MistakesPage() {
  const supabase = await createClient();
  const [mistakes, { data: companies }] = await Promise.all([
    getMistakes(),
    supabase.from("companies").select("id, name, slug").order("name"),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">My Mistakes</h1>
      <p className="mt-1 text-sm text-slate-500">
        Questions you&apos;ve answered incorrectly, automatically collected from practice and mock tests.
      </p>
      <MistakesBrowser mistakes={mistakes} companies={companies ?? []} />
    </div>
  );
}
