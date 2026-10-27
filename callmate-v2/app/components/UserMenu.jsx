"use client";
import { useSession, signOut } from "next-auth/react";
import { useLang } from "@/app/components/Lang";

export default function UserMenu() {
  const { data } = useSession();
  const { t } = useLang();
  const u = data?.user;
  if (!u) return null;
  return (
    <div className="flex items-center gap-2 pl-1.5">
      {u.image ? <img src={u.image} alt="" className="h-7 w-7 rounded-full ring-1 ring-line" referrerPolicy="no-referrer" /> : <span className="h-7 w-7 rounded-full bg-ink-800" />}
      <span className="hidden md:inline text-[13px] text-ink-300">{u.name}</span>
      <button onClick={() => signOut({ callbackUrl: "/" })} className="rounded-full px-2 py-1 text-[12px] text-ink-500 hover:text-brand-600 transition-colors">{t("nav.signout")}</button>
    </div>
  );
}
