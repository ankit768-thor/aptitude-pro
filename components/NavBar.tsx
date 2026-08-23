import Link from "next/link";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-tight text-slate-900">
          AptitudePro
        </Link>
        <nav className="flex items-center gap-5 text-sm text-slate-600">
          <Link href="/companies" className="hover:text-slate-900">Companies</Link>
          <Link href="/practice" className="hover:text-slate-900">Practice</Link>
          <Link href="/test/start" className="hover:text-slate-900">Test</Link>
          <Link href="/history" className="hover:text-slate-900">History</Link>
        </nav>
      </div>
    </header>
  );
}
