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
    fetch("/api/me").then((r) => r.json()).then((d) => { if (d?.viewer?.isAdmin) setOwner(d.viewer); }).catch(() => {});
  }, [status]);

  const u = data?.user;
  if (u) {
    return (
      <div className="flex items-center gap-2 pl-1.5">
        {u.image ? <img src={u.image} alt="" className="h-7 w-7 rounded-full ring-1 ring-line" referrerPolicy="no-referrer" /> : <span className="h-7 w-7 rounded-full bg-ink-800" />}
        <span className="hidden md:inline text-[13px] text-ink-300">{u.name}</span>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="rounded-full px-2 py-1 text-[12px] text-ink-500 hover:text-brand-600 transition-colors">{t("nav.signout")}</button>
      </div>
    );
  }
  if (owner) {
    const out = async () => { await fetch("/api/admin-login", { method: "DELETE" }); window.location.href = "/login"; };
    return (
      <div className="flex items-center gap-2 pl-1.5">
        <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800" title={t("nav.owner.title")}>{t("nav.owner")}</span>
        <button onClick={out} className="rounded-full px-2 py-1 text-[12px] text-ink-500 hover:text-brand-600 transition-colors">{t("nav.signout")}</button>
      </div>
    );
  }
  return null;
}
