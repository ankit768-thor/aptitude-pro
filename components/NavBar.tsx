import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export default async function NavBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-tight text-slate-900">
          AptitudePro
        </Link>
        <nav className="flex items-center gap-5 text-sm text-slate-600">
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-slate-900">Dashboard</Link>
              <Link href="/companies" className="hover:text-slate-900">Companies</Link>
              <Link href="/practice" className="hover:text-slate-900">Practice</Link>
              <Link href="/test/start" className="hover:text-slate-900">Test</Link>
              <Link href="/history" className="hover:text-slate-900">History</Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/companies" className="hover:text-slate-900">Companies</Link>
              <Link href="/login" className="rounded-lg bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-800">
                Sign in
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
