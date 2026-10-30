"use client";
// /app header — wordmark, language, sign-in state. Nothing else.  [NEW — hackathon]
import Link from "next/link";
import { LangToggle } from "@/app/components/Lang";

export default function AppHeader({ userMenu }) {
  return (
    <header className="sticky top-0 z-40 bg-ink-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-5 sm:px-7 py-4">
        <Link href="/app" className="text-[19px] font-semibold tracking-tight text-ink-100 whitespace-nowrap">
          My Side <span className="text-brand-500">Call</span>
        </Link>
        <nav className="flex items-center gap-2 whitespace-nowrap">
          <LangToggle />
          {userMenu}
        </nav>
      </div>
    </header>
  );
}
