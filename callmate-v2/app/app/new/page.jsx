"use client";
import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const VOICES = [
  { id: "Elliot", label: "Elliot", sub: "차분한 남성", emoji: "👔" },
  { id: "Clara", label: "Clara", sub: "밝은 여성", emoji: "🎀" },
  { id: "Emma", label: "Emma", sub: "친근한 여성", emoji: "💬" },
  { id: "Nico", label: "Nico", sub: "젊은 남성", emoji: "🧢" },
];

function NewCallForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const template = searchParams.get("template") || "";

  const [userName, setUserName] = useState("");
  const [briefing, setBriefing] = useState(
    template
      ? `${template} 건으로 전화 부탁드려요. 상세:\n- `
      : ""
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [consent, setConsent] = useState(false);
  const [voiceId, setVoiceId] = useState("Elliot");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  // Landing page hands over a draft via sessionStorage; Facebook session fills the name.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("msc_draft");
      if (raw) { const d = JSON.parse(raw); if (d?.briefing && !briefing) setBriefing(d.briefing); sessionStorage.removeItem("msc_draft"); }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (session?.user?.name && !userName) setUserName(session.user.name.split(" ")[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const canSubmit =
    userName.trim() && briefing.trim() && phoneNumber.trim() && consent && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, briefing, phoneNumber, voiceId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "통화 생성 실패");
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
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-200 transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          대시보드
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-100">
          새 통화 브리핑
        </h1>
        <p className="mt-2 text-sm text-ink-400">
          한국어로 상황을 자세히 적어주세요. 맥락이 많을수록 AI가 더 정확하게 말합니다.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8 animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        {/* Name */}
        <Field
          label="당신의 이름"
          hint="AI가 당신을 대신할 때 쓰는 이름이에요."
        >
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="예: Aaron"
            className="input"
            required
          />
        </Field>

        {/* Briefing */}
        <Field
          label="상황 브리핑"
          hint="누구에게, 무엇을, 어떻게 말할지를 한국어로 적어주세요."
        >
          <textarea
            value={briefing}
            onChange={(e) => setBriefing(e.target.value)}
            rows={8}
            placeholder={
              "예:\nCafe Bonjour에 전화해서 내일 저녁 7시 4명 예약 부탁해요.\n이름은 Aaron으로, 창가 자리로 요청해주세요.\n혹시 자리 없으면 8시도 가능하다고 전해주세요."
            }
            className="input font-normal leading-relaxed"
            required
          />
        </Field>

        {/* Phone */}
        <Field
          label="상대 전화번호"
          hint="미국 번호만 가뉥합니다. 국가번호 포함 (+1)."
        >
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 415 555 1234"
            className="input font-mono"
            required
          />
        </Field>

        {/* Voice picker */}
        <Field label="AI 목소리" hint="전화에 쓰일 음성을 골라보세요.">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {VOICES.map((v) => {
              const active = voiceId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVoiceId(v.id)}
                  className={`group relative rounded-xl border p-3 text-left transition-all duration-300 ${
                    active
                      ? "border-brand-400/60 bg-brand-500/10 shadow-[0_0_0_1px_rgba(99,102,241,0.4),0_8px_24px_-8px_rgba(99,102,241,0.5)]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="text-lg mb-1.5">{v.emoji}</div>
                  <div className={`text-sm font-medium ${active ? "text-white" : "text-ink-100"}`}>
                    {v.label}
                  </div>
                  <div className="text-[11px] text-ink-400">{v.sub}</div>
                  {active && (
                    <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-accent-pink text-white animate-scale-in">
                      <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Field>

        {/* Consent */}
        <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 cursor-pointer hover:border-white/20 transition-colors">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/10 text-brand-500 accent-brand-500 focus:ring-brand-400"
          />
          <span className="text-sm text-ink-300 leading-relaxed">
            AI가 대신 통화하고 녹음된다는 사실을 상대에게 고지하는 데 동의합니다.
            <span className="block text-xs text-ink-500 mt-1">
              미국 FCC 및 양측동의 주법 준수를 위해 AI가 첫 마디에 안내합니다.
            </span>
          </span>
        </label>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/[0.08] px-4 py-3 text-sm text-red-200 animate-spring-in">
            <span>⚠️</span>
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-primary w-full py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span>통화 준비 중...</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>AI 전화 시작</span>
            </>
          )}
        </button>

        <p className="text-xs text-center text-ink-500">
          버튼을 누르면 AI가 상대에게 전화를 걸고, 당신은 실시간으로 중간에 끼어들 수 있어요.
        </p>
      </form>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-[13px] font-medium text-ink-200">{label}</label>
        {hint && <span className="text-[11px] text-ink-500">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-2 text-sm text-ink-400">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-brand-400" />
          로딩 중...
        </div>
      }
    >
      <NewCallForm />
    </Suspense>
  );
}
