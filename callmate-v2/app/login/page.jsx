"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Mascot from "@/app/components/Mascot";

const T = {
  en: {
    title: "Sign in to make a call",
    sub: "Your calls, transcripts and summaries stay with your account.",
    fb: "Continue with Facebook",
    note: "We only read your name and email. We never post to Facebook.",
    admin: "Owner sign-in",
    back: "← Back to home",
  },
  ko: {
    title: "로그인하고 전화 걸기",
    sub: "통화 기록·대화 내용·요약은 내 계정에만 남습니다.",
    fb: "Facebook으로 계속하기",
    note: "이름과 이메일만 읽습니다. Facebook에 글을 올리지 않습니다.",
    admin: "운영자 로그인",
    back: "← 처음으로",
  },
};

function LoginInner() {
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/app";
  const error = params.get("error");
  const judgeParam = params.get("judge");
  const [code, setCode] = useState("");
  const [jErr, setJErr] = useState(null);
  const [jBusy, setJBusy] = useState(false);
  useEffect(() => { if (judgeParam && judgeParam.length > 2) setCode(judgeParam); }, [judgeParam]);
  const judgeIn = async (e) => {
    e.preventDefault(); setJBusy(true); setJErr(null);
    try {
      const r = await fetch("/api/judge-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Could not sign in");
      window.location.href = redirect;
    } catch (err) { setJErr(err.message); setJBusy(false); }
  };
  const [lang, setLang] = useState("en");
  useEffect(() => {
    try { const s = localStorage.getItem("msc_lang"); if (s === "ko" || s === "en") setLang(s); } catch {}
  }, []);
  const t = T[lang];

  return (
    <div className="msc-auth">
      <style>{`
        .msc-auth{min-height:100vh;background:#F7F2E8;color:#1E1915;font-family:Fredoka,Pretendard,ui-sans-serif,system-ui,sans-serif;display:flex;align-items:center;justify-content:center;padding:24px}
        .msc-auth .box{width:min(420px,100%);text-align:center}
        .msc-auth img{width:200px;height:auto;margin:0 auto 10px;display:block}
        .msc-auth h1{font-size:30px;letter-spacing:-.8px;font-weight:600;margin:4px 0 8px}
        .msc-auth p{color:#746d66;font-size:14px;line-height:1.6;margin:0 0 22px}
        .msc-auth .fb{width:100%;border:0;box-shadow:0 0 0 3px #F7F2E8,0 0 0 5px #1E1915;border-radius:999px;padding:14px 20px;background:#1877F2;color:#fff;font-weight:700;font-size:15px;display:flex;align-items:center;justify-content:center;gap:10px;cursor:pointer}
        .msc-auth .fb:hover{background:#166fe0}
        .msc-auth .note{font-size:12px;color:#8b8177;margin:14px 0 0}
        .msc-auth .links{display:flex;justify-content:center;margin-top:26px;font-size:12px}
        .msc-auth .links a{color:#8b8177;text-decoration:none}
        .msc-auth .links a:hover{color:#df6b46}
        .msc-auth .err{background:#fdecec;color:#8a2a2a;border-radius:12px;padding:10px 12px;font-size:13px;margin-bottom:14px}
        .msc-auth .lang{position:absolute;top:18px;right:20px;border:2px solid #1E1915;background:transparent;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:700;color:#8b8177;cursor:pointer}
        .msc-auth .lang b{color:#df6b46}
      `}</style>
      <button className="lang" onClick={() => { const n = lang === "ko" ? "en" : "ko"; setLang(n); try { localStorage.setItem("msc_lang", n); } catch {} }}>
        {lang === "ko" ? <>EN · <b>한국어</b></> : <><b>EN</b> · 한국어</>}
      </button>
      <div className="box">
        <div className="mood-bounce" style={{ width: 240, margin: "0 auto 6px" }}><Mascot mood="bounce" /></div><div style={{ fontWeight: 600, fontSize: 22, marginBottom: 28, color: "#9A9088" }}>My Side <span style={{ color: "#E2603F" }}>Call</span></div>
        <h1>{t.title}</h1>
        <p>{t.sub}</p>
        {error && <div className="err">{error === "OAuthCallback" || error === "Callback" ? "Facebook sign-in was cancelled or failed. Please try again." : `Sign-in error: ${error}`}</div>}
        <button className="fb" onClick={() => signIn("facebook", { callbackUrl: redirect })}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/></svg>
          {t.fb}
        </button>
        <p className="note">{t.note}</p>
        {judgeParam != null && (
          <form onSubmit={judgeIn} style={{ marginTop: 26, textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1E1915", marginBottom: 6 }}>{lang === "ko" ? "심사위원·게스트 접속 코드" : "Judge / guest access code"}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="access code" style={{ flex: 1, border: "2px solid #1E1915", borderRadius: 999, padding: "10px 16px", fontSize: 15, background: "#fff", fontFamily: "inherit" }} />
              <button type="submit" disabled={jBusy || !code} style={{ border: 0, borderRadius: 999, padding: "10px 18px", background: "#1E1915", color: "#F7F2E8", fontWeight: 600, fontSize: 14, cursor: "pointer", opacity: jBusy || !code ? 0.6 : 1 }}>{jBusy ? "…" : (lang === "ko" ? "입장" : "Enter")}</button>
            </div>
            {jErr && <div className="err" style={{ marginTop: 10 }}>{jErr}</div>}
            <p className="note" style={{ textAlign: "left" }}>{lang === "ko" ? "Facebook 없이 체험용으로 들어갑니다. 무료 3통·10분 동일 적용." : "Try it without Facebook. Same free beta limits: 3 calls, 10 minutes."}</p>
          </form>
        )}
        <div className="links">
          <a href="/">{t.back}</a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={null}><LoginInner /></Suspense>;
}
