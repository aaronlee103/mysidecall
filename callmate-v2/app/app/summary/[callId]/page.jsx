"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CallSummaryPage({ params }) {
  const { callId } = params;
  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCall = async () => {
      try {
        const res = await fetch(`/api/calls/${callId}`);
        if (!res.ok) throw new Error("통화 조회 실패");
        const data = await res.json();
        setCall(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCall();
  }, [callId]);

  const duration = call?.startedAt && call?.endedAt
    ? Math.floor((new Date(call.endedAt) - new Date(call.startedAt)) / 1000)
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
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
        ⚠️ {error}
      </div>
    );
  }

  if (!call) {
    return <div className="text-gray-500">불러오는 중...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/app"
        className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block"
      >
        ← 대시보드로
      </Link>

      {/* 결과 카드 */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">✅</span>
          <span className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
            {outcomeLabel}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-1">통화 요약</h1>
        <p className="text-sm text-gray-500 mb-6">
          {call.customer?.number} · {fmt(duration)}
          {call.cost && ` · $${call.cost.toFixed(2)}`}
        </p>

        {/* AI 생성 요약 */}
        {call.summary ? (
          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 mb-6">
            <h3 className="text-xs font-semibold text-brand-700 mb-2 uppercase tracking-wide">
              AI 요약 (영어 원문)
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {call.summary}
            </p>
            <p className="text-xs text-gray-500 mt-3 italic">
              ℹ️ 한국어 번역 요약은 v1.1에 추가될 예정입니다.
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-sm text-gray-500">
            요약이 생성되는 중이에요. 잠시 후 새로고침해 주세요.
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="grid md:grid-cols-2 gap-3">
          {call.recordingUrl && (
            <a
              href={call.recordingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 text-gray-800 text-sm font-semibold py-3 rounded-xl text-center hover:bg-gray-200 transition"
            >
              🎧 녹음 듣기
            </a>
          )}
          <Link
            href="/app/new"
            className="bg-brand-600 text-white text-sm font-semibold py-3 rounded-xl text-center hover:bg-brand-700 transition"
          >
            🔁 비슷한 통화 다시 걸기
          </Link>
        </div>
      </div>

      {/* 전체 스크립트 */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">전체 스크립트</h3>
        </div>
        <div className="p-5 space-y-3 text-sm max-h-96 overflow-y-auto">
          {(call.messages || []).map((m, i) => (
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
                  ? "My Side Call"
                  : m.role === "user"
                  ? "상대방"
                  : "시스템"}
              </div>
              <div className="text-gray-700">{m.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
