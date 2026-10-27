"use client";
import Link from "next/link";
import RecentCalls from "@/app/components/RecentCalls";
import { useLang } from "@/app/components/Lang";

const TEMPLATES = [
  { key: "restaurant", emoji: "🍽" },
  { key: "isp", emoji: "📞" },
  { key: "landlord", emoji: "🏠" },
  { key: "travel", emoji: "✈️" },
];

const Arrow = ({ className = "h-4 w-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
);

export default function Dashboard() {
  const { t } = useLang();
  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-line bg-paper p-8 md:p-12 shadow-soft animate-fade-in-up">
        <div aria-hidden className="aurora-bg" />
        <div className="relative">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            {t("dash.eyebrow")}
          </span>
          <h1 className="mt-5 text-3xl md:text-5xl font-bold leading-[1.08] tracking-tight text-ink-100">
            {t("dash.title1")}
            <br className="hidden md:block" />
            <span className="text-brand-500"> {t("dash.title2")}</span>
          </h1>
          <p className="mt-4 max-w-lg text-base md:text-lg text-ink-400 leading-relaxed">{t("dash.sub")}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/app/new" className="btn-primary group">
              <span>{t("dash.cta")}</span>
              <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/" className="btn-secondary">{t("dash.home")}</Link>
          </div>
        </div>
      </section>

      {/* Quick templates */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-lg font-semibold tracking-tight text-ink-100">{t("dash.quick")}</h2>
          <p className="text-xs text-ink-500">{t("dash.quick.sub")}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-3 stagger">
          {TEMPLATES.map((tp) => {
            const title = t(`tpl.${tp.key}`);
            return (
              <Link
                key={tp.key}
                href={`/app/new?template=${encodeURIComponent(title)}`}
                className="group relative rounded-2xl border border-line bg-paper p-5 shadow-soft transition-all duration-500 hover:-translate-y-0.5 hover:border-ink-700 hover:shadow-card-hover"
              >
                <div className="text-2xl mb-3">{tp.emoji}</div>
                <div className="font-medium text-[15px] text-ink-100 mb-1">{title}</div>
                <div className="text-[13px] text-ink-400 leading-relaxed">{t(`tpl.${tp.key}.ex`)}</div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-brand-500 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  {t("dash.template.cta")}
                  <Arrow className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent calls */}
      <section className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-lg font-semibold tracking-tight text-ink-100 mb-4">{t("dash.recent")}</h2>
        <RecentCalls />
      </section>

      {/* Beta banner */}
      <div className="relative overflow-hidden rounded-2xl border border-brand-200 bg-brand-50 p-5 text-sm animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
        <div className="relative flex items-start gap-3">
          <span className="mt-0.5 text-lg">✨</span>
          <div>
            <div className="font-medium text-ink-100">{t("dash.beta.title")}</div>
            <p className="mt-0.5 text-ink-400">{t("dash.beta.sub")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
