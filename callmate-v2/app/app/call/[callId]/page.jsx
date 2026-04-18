"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const POLL_INTERVAL = 1500;

export default function CallInProgressPage({ params }) {
  const router = useRouter();
  const { callId } = params;

  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);
  const [interjectText, setInterjectText] = useState("");
  const [interjectLoading, setInterjectLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const transcriptRef = useRef(null);
  const pendingInputRef = useRef(null);
  const lastPendingKey = useRef(null);

  // Poll for call updates
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/calls/${callId}`);
        if (!res.ok) throw new Error("통화 조회 실패");
        const data = await res.json();
        setCall(data);
        if (data.status === "ended" || data.status === "failed") {
          setTimeout(() => {
            router.push(`/app/summary/${callId}`);
          }, 2000);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    poll();
    const interval = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [callId, router]);

  // Elapsed timer
  useEffect(() => {
    if (!call?.startedAt) return;
    const startTime = new Date(call.startedAt).getTime();
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [call?.startedAt]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [call?.messages]);

  // Handle pending question: vibrate + focus + ding
  useEffect(() => {
    const pq = call?.pendingQuestion;
    if (!pq) return;
    const key = `${pq.askedAt}-${pq.question}`;
    if (lastPendingKey.current === key) return;
    lastPendingKey.current = key;

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    if (pendingInputRef.current) {
      pendingInputRef.current.focus();
    }
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.1;
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  }, [call?.pendingQuestion]);

  const handleIntervene = async (textOverride) => {
    const text = (textOverride ?? interjectText).trim();
    if (!text) return;
    setInterjectLoading(true);
    try {
      const res = await fetch(`/api/calls/${callId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error("메시지 전달 실패");
      setInterjectText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setInterjectLoading(false);
    }
  };

  const handleEnd = async () => {
    if (!confirm("통화를 종료할까요?")) return;
    try {
      await fetch(`/api/calls/${callId}/end`, { method: "POST" });
    } catch (err) {
      console.error(err);
    }
  };

  const fmtTime = (s) => {
    const m = Math.floor(s / 60);
    const ss = (s % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };

  const statusBadge = {
    queued: { label: "연결 대기", color: "bg-ink-500", ring: "ring-ink-400/30" },
    ringing: { label: "신호 중", color: "bg-amber-400", ring: "ring-amber-400/30" },
    "in-progress": { label: "통화 중", color: "bg-emerald-400", ring: "ring-emerald-400/30" },
    ended: { label: "종료됨", color: "bg-ink-500", ring: "ring-ink-400/30" },
    failed: { label: "실패", color: "bg-red-500", ring: "ring-red-400/30" },
  }[call?.status] || { label: "연결 중", color: "bg-ink-500", ring: "ring-ink-400/30" };

  const messages = call?.messages || [];
  const visibleMessages = messages.filter(
    (m) => m.role === "assistant" || m.role === "bot" || m.role === "user"
  );
  const lastAssistant = visibleMessages
    .filter((m) => m.role === "assistant" || m.role === "bot")
    .slice(-1)[0];
  const lastUser = visibleMessages.filter((m) => m.role === "user").slice(-1)[0];

  const pending = call?.pendingQuestion;
  const isLive = call?.status === "in-progress";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Status header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-ink-850 via-ink-900 to-ink-850 p-6 animate-fade-in-up">
        {isLive && (
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-emerald-500/10 blur-3xl animate-aurora-drift" />
            <div className="absolute -bottom-24 -left-16 h-60 w-60 rounded-full bg-brand-500/10 blur-3xl animate-aurora-drift" style={{ animationDelay: "-6s" }}/>
          </div>
        )}
        <div className="relative flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              {isLive && (
                <span className={`absolute inline-flex h-full w-full rounded-full ${statusBadge.color} opacity-60 animate-pulse-ring`} />
              )}
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${statusBadge.color}`} />
            </span>
            <span className="text-xs font-medium text-ink-200 tracking-wide uppercase">
              {statusBadge.label}
            </span>
          </div>
          <div className="text-sm font-mono text-ink-300 tabular-nums">
            {fmtTime(elapsed)}
          </div>
        </div>
        <div className="relative text-[15px] font-medium text-ink-100 mb-0.5 flex items-center gap-2">
          <svg className="h-4 w-4 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>{call?.customer?.number || "연결 중..."}</span>
        </div>
        <div className="relative text-xs text-ink-400">
          My Side Call AI가 대신 전화를 진행 중이에요.
        </div>
      </div>

      {/* Pending Question — most urgent */}
      {pending && (
        <div
          key={`${pending.askedAt}-${pending.question}`}
          className="mt-4 relative overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 p-5 animate-spring-in"
          style={{ boxShadow: "0 0 0 4px rgba(251,191,36,0.1), 0 12px 32px -12px rgba(251,191,36,0.3)" }}
        >
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(251,191,36,0.08)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer pointer-events-none" />
          <div className="relative flex items-center gap-2 mb-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-70 animate-pulse-ring" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
            </span>
            <h3 className="text-[13px] font-semibold text-amber-200 tracking-wide uppercase">
              AI가 확인이 필요해요
            </h3>
          </div>
          {pending.context && (
            <div className="relative text-[11px] text-ink-300 mb-2">
              <span className="text-ink-500">상대 상황:</span>{" "}
              <span className="italic">{pending.context}</span>
            </div>
          )}
          <div className="relative rounded-xl border border-amber-400/20 bg-ink-900/60 p-4 mb-3">
            <div className="text-[11px] font-semibold text-amber-300/80 mb-1 uppercase tracking-wide">
              ? 질문
            </div>
            <div className="text-[15px] text-ink-100 leading-relaxed">
              {pending.question}
            </div>
          </div>
          <div className="relative space-y-2">
            <textarea
              ref={pendingInputRef}
              value={interjectText}
              onChange={(e) => setInterjectText(e.target.value)}
              rows={2}
              placeholder="한국어로 답해주세요. 예: 금요일 오후 4시 좋아요 / 아니요, 토요일만 가능합니다"
              className="input resize-none text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleIntervene();
                }
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleIntervene()}
                disabled={interjectLoading || !interjectText.trim()}
                className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50"
              >
                {interjectLoading ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>전달 중...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                    <span>AI에게 답변 전달</span>
                  </>
                )}
              </button>
              <button
                onClick={() =>
                  handleIntervene(
                    "I don't have that information. Please ask the other party to suggest options or call back later."
                  )
                }
                disabled={interjectLoading}
                className="btn-secondary px-3.5 py-2.5 text-xs"
                title="모른다는 정보일 때"
              >
                모름
              </button>
            </div>
            <p className="text-[11px] text-ink-500">
              ⌘ Cmd+Enter로 빠르게 전송. AI가 즉시 자연스러운 영어로 상대방에게 전달합니다.
            </p>
          </div>
        </div>
      )}

      {/* Latest exchange summary */}
      <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <h3 className="text-[11px] font-semibold text-ink-500 mb-3 uppercase tracking-wider">
          지금 대화 중이에요
        </h3>
        {lastAssistant && (
          <div className="mb-3">
            <div className="text-[11px] font-medium text-brand-300 mb-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400"/>
              My Side Call (AI)
            </div>
            <div className="rounded-xl border border-brand-500/20 bg-brand-500/[0.06] p-3 text-sm text-ink-100 leading-relaxed">
              {lastAssistant.message || lastAssistant.content}
            </div>
          </div>
        )}
        {lastUser && (
          <div>
            <div className="text-[11px] font-medium text-ink-400 mb-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-ink-400"/>
              상대방
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-ink-200 leading-relaxed">
              {lastUser.message || lastUser.content}
            </div>
          </div>
        )}
        {!lastAssistant && !lastUser && (
          <div className="text-sm text-ink-500 italic">
            상대방과 연결을 기다리는 중...
          </div>
        )}
      </div>

      {/* Manual intervene (when no pending) */}
      {!pending && (
        <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-sm font-semibold text-ink-100 mb-1 flex items-center gap-2">
            <span className="text-brand-400">⚡</span>
            실시간 개입 <span className="font-normal text-ink-500">(한국어로 전달)</span>
          </h3>
          <p className="text-xs text-ink-500 mb-3">
            AI에게 추가 정보를 주거나 방향을 바꿀 게 있을 때. AI가 자연스럽게 영어로 반영합니다.
          </p>
          <textarea
            value={interjectText}
            onChange={(e) => setInterjectText(e.target.value)}
            rows={2}
            placeholder="예) 아, 그리고 창가 자리로 부탁드린다고 추가해주세요"
            className="input resize-none text-sm"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleIntervene()}
              disabled={interjectLoading || !interjectText.trim()}
              className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50"
            >
              {interjectLoading ? "전달 중..." : "AI에게 전달"}
            </button>
            <button
              disabled
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs text-ink-500 cursor-not-allowed"
              title="v1.1에서 지원 예정"
            >
              📷 카메라 <span className="text-[10px]">(예정)</span>
            </button>
          </div>
        </div>
      )}

      {/* Full transcript */}
      <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink-100">전체 스크립트</h3>
          <span className="text-[10px] font-mono text-ink-500">
            {visibleMessages.length} 메시지
          </span>
        </div>
        <div
          ref={transcriptRef}
          className="p-5 max-h-80 overflow-y-auto space-y-3 text-sm"
        >
          {visibleMessages.length === 0 && (
            <div className="text-ink-500 italic text-xs">
              통화가 시작되면 스크립트가 여기에 표시됩니다.
            </div>
          )}
          {visibleMessages.map((m, i) => {
            const isAI = m.role === "assistant" || m.role === "bot";
            return (
              <div
                key={i}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}
              >
                <div
                  className={`text-[10px] font-semibold mb-1 uppercase tracking-wider ${
                    isAI ? "text-brand-300" : "text-ink-400"
                  }`}
                >
                  {isAI ? "My Side Call" : "상대방"}
                </div>
                <div
                  className={`text-[13px] leading-relaxed ${
                    isAI ? "text-ink-100" : "text-ink-300"
                  }`}
                >
                  {m.message || m.content}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* End call */}
      <button
        onClick={handleEnd}
        className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-500/20 hover:border-red-500/60 transition-all"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.07 4.18 2 2 0 0 1 5.06 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9.04 9.91"/><line x1="23" y1="1" x2="1" y2="23"/></svg>
        통화 종료
      </button>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/[0.08] px-4 py-3 text-sm text-red-200">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
