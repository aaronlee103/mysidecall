"use client";
// "My calls" — pulled from Vapi, filtered to the signed-in user by call metadata. [NEW — hackathon]
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/app/components/Lang";

export default function RecentCalls() {
  const { t, lang } = useLang();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    fetch("/api/calls").then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error || "failed"); setData(d); }).catch((e) => setErr(e.message));
  }, []);

  if (err) return <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">{err}</div>;
  if (!data) return <div className="text-sm text-ink-500 flex items-center gap-2"><span className="h-3 w-3 animate-spin rounded-full border-2 border-line border-t-brand-500" />{t("recent.loading")}</div>;
  if (!data.calls.length) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-700 bg-paper/60 px-6 py-10 text-center">
        <p className="text-[14px] text-ink-300 mb-1">{t("recent.empty")}</p>
        <p className="text-xs text-ink-500">{t("recent.empty.sub")}</p>
      </div>
    );
  }
  const locale = lang === "ko" ? "ko-KR" : "en-US";
  return (
    <ul className="divide-y divide-line rounded-2xl border border-line bg-paper shadow-soft">
      {data.calls.map((c) => {
        const live = c.status && c.status !== "ended";
        const href = live ? `/app/call/${c.id}` : `/app/summary/${c.id}`;
        const when = new Date(c.createdAt).toLocaleString(locale, { timeZone: "America/New_York", month: "short", day: "numeric", weekday: "short", hour: "numeric", minute: "2-digit" });
        return (
          <li key={c.id}>
            <Link href={href} className="flex items-start gap-4 px-5 py-4 hover:bg-ink-900/70 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
              <span className={`mt-1.5 h-2 w-2 rounded-full ${live ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-ink-700"}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[13px] text-ink-500">
                  <span>{when}</span><span>·</span><span className="font-mono">{c.to}</span>
                  <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] ${live ? "bg-emerald-50 text-emerald-700" : "bg-ink-900 text-ink-500"}`}>{t(`status.${c.status}`) !== `status.${c.status}` ? t(`status.${c.status}`) : c.status}</span>
                </div>
                <div className="mt-1 truncate text-[14px] text-ink-100">{c.briefing || t("recent.nobrief")}</div>
                {c.summary && <div className="mt-1 line-clamp-2 text-[12px] text-ink-500">{c.summary}</div>}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
