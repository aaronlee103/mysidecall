"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const POLL_INTERVAL = 1500; // 1.5초마다 상태 업데이트 (더 빠른 반응)

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

  // 폴링
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

  // 통화 시간 카운트
  useEffect(() => {
    if (!call?.startedAt) return;
    const startTime = new Date(call.startedAt).getTime();
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [call?.startedAt]);

  // transcript 자동 스크롤
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [call?.messages]);

  // 새 pending question이 뜨면 진동·알림 + 자동 포커스
  useEffect(() => {
    const pq = call?.pendingQuestion;
    if (!pq) return;
    const key = `${pq.askedAt}-${pq.question}`;
    if (lastPendingKey.current === key) return;
    lastPendingKey.current = key;

    // 브라우저 진동 (모바일)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    // 입력칸 자동 포커스
    if (pendingInputRef.current) {
      pendingInputRef.current.focus();
    }
    // 소리 (짧은 비프) — 옵션
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
    queued: { label: "연결 대기", color: "bg-gray-500" },
    ringing: { label: "신호 중", color: "bg-amber-500" },
    "in-progress": { label: "통화 중", color: "bg-green-500" },
    ended: { label: "종료됨", color: "bg-gray-400" },
    failed: { label: "실패", color: "bg-red-500" },
  }[call?.status] || { label: "연결 중", color: "bg-gray-500" };

  const messages = call?.messages || [];
  // 디스플레이용 메시지 필터 (툴 콜 자체는 숨기고 assistant/user만 표시)
  const visibleMessages = messages.filter(
    (m) => m.role === "assistant" || m.role === "bot" || m.role === "user"
  );
  const lastAssistant = visibleMessages
    .filter((m) => m.role === "assistant" || m.role === "bot")
    .slice(-1)[0];
  const lastUser = visibleMessages.filter((m) => m.role === "user").slice(-1)[0];

  const pending = call?.pendingQuestion;

  return (
    <div className="max-w-2xl mx-auto">
      {/* 상태 헤더 */}
      <div className="bg-gray-900 text-white rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${statusBadge.color} animate-pulse`}
            />
            <span className="text-sm text-gray-300">{statusBadge.label}</span>
          </div>
          <div className="text-sm font-mono text-gray-400">
            {fmtTime(elapsed)}
          </div>
        </div>
        <div className="text-xl font-semibold mb-1">
          📞 {call?.customer?.number || "연결 중..."}
        </div>
        <div className="text-sm text-gray-400">
          Callmate AI가 대신 전화를 진행 중이에요
        </div>
      </div>

      {/* ★ Pending Question 알림 배너 — 가장 눈에 띄게 */}
      {pending && (
        <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-2xl p-5 shadow-lg ring-4 ring-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🙋</span>
            <h3 className="text-base font-bold text-amber-900">
              AI가 Aaron님 확인이 필요해요
            </h3>
          </div>
          {pending.context && (
            <div className="text-xs text-gray-600 mb-2">
              상대방 상황: <span className="italic">"{pending.context}"</span>
            </div>
          )}
          <div className="bg-white rounded-xl p-4 mb-3 border border-amber-200">
            <div className="text-sm font-semibold text-amber-900 mb-1">
              ❓ 질문
            </div>
            <div className="text-base text-gray-900 leading-relaxed">
              {pending.question}
            </div>
          </div>
          <div className="space-y-2">
            <textarea
              ref={pendingInputRef}
              value={interjectText}
              onChange={(e) => setInterjectText(e.target.value)}
              rows={2}
              placeholder="한국어로 다변하세요. 예: 금요일 오후 4시 좋아요 / 아니요, 토요일만 가능합니다"
              className="w-full px-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none text-sm bg-white"
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
                className="flex-1 bg-amber-600 text-white font-semibold py-3 rounded-xl hover:bg-amber-700 transition disabled:opacity-50"
              >
                {interjectLoading ? "전달 중..." : "✉��� AI에게 닕변 전달"}
              </button>
              <button
                onClick={() => handleIntervene("I don't have that information. Please ask the other party to suggest options or call back later.")}
                disabled={interjectLoading}
                className="px-3 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl text-xs font-medium hover:bg-gray-50"
                title="모른는 정보일 때"
              >
                모름
              </button>
            </div>
            <p className="text-[11px] text-gray-500">
              💡 Cmd+Enter로 빠를게 전송. AI가 즉시 자연스러우 영어로 상대방엢게 전달합니다.
            </p>
          </div>
        </div>
      )}

      {/* 최근 밂화 요약 */}
      <div className="mt-6 bg-white rounded-2xl p-5 border border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
          지금 이런 대화 중이에요
        </h3>
        {lastAssistant && (
          <div className="mb-3">
            <div className="text-xs text-brand-600 font-semibold mb-1">
              🤖 Callmate (AI)
            </div>
            <div className="text-sm text-gray-700 bg-brand-50 rounded-lg p-3">
              "{lastAssistant.message || lastAssistant.content}"
            </div>
          </div>
        )}
        {lastUser && (
          <div>
            <div className="text-xs text-gray-500 font-semibold mb-1">
              👤 상대방
            </div>
            <div className="text-sm text-gray-700 bg-gray-100 rounded-lg p-3">
              "{lastUser.message || lastUser.content}"
            </div>
          </div>
        )}
        {!lastAssistant && !lastUser && (
          <div className="text-sm text-gray-500 italic">
            상대방과 연결을 기다리는 중...
          </div>
        )}
      </div>

      {/* 실시간 개입 (수동) — pending이 없을 때도 사용 가늵 */}
      {!pending && (
        <div className="mt-6 bg-white rounded-2xl p-5 border-2 border-brand-200">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <span className="text-brand-600">✨</span>
            실시간 개입 — 한국어로 전보 추가
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            AI에게 추가 정보를 주거나 방햑을 바꾎고 싶을 때. AI가 자연스럭게 영어로 반영합니다.
          </p>
          <textarea
            value={interjectText}
            onChange={(e) => setInterjectText(e.target.value)}
            rows={2}
            placeholder="예) 아, 그리고 창싦 자리로 부텁드릴닢핸 추가해 주세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none text-sm"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleIntervene()}
              disabled={interjectLoading || !interjectText.trim()}
              className="flex-1 bg-brand-600 text-white font-semibold py-2.5 rounded-xl hover:bg-brand-700 transition disabled:opacity-50"
            >
              {interjectLoading ? "전달 중..." : "AI에게 전달"}
            </button>
            <button
              disabled
              className="px-4 py-2.5 bg-gray-100 text-gray-400 rounded-xl text-sm cursor-not-allowed"
              title="v1.1에서 지원 예정"
            >
              📷 카멤라 (예정)
            </button>
          </div>
        </div>
      )}

      {/* 전쾴 스크립트 */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">전체 스크립트</h3>
        </div>
        <div
          ref={transcriptRef}
          className="p-5 max-h-80 overflow-y-auto space-y-3 text-sm"
        >
          {visibleMessages.length === 0 && (
            <div className="text-gray-400 italic">
              통화가 시작되면 스크립트가 여기에 표시됩니다.
            </div>
          )}
          {visibleMessages.map((m, i) => (
            <div key={i}>
              <div
                className={`text-xs font-semibold mb-1 ${
                  m.role === "assistant" || m.role === "bot"
                    ? "text-brand-600"
                    : m.role === "user"
                    ? "text-gray-600"
                    : "text-gray-400"
                }`}
              >
                {m.role === "assistant" || m.role === "bot"
                  ? "Callmate"
                  : m.role === "user"
                  ? "상대방"
                  : "시스템"}
              </div>
              <div className="text-gray-700">{m.message || m.content}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 통화 종료 */}
      <button
        onClick={handleEnd}
        className="w-full mt-6 bg-red-500 text-white font-semibold py-3.5 rounded-xl hover:bg-red-600 transition"
      >
        🔴 통화 종료
      </button>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

