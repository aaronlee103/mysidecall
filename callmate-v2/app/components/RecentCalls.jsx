"use client";
// "My calls" — pulled from Vapi, filtered to the signed-in user by call metadata. [NEW — hackathon]
import { useEffect, useState } from "react";
import Link from "next/link";

const STATUS = {
  queued: "대기", ringing: "연결 중", "in-progress": "통화 중", forwarding: "전환", ended: "종료",
};

export default function RecentCalls() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    fetch("/api/calls").then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error || "불러오기 실패"); setData(d); }).catch((e) => setErr(e.message));
  }, []);

  if (err) return <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4 text-sm text-red-200">{err}</div>;
  if (!data) return <div className="text-sm text-ink-400 flex items-center gap-2"><span className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-brand-400" />불러오는 중…</div>;
  if (!data.calls.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] px-6 py-10 text-center">
        <p className="text-[14px] text-ink-300 mb-1">아직 통화 기록이 없어요</p>
        <p className="text-xs text-ink-500">첫 통화를 시작해보세요. 대화 내용과 한국어 요약이 여기에 남습니다.</p>
      </div>
    );
  }
  return (
    <ul className="divide-y divide-white/5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
      {data.calls.map((c) => {
        const live = c.status && c.status !== "ended";
        const href = live ? `/app/call/${c.id}` : `/app/summary/${c.id}`;
        const when = new Date(c.createdAt).toLocaleString("ko-KR", { timeZone: "America/New_York", month: "numeric", day: "numeric", weekday: "short", hour: "numeric", minute: "2-digit" });
        return (
          <li key={c.id}>
            <Link href={href} className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors">
              <span className={`mt-1 h-2 w-2 rounded-full ${live ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-ink-600"}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[13px] text-ink-400">
                  <span>{when}</span><span>·</span><span className="font-mono">{c.to}</span>
                  <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] ${live ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-ink-400"}`}>{STATUS[c.status] || c.status}</span>
                </div>
                <div className="mt-1 truncate text-[14px] text-ink-100">{c.briefing || "(브리핑 없음)"}</div>
                {c.summary && <div className="mt-1 line-clamp-2 text-[12px] text-ink-400">{c.summary}</div>}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
