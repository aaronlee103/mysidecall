import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero / 새 통화 시작 */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 text-white rounded-3xl p-8 md:p-12 shadow-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          AI가 대신 전화해 드릴게요
        </h1>
        <p className="text-brand-100 mb-8 text-lg">
          한국어로 상황만 말씀해주세요.
        </p>
        <Link
          href="/app/new"
          className="inline-flex items-center gap-2 bg-white text-brand-700 px-6 py-3.5 rounded-full font-semibold text-lg hover:shadow-lg transition"
        >
          <span>+</span> 새 통화 시작
        </Link>
      </div>

      {/* 자주 쓰는 템플릿 */}
      <section>
        <h2 className="text-lg font-bold mb-4 text-gray-700">빠른 시작</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              emoji: "🍽️",
              title: "레스토랑 예약",
              example: "Cafe Bonjour에 내일 저녁 7시 4명 예약",
            },
            {
              emoji: "📺",
              title: "Comcast 고객센터",
              example: "인터넷 속도 느림 접수 + 기사 방문 요청",
            },
            {
              emoji: "🏠",
              title: "집주인·관리사무소",
              example: "누수 수리 요청 + 가능 시간 조율",
            },
            {
              emoji: "✈️",
              title: "항공사·호텔",
              example: "예약 변경·환불 문의",
            },
          ].map((t) => (
            <Link
              key={t.title}
              href={`/app/new?template=${encodeURIComponent(t.title)}`}
              className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-brand-400 hover:shadow-md transition"
            >
              <div className="text-3xl mb-2">{t.emoji}</div>
              <div className="font-semibold mb-1">{t.title}</div>
              <div className="text-sm text-gray-500">{t.example}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 최근 통화 (MVP에서는 placeholder) */}
      <section>
        <h2 className="text-lg font-bold mb-4 text-gray-700">최근 통화</h2>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center text-gray-500">
          <p className="mb-2">아직 통화 기록이 없어요</p>
          <p className="text-sm">
            첫 통화를 시작해보세요. 녹음과 요약이 여기에 저장됩니다.
          </p>
        </div>
      </section>

      {/* 무료 크레딧 안내 */}
      <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 text-sm text-brand-800">
        🎁 베타 기간 무료 통화 <strong>5회</strong> 제공 중입니다. 카드 등록 불필요.
      </div>
    </div>
  );
}
