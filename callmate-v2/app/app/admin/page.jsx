"use client";
// Owner dashboard: visitors come from Vercel Web Analytics; this page shows sign-ins and calls.  [NEW — hackathon]
import { useEffect, useState } from "react";
import Link from "next/link";

const when = (s) => (s ? new Date(s).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—");
const who = (u) => (u.name || u.id).replace(/^fb:/, "");

export default function AdminPage() {
  const [d, setD] = useState(null); const [err, setErr] = useState("");
  useEffect(() => { fetch("/api/admin/activity").then(async (r) => { const j = await r.json(); if (!r.ok) throw new Error(j.error || r.status); setD(j); }).catch((e) => setErr(String(e.message || e))); }, []);
  if (err) return <p className="text-ink-400">{err === "owner only" ? "Owner only." : err}</p>;
  if (!d) return <p className="text-ink-400">Loading…</p>;
  const Stat = ({ n, l }) => (<div className="rounded-2xl border-2 border-line bg-paper px-5 py-4"><div className="text-[34px] font-semibold leading-none text-ink-100">{n}</div><div className="mt-1 text-[13px] text-ink-500">{l}</div></div>);
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between"><Link href="/app" className="text-[14px] text-ink-500 hover:text-ink-100">← Dashboard</Link><a href="https://vercel.com/aaronlee103-5687s-projects/mysidecall/analytics" target="_blank" rel="noreferrer" className="btn-secondary text-[14px]">Visitors (Vercel Analytics) ↗</a></div>
      <h1 className="text-[36px] font-semibold text-ink-100">Who's using it</h1>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Stat n={d.totals.users} l="people signed in" /><Stat n={d.totals.logins} l="sign-ins" /><Stat n={d.totals.callers} l="people who called" /><Stat n={d.totals.calls} l="calls" /><Stat n={d.totals.minutes} l="minutes on the phone" />
      </div>
      {!d.loginsEnabled && <p className="rounded-xl border-2 border-dashed border-line px-4 py-3 text-[14px] text-ink-500">Sign-in log is off — add a Vercel Blob store (BLOB_READ_WRITE_TOKEN) to record who signs in.{d.loginsError ? ` (${d.loginsError})` : ""}</p>}
      <section><h2 className="mb-3 text-[20px] font-semibold text-ink-100">Signed in</h2>
        <table className="w-full text-[14px]"><thead className="text-left text-ink-500"><tr><th className="py-2">Who</th><th>How</th><th>First</th><th>Last</th><th className="text-right">Times</th></tr></thead><tbody>
          {d.users.map((u) => (<tr key={u.id} className="border-t border-line"><td className="py-2 text-ink-100">{who(u)}<span className="ml-2 text-[12px] text-ink-500">{u.id}</span></td><td className="text-ink-400">{u.method}</td><td className="text-ink-400">{when(u.first)}</td><td className="text-ink-400">{when(u.last)}</td><td className="text-right text-ink-100">{u.logins}</td></tr>))}
          {!d.users.length && <tr><td colSpan={5} className="py-3 text-ink-500">No sign-ins recorded yet.</td></tr>}
        </tbody></table></section>
      <section><h2 className="mb-3 text-[20px] font-semibold text-ink-100">Made calls</h2>
        <table className="w-full text-[14px]"><thead className="text-left text-ink-500"><tr><th className="py-2">Who</th><th>Via</th><th>Last call</th><th className="text-right">Calls</th><th className="text-right">Min</th></tr></thead><tbody>
          {d.callers.map((u) => (<tr key={u.id} className="border-t border-line"><td className="py-2 text-ink-100">{who(u)}<span className="ml-2 text-[12px] text-ink-500">{u.id}</span></td><td className="text-ink-400">{u.via.join(", ") || "web"}</td><td className="text-ink-400">{when(u.last)}</td><td className="text-right text-ink-100">{u.calls}</td><td className="text-right text-ink-100">{Math.round(u.seconds / 60)}</td></tr>))}
        </tbody></table></section>
    </div>
  );
}
