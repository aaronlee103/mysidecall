"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/app/components/Lang";
import { SUMMARY_LANGS } from "@/lib/i18n";

const Spinner = () => <span className="h-3 w-3 animate-spin rounded-full border-2 border-line border-t-brand-500" />;

export default function CallSummaryPage({ params }) {
  const { callId } = params;
  const { t, lang: uiLang } = useLang();
  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);
  const [briefLang, setBriefLang] = useState(null);   // null = the language chosen when the call was made
  const [brief, setBrief] = useState(null);           // brief by Muse Spark (hackathon)
  const [briefErr, setBriefErr] = useState(null);

  // Brief — in the call's language, or the one the user switches to here
  useEffect(() => {
    if (!call || call.status !== "ended") return;
    let cancelled = false;
    setBrief(null); setBriefErr(null);
    const q = briefLang ? `?lang=${briefLang}` : "";
    fetch(`/api/calls/${callId}/brief${q}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "brief failed");
        if (!cancelled) setBrief(d);
      })
      .catch((e) => { if (!cancelled) setBriefErr(e.message); });
    return () => { cancelled = true; };
  }, [call?.status, callId, briefLang]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let attempts = 0, timer = null, cancelled = false;
    const fetchCall = async () => {
      try {
        const res = await fetch(`/api/calls/${callId}`);
        if (!res.ok) throw new Error(t("sum.err.fetch"));
        const data = await res.json();
        if (cancelled) return;
        setCall(data);
        // Vapi's own summary lags a few seconds after the call ends
        if (!data.summary && attempts < 15) { attempts += 1; timer = setTimeout(fetchCall, 3000); }
      } catch (err) { if (!cancelled) setError(err.message); }
    };
    fetchCall();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, [callId]); // eslint-disable-line react-hooks/exhaustive-deps

  const duration = call?.startedAt && call?.endedAt ? Math.floor((new Date(call.endedAt) - new Date(call.startedAt)) / 1000) : 0;
  const fmt = (s) => `${Math.floor(s / 60)}${t("sum.min")} ${s % 60}${t("sum.sec")}`;
  const endKey = `end.${call?.endedReason}`;
  const outcomeLabel = t(endKey) !== endKey ? t(endKey) : call?.endedReason || t("end.default");
  const ok = ["ended", "assistant-ended-call", "customer-ended-call"].includes(call?.endedReason);
  const locale = uiLang === "ko" ? "ko-KR" : "en-US";
  const activeLang = brief?.lang || briefLang || call?.metadata?.lang || "ko";

  if (error) {
    return <div className="max-w-2xl mx-auto"><div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><span>⚠️</span><span>{error}</span></div></div>;
  }
  if (!call) {
    return <div className="max-w-2xl mx-auto flex items-center gap-2 text-sm text-ink-500"><Spinner />{t("sum.loading")}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link href="/app" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-100 transition-colors animate-fade-in-down">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        {t("sum.back")}
      </Link>

      {/* Outcome card */}
      <div className="relative overflow-hidden rounded-2xl border border-line bg-paper p-8 shadow-soft animate-fade-in-up">
        <div aria-hidden className="aurora-bg opacity-70" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-inset animate-scale-in ${ok ? "bg-emerald-50 ring-emerald-200 text-emerald-700" : "bg-amber-50 ring-amber-200 text-amber-700"}`}>
              {ok
                ? <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                : <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4M12 16h.01"/><circle cx="12" cy="12" r="9"/></svg>}
            </span>
            <span className="eyebrow">{outcomeLabel}</span>
          </div>
          <h1 className="text-2xl font-bold text-ink-100 tracking-tight mb-1">{t("sum.title")}</h1>
          <p className="text-sm text-ink-500">
            <span className="font-mono">{call?.customer?.number}</span> · <span className="font-mono">{fmt(duration)}</span>
            {call.cost != null && <> · <span className="font-mono">${Number(call.cost).toFixed(2)}</span></>}
          </p>
        </div>
      </div>

      {/* Brief — Muse Spark (Meta Model API), in the client's language */}
      <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-5 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="text-[11px] font-semibold text-brand-700 uppercase tracking-wider">{t("sum.brief")}</h3>
          <div className="flex items-center gap-2">
            <select
              value={activeLang}
              onChange={(e) => setBriefLang(e.target.value)}
              className="rounded-full border border-brand-200 bg-paper px-2.5 py-1 text-[11px] font-medium text-ink-300 outline-none focus:border-brand-500"
              aria-label="Summary language"
            >
              {SUMMARY_LANGS.map((l) => <option key={l.code} value={l.code}>{l.native}</option>)}
            </select>
            <span className="text-[10px] font-mono text-ink-500">Muse Spark</span>
          </div>
        </div>
        {brief ? (
          <div className="space-y-4">
            <p className="text-sm text-ink-100 leading-relaxed whitespace-pre-wrap">{brief.summary || brief.summaryKo}</p>
            {brief.keyFacts?.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-ink-500 mb-1.5">{t("sum.facts")}</div>
                <ul className="space-y-1">
                  {brief.keyFacts.map((f, i) => <li key={i} className="text-[13px] text-ink-200 flex gap-2"><span className="text-brand-500">•</span><span>{f}</span></li>)}
                </ul>
              </div>
            )}
            {brief.actions?.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-ink-500 mb-1.5">{t("sum.actions")}</div>
                <ul className="space-y-1.5">
                  {brief.actions.map((a, i) => (
                    <li key={i} className="text-[13px] text-ink-100 rounded-lg border border-line bg-paper px-3 py-2">
                      <div className="font-medium">{a.title}</div>
                      {(a.when || a.note) && (
                        <div className="text-[12px] text-ink-500 mt-0.5">
                          {a.when && <span className="font-mono mr-2">{new Date(a.when).toLocaleString(locale, { timeZone: "America/New_York", month: "short", day: "numeric", weekday: "short", hour: "numeric", minute: "2-digit" })}</span>}
                          {a.note}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {brief.followUp && <p className="text-[13px] text-amber-800"><span className="font-semibold">{t("sum.followup")}</span> {brief.followUp}</p>}
          </div>
        ) : briefErr ? (
          <p className="text-sm text-ink-500">{t("sum.brief.err")} <span className="text-ink-600">({briefErr})</span></p>
        ) : (
          <p className="text-sm text-ink-500 flex items-center gap-2"><Spinner />{t("sum.brief.wait")}</p>
        )}
        {call.summary && (
          <details className="mt-4">
            <summary className="text-[11px] text-ink-500 cursor-pointer hover:text-ink-300">{t("sum.en")}</summary>
            <p className="text-[13px] text-ink-300 leading-relaxed whitespace-pre-wrap mt-2">{call.summary}</p>
          </details>
        )}
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-3 stagger">
        {call.recordingUrl && (
          <a href={call.recordingUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary py-3">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            {t("sum.listen")}
          </a>
        )}
        <Link href="/app/new" className="btn-primary py-3">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          {t("sum.again")}
        </Link>
      </div>

      {/* Full transcript */}
      <div className="rounded-2xl border border-line bg-paper shadow-soft animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <div className="px-5 py-3 border-b border-line flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink-100">{t("sum.transcript")}</h3>
          <span className="text-[10px] font-mono text-ink-500">{(call.messages || []).length} {t("sum.msgs")}</span>
        </div>
        <div className="p-5 space-y-3 text-sm max-h-96 overflow-y-auto">
          {(call.messages || []).map((m, i) => {
            const isAI = m.role === "assistant" || m.role === "bot";
            return (
              <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(i * 0.02, 0.3)}s` }}>
                <div className={`text-[10px] font-semibold mb-1 uppercase tracking-wider ${isAI ? "text-brand-600" : m.role === "user" ? "text-ink-400" : "text-ink-500"}`}>
                  {isAI ? "My Side Call" : m.role === "user" ? t("sum.them") : t("sum.system")}
                </div>
                <div className={`text-[13px] leading-relaxed ${isAI ? "text-ink-100" : "text-ink-300"}`}>{m.message}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
