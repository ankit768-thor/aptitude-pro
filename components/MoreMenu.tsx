"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const ITEMS = [
  { href: "/analytics", label: "Analytics" },
  { href: "/history", label: "History" },
  { href: "/mistakes", label: "My Mistakes" },
  { href: "/bookmarks", label: "Bookmarks" },
];

export default function MoreMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="hover:text-slate-900">
        More
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
