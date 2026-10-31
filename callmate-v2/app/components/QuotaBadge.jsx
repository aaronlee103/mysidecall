"use client";
// Free-tier status under the big button: "Free calls 1/3 · 8 min left", or the closed message. [NEW — hackathon]
import { useEffect, useState } from "react";
import { useLang } from "@/app/components/Lang";

export default function QuotaBadge({ className = "" }) {
  const { lang } = useLang();
  const [q, setQ] = useState(null);
  useEffect(() => { fetch("/api/calls").then((r) => r.json()).then((d) => setQ(d?.quota || null)).catch(() => {}); }, []);
  if (!q || q.unlimited) return null;
  const ko = lang === "ko";
  const used = q.usage?.calls ?? 0, min = Math.floor((q.remainingSeconds ?? 0) / 60);
  if (!q.ok) {
    const msg = q.reason === "closed" ? (ko ? "무료 체험 인원이 다 찼어요." : "The free beta is full.") : (ko ? "무료 체험이 끝났어요." : "Your free trial is used up.");
    return <p className={`text-[15px] text-ink-400 ${className}`}>{msg} {ko ? "정식 출시 때 알려드릴게요." : "We'll let you know when paid plans launch."}</p>;
  }
  return (
    <p className={`text-[14px] text-ink-500 ${className}`}>
      {ko ? `무료 통화 ${used}/${q.freeCalls} 사용 · ${min}분 남음` : `Free calls ${used}/${q.freeCalls} used · ${min} min left`}
    </p>
  );
}
