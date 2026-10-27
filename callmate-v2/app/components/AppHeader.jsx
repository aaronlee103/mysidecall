"use client";
// /app header — brand mark, nav, EN/한국어 toggle, user menu.  [NEW — hackathon]
import Link from "next/link";
import { useLang, LangToggle } from "@/app/components/Lang";

export default function AppHeader({ userMenu }) {
  const { t } = useLang();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/app" className="group flex items-center gap-2.5 text-ink-100">
          <img src="/brand/logo-icon.png" alt="" className="h-8 w-8 rounded-lg transition-transform duration-300 group-hover:scale-105" />
          <span className="text-[15px] font-semibold tracking-tight">My Side Call</span>
        </Link>
        <nav className="flex items-center gap-1.5">
          <Link href="/" className="hidden sm:inline rounded-full px-3 py-1.5 text-[13px] font-medium text-ink-500 transition-colors hover:text-ink-100">
            {t("nav.home")}
          </Link>
          <Link href="/app/new" className="rounded-full bg-brand-500 px-3.5 py-1.5 text-[13px] font-semibold text-white shadow-[0_6px_16px_-8px_rgba(223,107,70,0.7)] transition-colors hover:bg-brand-600">
            {t("nav.new")}
          </Link>
          <LangToggle />
          {userMenu}
        </nav>
      </div>
    </header>
  );
}
