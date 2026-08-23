import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default async function Home() {
  const { data: popularCompanies } = await supabase
    .from("companies")
    .select("id, name, slug")
    .order("name")
    .limit(7);

  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Crack Your MBA Placement Aptitude Test
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          Practice company-specific aptitude tests, take timed assessments and identify exactly
          where you need to improve.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/companies"
            className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Find My Company Test
          </Link>
          <Link
            href="/practice"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Start Aptitude Practice
          </Link>
        </div>

        {popularCompanies && popularCompanies.length > 0 && (
          <div className="mt-14">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Popular companies
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
              {popularCompanies.map((c, i) => (
                <span key={c.id} className="flex items-center gap-6">
                  <Link href={`/companies/${c.slug}`} className="hover:text-slate-900">
                    {c.name}
                  </Link>
                  {i < popularCompanies.length - 1 && <span className="text-slate-300">|</span>}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
