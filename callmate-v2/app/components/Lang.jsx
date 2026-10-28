"use client";
// Language context for /app — EN default, 한국어 toggle, shared with the landing via localStorage.  [NEW — hackathon]
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STR, readUiLang } from "@/lib/i18n";

const Ctx = createContext({ lang: "en", setLang: () => {}, t: (k) => k });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState("en");
  useEffect(() => { setLangState(readUiLang()); }, []);
  useEffect(() => { try { document.documentElement.lang = lang; } catch {} }, [lang]);
  const value = useMemo(() => ({
    lang,
    setLang: (l) => { setLangState(l); try { localStorage.setItem("msc_lang", l); } catch {} },
    t: (k) => STR[lang]?.[k] ?? STR.en[k] ?? k,
  }), [lang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang() { return useContext(Ctx); }

export function LangToggle({ className = "" }) {
  const { lang, setLang } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "ko" ? "en" : "ko")}
      className={`rounded-full border border-line bg-paper px-2.5 sm:px-3 py-1.5 text-[12px] font-semibold text-ink-500 whitespace-nowrap transition-colors hover:border-ink-700 hover:text-ink-100 ${className}`}
      aria-label="Switch language"
    >
      <span className="hidden sm:inline">{lang === "ko" ? <>EN · <span className="text-brand-500">한국어</span></> : <><span className="text-brand-500">EN</span> · 한국어</>}</span>
      <span className="sm:hidden">{lang === "ko" ? "EN" : "한국어"}</span>
    </button>
  );
}
