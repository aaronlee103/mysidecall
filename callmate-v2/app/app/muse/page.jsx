"use client";
// "Ask Muse" — chat with Muse Spark, which has a phone.  [NEW — hackathon]
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLang } from "@/app/components/Lang";

const TOOL_LABEL = {
  place_call: { en: "Calling", ko: "전화 거는 중" },
  get_call: { en: "Checking the call", ko: "통화 확인" },
  answer_question: { en: "Answering the AI", ko: "AI에게 답 전달" },
  end_call: { en: "Ending call", ko: "통화 종료" },
  call_owner: { en: "Calling you", ko: "사장님께 전화" },
  list_calls: { en: "Listing calls", ko: "통화 목록" },
};

export default function MusePage() {
  const { t, lang: uiLang } = useLang();
  const [lang, setLang] = useState("en");
  const [phone, setPhone] = useState("");
  const [thread, setThread] = useState([]);   // wire messages for the API
  const [view, setView] = useState([]);       // what we render
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { try { setLang(localStorage.getItem("msc_sum_lang") || uiLang); setPhone(localStorage.getItem("msc_owner_phone") || ""); } catch {} }, [uiLang]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [view, busy]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || busy) return;
    setInput("");
    const next = [...thread, { role: "user", content: msg }];
    setThread(next);
    setView((v) => [...v, { who: "user", text: msg }]);
    setBusy(true);
    try {
      const r = await fetch("/api/muse/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next, lang, phone }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "failed");
      setThread(d.messages);
      const events = (d.toolEvents || []).map((e) => ({ who: "tool", name: e.name, args: e.args, result: e.result }));
      setView((v) => [...v, ...events, { who: "muse", text: d.reply }]);
    } catch (e) {
      setView((v) => [...v, { who: "muse", text: `⚠️ ${e.message}` }]);
    } finally { setBusy(false); }
  };

  const examples = lang === "ko"
    ? ["내일 치과 예약 3시를 4시로 바꿔 줘. 번호는 +1 201 555 0123, 이름은 Aaron.", "내일 아침 7시에 전화로 깨워 줘.", "지금 진행 중인 통화 어떻게 되고 있어?"]
    : ["Call +1 201 555 0123 and move my dentist appointment tomorrow from 3 pm to 4 pm. Name is Aaron.", "Wake me up with a call tomorrow at 7 am.", "How is my call going?"];

  return (
    <div className="max-w-2xl mx-auto flex flex-col" style={{ minHeight: "calc(100vh - 160px)" }}>
      <div className="animate-fade-in-down mb-4">
        <Link href="/app" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-100 transition-colors">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          {t("new.back")}
        </Link>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-100">{t("muse.title")}</h1>
            
          </div>
          <span className="shrink-0 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[10px] font-mono text-brand-700">Muse Spark</span>
        </div>
        {!phone && <p className="mt-2 text-[12px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">{t("muse.nophone")} <Link href="/app/agents" className="underline">{t("muse.nophone.link")}</Link></p>}
      </div>

      <div className="flex-1 border-t-2 border-dashed border-line pt-4 space-y-3 overflow-y-auto">
        {view.length === 0 && (
          <div className="space-y-2">
            <p className="text-[13px] text-ink-500">{t("muse.try")}</p>
            {examples.map((ex) => (
              <button key={ex} type="button" onClick={() => send(ex)} className="block w-full text-left rounded-2xl border-2 border-line px-4 py-3 text-[14px] text-ink-100 hover:border-ink-100 transition-colors">{ex}</button>
            ))}
          </div>
        )}
        {view.map((m, i) => m.who === "tool" ? (
          <div key={i} className="flex items-start gap-2 text-[12px] text-ink-500">
            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
            <div className="min-w-0">
              <span className="font-semibold text-ink-400">{TOOL_LABEL[m.name]?.[lang === "ko" ? "ko" : "en"] || m.name}</span>
              {m.result?.callId && <> · <Link href={m.result.status === "ended" || m.result.briefUrl ? `/app/summary/${m.result.callId}` : `/app/call/${m.result.callId}`} className="font-mono underline text-brand-600">{m.result.callId.slice(0, 8)}</Link></>}
              {m.result?.scheduledFor && <> · {new Date(m.result.scheduledFor).toLocaleString(lang === "ko" ? "ko-KR" : "en-US", { timeZone: "America/New_York", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</>}
              {m.result?.error && <span className="text-red-700"> · {m.result.error}</span>}
            </div>
          </div>
        ) : (
          <div key={i} className={`flex ${m.who === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap ${m.who === "user" ? "bg-ink-100 text-ink-950 rounded-br-md" : "border-2 border-line text-ink-100 rounded-bl-md"}`}>{m.text}</div>
          </div>
        ))}
        {busy && <div className="flex items-center gap-2 text-[13px] text-ink-500"><span className="h-3 w-3 animate-spin rounded-full border-2 border-line border-t-brand-500" />{t("muse.thinking")}</div>}
        <div ref={endRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="mt-3 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("muse.ph")} className="input flex-1" />
        <button type="submit" disabled={busy || !input.trim()} className="btn-primary px-5 disabled:opacity-50">{t("muse.send")}</button>
      </form>
    </div>
  );
}
