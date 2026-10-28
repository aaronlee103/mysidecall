"use client";
import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/app/components/Lang";
import { SUMMARY_LANGS, readSummaryLang } from "@/lib/i18n";
import DocumentPhoto from "@/app/components/DocumentPhoto";

const VOICES = [
  { id: "Elliot", emoji: "👔" },
  { id: "Clara", emoji: "🎀" },
  { id: "Emma", emoji: "💬" },
  { id: "Nico", emoji: "🧢" },
];

function NewCallForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const template = searchParams.get("template") || "";
  const { t, lang: uiLang } = useLang();

  const [userName, setUserName] = useState("");
  const [briefing, setBriefing] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [consent, setConsent] = useState(false);
  const [voiceId, setVoiceId] = useState("Elliot");
  const [lang, setLang] = useState("en");          // summary / mid-call question language
  const [langTouched, setLangTouched] = useState(false);
  const [attachments, setAttachments] = useState("");   // document summary that rides along on the call
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  // Template → seed briefing (once, in the UI language at that moment)
  useEffect(() => {
    if (template && !briefing) {
      setBriefing(uiLang === "ko" ? `${template} ${t("new.template.details")}\n- ` : `${t("new.template.prefix")}${template}\n${t("new.template.details")}\n- `);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);

  // Landing page hands over a draft (and its language) via sessionStorage; Facebook session fills the name.
  useEffect(() => {
    let fromDraft = null;
    try {
      const raw = sessionStorage.getItem("msc_draft");
      if (raw) {
        const d = JSON.parse(raw);
        if (d?.briefing && !briefing) setBriefing(d.briefing);
        if (d?.lang && SUMMARY_LANGS.some((l) => l.code === d.lang)) fromDraft = d.lang;
        sessionStorage.removeItem("msc_draft");
      }
    } catch {}
    setLang(fromDraft || readSummaryLang(uiLang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // UI toggle follows into the summary language until the user picks one explicitly
  useEffect(() => { if (!langTouched) setLang((cur) => (cur === "en" || cur === "ko") ? uiLang : cur); }, [uiLang, langTouched]);
  useEffect(() => {
    if (session?.user?.name && !userName) setUserName(session.user.name.split(" ")[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const canSubmit = userName.trim() && briefing.trim() && phoneNumber.trim() && consent && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      try { localStorage.setItem("msc_sum_lang", lang); } catch {}
      const res = await fetch("/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, briefing, phoneNumber, voiceId, lang, attachments }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || t("new.err.create"));
      }
      const data = await res.json();
      router.push(`/app/call/${data.callId}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 animate-fade-in-down">
        <Link href="/app" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-100 transition-colors">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          {t("new.back")}
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-100">{t("new.title")}</h1>
        <p className="mt-2 text-sm text-ink-400">{t("new.sub")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-line bg-paper p-6 md:p-8 shadow-soft animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <Field label={t("new.name")} hint={t("new.name.hint")}>
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder={t("new.name.ph")} className="input" required />
        </Field>

        <Field label={t("new.brief")} hint={t("new.brief.hint")}>
          <textarea value={briefing} onChange={(e) => setBriefing(e.target.value)} rows={8} placeholder={t("new.brief.ph")} className="input font-normal leading-relaxed" required />
        </Field>

        {/* Photo of a bill / letter → Muse Spark reads it → fills briefing + phone */}
        <DocumentPhoto
          lang={lang}
          onResult={(doc) => {
            const lines = [doc.suggestedBriefing, doc.questionsToAsk?.length ? "- " + doc.questionsToAsk.join("\n- ") : ""].filter(Boolean).join("\n");
            setBriefing((b) => (b.trim() ? b.trimEnd() + "\n\n" + lines : lines));
            if (doc.phone && !phoneNumber.trim()) setPhoneNumber(doc.phone);
            const facts = [doc.sender && `From: ${doc.sender}`, doc.amountDue && `Amount due: ${doc.amountDue}`, doc.dueDate && `Due: ${doc.dueDate}`, doc.accountRef && `Reference: ${doc.accountRef}`].filter(Boolean).join("; ");
            setAttachments(`Document (${doc.docType}): ${facts}. ${doc.keyPoints?.join(" ") || ""}`.trim());
          }}
        />

        <Field label={t("new.phone")} hint={t("new.phone.hint")}>
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+1 415 555 1234" className="input font-mono" required />
        </Field>

        {/* My language → mid-call questions + summary language */}
        <Field label={t("new.lang")} hint={t("new.lang.hint")}>
          <div className="flex flex-wrap gap-2">
            {SUMMARY_LANGS.map((l) => {
              const active = lang === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => { setLang(l.code); setLangTouched(true); }}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all ${active ? "border-brand-500 bg-brand-50 text-brand-700" : "border-line bg-paper text-ink-400 hover:border-ink-700 hover:text-ink-100"}`}
                >
                  {l.native}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label={t("new.voice")} hint={t("new.voice.hint")}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {VOICES.map((v) => {
              const active = voiceId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVoiceId(v.id)}
                  className={`group relative rounded-xl border p-3 text-left transition-all duration-300 ${active ? "border-brand-500 bg-brand-50 shadow-glow" : "border-line bg-paper hover:border-ink-700"}`}
                >
                  <div className="text-lg mb-1.5">{v.emoji}</div>
                  <div className="text-sm font-medium text-ink-100">{v.id}</div>
                  <div className="text-[11px] text-ink-500">{t(`voice.${v.id}`)}</div>
                  {active && (
                    <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-white animate-scale-in">
                      <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Field>

        <label className="flex items-start gap-3 rounded-xl border border-line bg-ink-950 p-4 cursor-pointer hover:border-ink-700 transition-colors">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-ink-700 accent-brand-500" />
          <span className="text-sm text-ink-300 leading-relaxed">
            {t("new.consent")}
            <span className="block text-xs text-ink-500 mt-1">{t("new.consent.sub")}</span>
          </span>
        </label>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 animate-spring-in">
            <span>⚠️</span>
            <span className="flex-1">{error}</span>
          </div>
        )}

        <button type="submit" disabled={!canSubmit} className="btn-primary w-full py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0">
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span>{t("new.submitting")}</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>{t("new.submit")}</span>
            </>
          )}
        </button>

        <p className="text-xs text-center text-ink-500">{t("new.foot")}</p>
      </form>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
        <label className="text-[13px] font-medium text-ink-200 whitespace-nowrap">{label}</label>
        {hint && <span className="text-[11px] text-ink-500 sm:text-right">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center gap-2 text-sm text-ink-500"><span className="h-3 w-3 animate-spin rounded-full border-2 border-line border-t-brand-500" />…</div>}>
      <NewCallForm />
    </Suspense>
  );
}
