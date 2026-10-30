"use client";
// Agents page — give your AI agent a phone: owner number, agent key, MCP setup.  [NEW — hackathon]
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/app/components/Lang";
import { SUMMARY_LANGS } from "@/lib/i18n";

export default function AgentsPage() {
  const { t, lang: uiLang } = useLang();
  const [phone, setPhone] = useState("");
  const [lang, setLang] = useState("en");
  const [out, setOut] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    try { setPhone(localStorage.getItem("msc_owner_phone") || ""); setLang(localStorage.getItem("msc_sum_lang") || uiLang); } catch {}
  }, [uiLang]);

  const issue = async () => {
    setBusy(true); setErr(null);
    try {
      const r = await fetch("/api/agents/key", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, lang }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "failed");
      setOut(d);
      try { localStorage.setItem("msc_owner_phone", d.owner.phone || phone); localStorage.setItem("msc_sum_lang", lang); } catch {}
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };
  const copy = async (label, text) => { try { await navigator.clipboard.writeText(text); setCopied(label); setTimeout(() => setCopied(""), 1500); } catch {} };

  const claudeCfg = out ? JSON.stringify({ mcpServers: { "my-side-call": { url: out.mcpUrl, headers: { Authorization: `Bearer ${out.key}` } } } }, null, 2) : "";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="animate-fade-in-down">
        <Link href="/app" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-100 transition-colors">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          {t("new.back")}
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-100">{t("agents.title")}</h1>
        
      </div>

      <div className="space-y-5 animate-fade-in-up">
        <div className="space-y-2">
          <label className="text-[13px] font-medium text-ink-200">{t("agents.phone")}</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 201 555 0123" className="input font-mono" />
          <p className="text-[11px] text-ink-500">{t("agents.phone.hint")}</p>
        </div>
        <div className="space-y-2">
          <label className="text-[13px] font-medium text-ink-200">{t("new.lang")}</label>
          <div className="flex flex-wrap gap-2">
            {SUMMARY_LANGS.map((l) => (
              <button key={l.code} type="button" onClick={() => setLang(l.code)} className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all ${lang === l.code ? "border-brand-500 bg-brand-50 text-brand-700" : "border-line bg-paper text-ink-400 hover:border-ink-700"}`}>{l.native}</button>
            ))}
          </div>
        </div>
        {err && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</div>}
        <button type="button" onClick={issue} disabled={busy} className="btn-primary py-3 px-6 disabled:opacity-60">{busy ? "…" : t("agents.issue")}</button>
      </div>

      {out && (
        <div className="border-t-2 border-dashed border-line pt-6 space-y-5 animate-fade-in-up">
          <div>
            <div className="text-[11px] font-semibold text-brand-700 uppercase tracking-wider mb-1.5">{t("agents.key")}</div>
            <div className="flex gap-2">
              <code className="flex-1 min-w-0 truncate rounded-lg border border-line bg-paper px-3 py-2 text-[12px] font-mono text-ink-200">{out.key}</code>
              <button type="button" onClick={() => copy("key", out.key)} className="btn-secondary py-2 px-3 text-[12px]">{copied === "key" ? "✓" : t("agents.copy")}</button>
            </div>
            <p className="mt-1.5 text-[11px] text-ink-500">{t("agents.key.hint")}</p>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-brand-700 uppercase tracking-wider mb-1.5">MCP URL</div>
            <div className="flex gap-2">
              <code className="flex-1 min-w-0 truncate rounded-lg border border-line bg-paper px-3 py-2 text-[12px] font-mono text-ink-200">{out.mcpUrl}</code>
              <button type="button" onClick={() => copy("url", out.mcpUrl)} className="btn-secondary py-2 px-3 text-[12px]">{copied === "url" ? "✓" : t("agents.copy")}</button>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-brand-700 uppercase tracking-wider mb-1.5">{t("agents.claude")}</div>
            <pre className="rounded-lg border border-line bg-ink-100 text-ink-950 p-3 text-[11.5px] leading-relaxed overflow-x-auto">{claudeCfg}</pre>
            <button type="button" onClick={() => copy("cfg", claudeCfg)} className="mt-2 btn-secondary py-2 px-3 text-[12px]">{copied === "cfg" ? "✓" : t("agents.copy")}</button>
          </div>
          <div className="text-[12.5px] text-ink-300 leading-relaxed">
            <div className="font-semibold text-ink-100 mb-1">{t("agents.tools")}</div>
            <code className="text-[11.5px]">place_call · get_call · answer_question · end_call · call_owner · list_calls</code>
          </div>
          <Link href="/app/muse" className="btn-primary py-2.5 px-5 text-[13px]">{t("agents.trymuse")} →</Link>
        </div>
      )}
    </div>
  );
}
