"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewCallPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const template = searchParams.get("template");

  const [userName, setUserName] = useState("");
  const [briefing, setBriefing] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) {
      setError("AI 공개 및 녹음 동의가 필요해요");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          briefing,
          phoneNumber,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "통화 시작 실패");
      }

      const { callId } = await res.json();
      router.push(`/app/call/${callId}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">새 통화</h1>
      {template && (
        <p className="text-sm text-gray-500 mb-6">템플릿: {template}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        {/* 본인 이름 */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            본인 이름 (영어명){" "}
            <span className="text-gray-400 font-normal">
              — AI가 "on behalf of 이 이름"이라고 소개해요
            </span>
          </label>
          <input
            type="text"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="예: David Lee"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
          />
        </div>

        {/* 상황 브리핑 */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            상황 설명{" "}
            <span className="text-gray-400 font-normal">
              — 한국어로 편하게 쓰세요
            </span>
          </label>
          <textarea
            required
            value={briefing}
            onChange={(e) => setBriefing(e.target.value)}
            rows={6}
            placeholder="예) Cafe Bonjour에 내일 4월 18일 저녁 7시 4명 예약하고 싶어요. 해산물 알러지가 있어서 미리 말씀드리고, 창가 자리 가능하면 부탁드린다고 해주세요."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 누가·언제·어디·왜·결과로 뭘 원하는지 포함하면 좋아요
          </p>
        </div>

        {/* 상대 번호 */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            상대 전화번호 (미국 번호)
          </label>
          <input
            type="tel"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 415 555 1234 또는 4155551234"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            자동으로 +1 추가됩니다. 911·988 등 응급번호는 차단돼요.
          </p>
        </div>

        {/* 동의 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <label className="flex gap-3 items-start cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-amber-900">
              <strong>AI 공개 및 녹음 동의</strong> — Callmate가 통화 시작
              시 <em>"This call is handled by an AI assistant and may be
              recorded"</em>라고 자동 고지합니다. 미국 FCC 및 주별 녹음법
              (CA·IL·FL 등 12개 주 양방 동의)에 따른 법적 보호 조치입니다.
              필수 항목입니다.
            </span>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white font-semibold py-4 rounded-xl hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "연결 중..." : "📞 AI 전화 시작"}
        </button>
      </form>
    </div>
  );
}
