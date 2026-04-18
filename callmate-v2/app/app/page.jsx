import Link from "next/link";

const templates = [
  {
    emoji: "🍽",
    title: "레스토랑 예약",
    example: "Cafe Bonjour에 내일 저녁 7시 4명 예약",
  },
  {
    emoji: "📞",
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
];

export default function Dashboard() {
  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-900 via-ink-850 to-ink-900 p-8 md:p-12 animate-fade-in-up">
        {/* Aurora */}
        <div aria-hidden className="aurora-bg opacity-60" />
        <div aria-hidden className="absolute inset-0 bg-grid-dim bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />

        <div className="relative">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            실시간 AI 전화
          </span>
          <h1 className="mt-5 text-3xl md:text-5xl font-bold leading-[1.05] tracking-tight">
            <span className="gradient-text">AI가 대신 전화해</span>
            <br className="hidden md:block" />
            드릴게요.
          </h1>
          <p className="mt-4 max-w-lg text-base md:text-lg text-ink-300 leading-relaxed">
            한국어로 상황만 말씀해주세요. 영어 전화는 저희가 끝까지 책임질게요.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/app/new" className="btn-primary group">
              <span>+</span>
              <span>새 통화 시작</span>
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/" className="btn-secondary">
              홈으로
            </Link>
          </div>
        </div>
      </section>

      {/* Quick templates */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-lg font-semibold tracking-tight text-ink-100">
            빠른 시작
          </h2>
          <p className="text-xs text-ink-500">자주 쓰는 템플릿</p>
        </div>
        <div className="grid md:grid-cols-2 gap-3 stagger">
          {templates.map((t) => (
            <Link
              key={t.title}
              href={`/app/new?template=${encodeURIComponent(t.title)}`}
              className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(400px circle at var(--x,50%) var(--y,50%), rgba(99,102,241,0.12), transparent 40%)",
                }}
              />
              <div className="text-2xl mb-3">{t.emoji}</div>
              <div className="font-medium text-[15px] text-ink-100 mb-1">
                {t.title}
              </div>
              <div className="text-[13px] text-ink-400 leading-relaxed">
                {t.example}
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-brand-300 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                템플릿으로 시작
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent calls placeholder */}
      <section className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-lg font-semibold tracking-tight text-ink-100 mb-4">
          최근 통화
        </h2>
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] px-6 py-10 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-ink-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <p className="text-[14px] text-ink-300 mb-1">아직 통화 기록이 없어요</p>
          <p className="text-xs text-ink-500">
            첫 통화를 시작해보세요. 녹음과 요약이 여기에 저장됩니다.
          </p>
        </div>
      </section>

      {/* Beta free banner */}
      <div className="relative overflow-hidden rounded-2xl border border-brand-500/20 bg-gradient-to-r from-brand-500/10 via-accent-violet/10 to-accent-pink/10 p-5 text-sm text-ink-200 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.06)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer" />
        <div className="relative flex items-start gap-3">
          <span className="mt-0.5 text-lg">✨</span>
          <div>
            <div className="font-medium text-ink-100">베타 기간 무료 통화</div>
            <p className="mt-0.5 text-ink-400">
              <strong className="text-ink-100">5회</strong> 제공 중입니다 · 카드 등록 불필요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
