"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CallSummaryPage({ params }) {
  const { callId } = params;
  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);
  const [brief, setBrief] = useState(null);      // Korean brief by Muse Spark (hackathon)
  const [briefErr, setBriefErr] = useState(null);

  useEffect(() => {
    if (!call || call.status !== "ended" || brief) return;
    let cancelled = false;
    fetch(`/api/calls/${callId}/brief`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "한국어 요약 실패");
        if (!cancelled) setBrief(d);
      })
      .catch((e) => { if (!cancelled) setBriefErr(e.message); });
    return () => { cancelled = true; };
  }, [call, callId, brief]);

  useEffect(() => {
        let attempts = 0;
        let timer = null;
        let cancelled = false;
        const fetchCall = async () => {
                try {
                          const res = await fetch(`/api/calls/${callId}`);
                          if (!res.ok) throw new Error("통화 조회 실패");
                          const data = await res.json();
                          if (cancelled) return;
                          setCall(data);
                          // 요약이 아직 생성 중이면 3초 간격으로 최대 15회 재시도
                          if (!data.summary && attempts < 15) {
                                      attempts += 1;
                                      timer = setTimeout(fetchCall, 3000);
                          }
                } catch (err) {
                          if (!cancelled) setError(err.message);
                }
        };
        fetchCall();
        return () => {
                cancelled = true;
                if (timer) clearTimeout(timer);
        };
  }, [callId]);

  const duration =
    call?.startedAt && call?.endedAt
      ? Math.floor(
          (new Date(call.endedAt) - new Date(call.startedAt)) / 1000
        )
      : 0;
  const fmt = (s) => `${Math.floor(s / 60)}분 ${s % 60}초`;

  const outcomeLabel = {
    ended: "통화 완료",
    "customer-did-not-answer": "상대방 응답 없음",
    "customer-busy": "통화 중",
    "assistant-ended-call": "AI가 정상 종료",
    "customer-ended-call": "상대방이 종료",
    failed: "통화 실패",
  }[call?.endedReason] || call?.endedReason || "종료";

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/[0.08] px-4 py-3 text-sm text-red-200">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="max-w-2xl mx-auto flex items-center gap-2 text-sm text-ink-400">
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-brand-400" />
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link
        href="/app"
        className="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-200 transition-colors animate-fade-in-down"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        대시보드
      </Link>

      {/* Outcome card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-ink-900 via-ink-850 to-ink-900 p-8 animate-fade-in-up">
        <div aria-hidden className="aurora-bg opacity-40" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-inset ring-emerald-400/30 text-emerald-300 animate-scale-in">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
            </span>
            <span className="eyebrow text-emerald-200 border-emerald-400/20 bg-emerald-400/10">
              {outcomeLabel}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-ink-100 tracking-tight mb-1">
            통화 요약
          </h1>
          <p className="text-sm text-ink-400">
            {call?.customer?.number} · <span className="font-mono">{fmt(duration)}</span>
            {call.cost && (
              <>
                {" "}· <span className="font-mono">${call.cost.toFixed(2)}</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Korean brief — Muse Spark (Meta Model API) */}
      <div className="rounded-2xl border border-brand-500/20 bg-brand-500/[0.05] p-5 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[11px] font-semibold text-brand-300 uppercase tracking-wider">한국어 요약</h3>
          <span className="text-[10px] font-mono text-ink-500">Muse Spark</span>
        </div>
        {brief ? (
          <div className="space-y-4">
            <p className="text-sm text-ink-100 leading-relaxed whitespace-pre-wrap">{brief.summaryKo}</p>
            {brief.keyFacts?.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-ink-400 mb-1.5">확인된 내용</div>
                <ul className="space-y-1">
                  {brief.keyFacts.map((f, i) => (
                    <li key={i} className="text-[13px] text-ink-200 flex gap-2"><span className="text-brand-400">•</span><span>{f}</span></li>
                  ))}
                </ul>
              </div>
            )}
            {brief.actions?.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-ink-400 mb-1.5">할 일</div>
                <ul className="space-y-1.5">
                  {brief.actions.map((a, i) => (
                    <li key={i} className="text-[13px] text-ink-100 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                      <div className="font-medium">{a.title}</div>
                      {(a.when || a.note) && (
                        <div className="text-[12px] text-ink-400 mt-0.5">
                          {a.when && <span className="font-mono mr-2">{new Date(a.when).toLocaleString("ko-KR", { timeZone: "America/New_York", month: "long", day: "numeric", weekday: "short", hour: "numeric", minute: "2-digit" })}</span>}
                          {a.note}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {brief.followUp && (
              <p className="text-[13px] text-amber-200/90"><span className="font-semibold">다음 통화:</span> {brief.followUp}</p>
            )}
          </div>
        ) : briefErr ? (
          <p className="text-sm text-ink-400">한국어 요약을 만들지 못했습니다. ({briefErr})</p>
        ) : (
          <p className="text-sm text-ink-400 flex items-center gap-2">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-brand-400" />
            통화 내용을 한국어로 정리하는 중…
          </p>
        )}
        {call.summary && (
          <details className="mt-4">
            <summary className="text-[11px] text-ink-500 cursor-pointer">영어 원문 요약 보기</summary>
            <p className="text-[13px] text-ink-300 leading-relaxed whitespace-pre-wrap mt-2">{call.summary}</p>
          </details>
        )}
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-3 stagger">
        {call.recordingUrl && (
          <a
            href={call.recordingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary py-3"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            녹음 듣기
          </a>
        )}
        <Link href="/app/new" className="btn-primary py-3">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          비슷한 통화 다시 걸기
        </Link>
      </div>

      {/* Full transcript */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink-100">전체 스크립트</h3>
          <span className="text-[10px] font-mono text-ink-500">
            {(call.messages || []).length} 메시지
          </span>
        </div>
        <div className="p-5 space-y-3 text-sm max-h-96 overflow-y-auto">
          {(call.messages || []).map((m, i) => {
            const isAI = m.role === "assistant" || m.role === "bot";
            return (
              <div
                key={i}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 0.02, 0.3)}s` }}
              >
                <div
                  className={`text-[10px] font-semibold mb-1 uppercase tracking-wider ${
                    isAI ? "text-brand-300" : m.role === "user" ? "text-ink-400" : "text-ink-500"
                  }`}
                >
                  {isAI ? "My Side Call" : m.role === "user" ? "상대방" : "시스템"}
                </div>
                <div
                  className={`text-[13px] leading-relaxed ${
                    isAI ? "text-ink-100" : "text-ink-300"
                  }`}
                >
                  {m.message}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
