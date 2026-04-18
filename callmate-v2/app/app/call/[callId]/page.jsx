"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const POLL_INTERVAL = 2000; // 2초마다 상태 업데이트

export default function CallInProgressPage({ params }) {
  const router = useRouter();
  const { callId } = params;

  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);
  const [interjectText, setInterjectText] = useState("");
  const [interjectLoading, setInterjectLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const transcriptRef = useRef(null);

  // 2초마다 통화 상태 조회
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/calls/${callId}`);
        if (!res.ok) throw new Error("통화 조회 실패");
        const data = await res.json();
        setCall(data);

        if (data.status === "ended" || data.status === "failed") {
          // 2초 후 요약 화면으로 이동
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

  const handleIntervene = async () => {
    if (!interjectText.trim()) return;
    setInterjectLoading(true);
    try {
      const res = await fetch(`/api/calls/${callId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: interjectText }),
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
  const assistantMessages = messages.filter(
    (m) => m.role === "assistant" || m.role === "bot"
  );
  const userSideMessages = messages.filter((m) => m.role === "user");
  const lastAssistant = assistantMessages[assistantMessages.length - 1];
  const lastUser = userSideMessages[userSideMessages.length - 1];

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

      {/* 최근 발화 요약 — 한국어로 이해 */}
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
              "{lastAssistant.message}"
            </div>
          </div>
        )}
        {lastUser && (
          <div>
            <div className="text-xs text-gray-500 font-semibold mb-1">
              👤 상대방
            </div>
            <div className="text-sm text-gray-700 bg-gray-100 rounded-lg p-3">
              "{lastUser.message}"
            </div>
          </div>
        )}
        {!lastAssistant && !lastUser && (
          <div className="text-sm text-gray-500 italic">
            상대방과 연결을 기다리는 중...
          </div>
        )}
      </div>

      {/* 실시간 개입 */}
      <div className="mt-6 bg-white rounded-2xl p-5 border-2 border-brand-200">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <span className="text-brand-600">✨</span>
          실시간 개입 — 한국어로 정보 전달
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          AI가 모르는 정보를 물어보면 여기에 한국어로 입력하세요. AI가
          자연스럽게 영어로 전달합니다.
        </p>
        <textarea
          value={interjectText}
          onChange={(e) => setInterjectText(e.target.value)}
          rows={2}
          placeholder="예) 계정번호는 38492837이에요. 또는 오후 3시는 안 되고 4시 이후로 부탁드려요."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none text-sm"
        />
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleIntervene}
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
            📷 카메라 (예정)
          </button>
        </div>
      </div>

      {/* 전체 스크립트 */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">전체 스크립트</h3>
        </div>
        <div
          ref={transcriptRef}
          className="p-5 max-h-80 overflow-y-auto space-y-3 text-sm"
        >
          {messages.length === 0 && (
            <div className="text-gray-400 italic">
              통화가 시작되면 스크립트가 여기에 표시됩니다.
            </div>
          )}
          {messages.map((m, i) => (
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
              <div className="text-gray-700">{m.message}</div>
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
