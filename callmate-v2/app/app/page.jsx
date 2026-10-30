"use client";
// Dashboard — one big button, four doodles, two pills, your calls. Same shape as the landing.
import Link from "next/link";
import RecentCalls from "@/app/components/RecentCalls";
import { useLang } from "@/app/components/Lang";
import Mascot from "@/app/components/Mascot";

export default function Dashboard() {
  const { t } = useLang();
  return (
    <div className="space-y-12">
      <section className="flex flex-col items-center text-center gap-6 pt-2 sm:pt-4">
        <Mascot mood="wave" className="w-[260px] sm:w-[360px]" />
        <h1 className="text-[40px] sm:text-[56px] leading-[1] font-semibold tracking-tight text-ink-100 max-w-[14ch]">{t("dash.title1")}</h1>
        <Link href="/app/new" className="btn-primary text-[22px] sm:text-[26px] px-8 py-5 gap-3">
          <svg className="h-[1em] w-[1em]" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>
          {t("dash.cta")}
        </Link>
      </section>

      <section className="flex flex-wrap justify-center gap-3 border-t-2 border-dashed border-line pt-8">
        <Link href="/app/muse" className="rounded-full border-2 border-ink-100 bg-ink-100 px-6 py-3 text-[16px] font-medium text-ink-950 transition-transform hover:-translate-y-0.5">{t("a.muse")}</Link>
        <Link href="/app/agents" className="btn-secondary text-[16px]">{t("a.mcp")}</Link>
      </section>

      <section className="border-t-2 border-dashed border-line pt-8">
        <h2 className="text-[20px] font-semibold text-ink-100 mb-4">{t("dash.recent")}</h2>
        <RecentCalls />
      </section>
    </div>
  );
}
