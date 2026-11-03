"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useLang } from "@/app/components/Lang";

export default function UserMenu() {
  const { data, status } = useSession();
  const { t } = useLang();
  const [owner, setOwner] = useState(null); // signed in through the owner cookie (no Facebook session)
  useEffect(() => {
    if (status !== "unauthenticated") return;
    fetch("/api/me").then((r) => r.json()).then((d) => { if (d?.viewer?.isAdmin || d?.viewer?.isJudge) setOwner(d.viewer); }).catch(() => {});
  }, [status]);

  const u = data?.user;
  if (u) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2 pl-0.5 sm:pl-1.5 whitespace-nowrap">
        {u.image ? <img src={u.image} alt="" className="h-7 w-7 rounded-full ring-1 ring-line" referrerPolicy="no-referrer" /> : <span className="h-7 w-7 rounded-full bg-ink-800" />}
        <span className="hidden md:inline text-[13px] text-ink-300">{u.name}</span>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="hidden sm:inline rounded-full px-2 py-1 text-[12px] text-ink-500 hover:text-brand-600 transition-colors">{t("nav.signout")}</button>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="sm:hidden rounded-full p-1.5 text-ink-500 hover:text-brand-600" aria-label={t("nav.signout")} title={t("nav.signout")}><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg></button>
      </div>
    );
  }
  if (owner) {
    const out = async () => { await fetch(owner.isJudge ? "/api/judge-login" : "/api/admin-login", { method: "DELETE" }); window.location.href = "/login"; };
    return (
      <div className="flex items-center gap-1.5 sm:gap-2 pl-0.5 sm:pl-1.5 whitespace-nowrap">
        <span className="rounded-full border border-amber-300 bg-amber-50 px-2 sm:px-2.5 py-1 text-[11px] font-semibold text-amber-800" title={owner.isJudge ? "Guest access" : t("nav.owner.title")}>{owner.isJudge ? "Guest" : t("nav.owner")}</span>
        <button onClick={out} className="hidden sm:inline rounded-full px-2 py-1 text-[12px] text-ink-500 hover:text-brand-600 transition-colors">{t("nav.signout")}</button>
        <button onClick={out} className="sm:hidden rounded-full p-1.5 text-ink-500 hover:text-brand-600" aria-label={t("nav.signout")} title={t("nav.signout")}><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg></button>
      </div>
    );
  }
  return null;
}
