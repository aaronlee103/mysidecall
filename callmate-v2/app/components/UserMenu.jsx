"use client";
import { useSession, signOut } from "next-auth/react";

export default function UserMenu() {
  const { data } = useSession();
  const u = data?.user;
  if (!u) return null;
  return (
    <div className="flex items-center gap-2 pl-2">
      {u.image ? <img src={u.image} alt="" className="h-7 w-7 rounded-full ring-1 ring-white/10" referrerPolicy="no-referrer" /> : <span className="h-7 w-7 rounded-full bg-white/10" />}
      <span className="hidden sm:inline text-[13px] text-ink-300">{u.name}</span>
      <button onClick={() => signOut({ callbackUrl: "/" })} className="rounded-full px-2.5 py-1 text-[12px] text-ink-500 hover:text-ink-100 transition-colors">로그아웃</button>
    </div>
  );
}
