import Link from "next/link";

// Fauna Robotics 스타일 리디자인 v2 — 로봇 픽토그램 로고타입,
// "대신 전화해주는 로봇 친구" 마스코트(애니메이션), 스크롤 리빌 모션.
// /app 내부 화면은 기존 다크 테마 유지.

const C = {
  bg: "bg-[#F6EFE2]",
  card: "bg-[#ECE4D2]",
  ink: "text-[#26211A]",
  terra: "bg-[#DE7150]",
  terraHover: "hover:bg-[#c9603f]",
};

const MOTION_CSS = `
@keyframes msc-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes msc-blink { 0%, 90%, 100% { transform: scaleY(1); } 94% { transform: scaleY(0.08); } }
@keyframes msc-ring { 0%, 100% { transform: rotate(0deg); } 6% { transform: rotate(-6deg); } 12% { transform: rotate(5deg); } 18% { transform: rotate(-3deg); } 24% { transform: rotate(0deg); } }
@keyframes msc-drift { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(14px,-16px) rotate(8deg); } }
@keyframes msc-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@keyframes msc-shadow { 0%,100% { transform: scaleX(1); opacity: .18; } 50% { transform: scaleX(.82); opacity: .1; } }
.msc-float { animation: msc-float 5s ease-in-out infinite; }
.msc-blink { transform-origin: center; transform-box: fill-box; animation: msc-blink 4.5s ease-in-out infinite; }
.msc-ring { transform-origin: 128px 150px; animation: msc-ring 3.6s ease-in-out infinite; }
.msc-drift { animation: msc-drift 9s ease-in-out infinite; }
.msc-shadow { transform-origin: center; transform-box: fill-box; animation: msc-shadow 5s ease-in-out infinite; }
@supports (animation-timeline: view()) {
  .msc-reveal { animation: msc-rise .8s cubic-bezier(.2,.7,.2,1) both; animation-timeline: view(); animation-range: entry 0% entry 35%; }
}
@media (prefers-reduced-motion: reduce) {
  .msc-float, .msc-blink, .msc-ring, .msc-drift, .msc-shadow, .msc-reveal { animation: none !important; }
}
`;

// ── 로고타입: Fauna식 로봇 픽토그램 + 소문자 워드마크 ──
function LogoMark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden>
      {/* 안테나 */}
      <rect x="15.6" y="2" width="2.8" height="5" rx="1.4" fill="#26211A" />
      <circle cx="17" cy="2.2" r="1.8" fill="#DE7150" />
      {/* 머리 */}
      <rect x="6" y="6.5" width="22" height="13" rx="5" fill="#26211A" />
      {/* 눈 */}
      <circle cx="13" cy="13" r="2.2" fill="#F6EFE2" />
      <circle cx="21" cy="13" r="2.2" fill="#F6EFE2" />
      {/* 몸통 */}
      <rect x="9.5" y="21.5" width="15" height="8.5" rx="3.5" fill="#26211A" />
      {/* 팔 */}
      <rect x="2" y="21.5" width="6" height="2.8" rx="1.4" fill="#26211A" />
      <rect x="26" y="21.5" width="6" height="2.8" rx="1.4" fill="#26211A" />
      {/* 다리 */}
      <rect x="12" y="30.5" width="3.4" height="3" rx="1.5" fill="#26211A" />
      <rect x="18.6" y="30.5" width="3.4" height="3" rx="1.5" fill="#26211A" />
    </svg>
  );
}

function Wordmark({ className = "" }) {
  return (
    <span className={`font-extrabold lowercase tracking-[-0.04em] leading-none ${className}`}>
      my side call
    </span>
  );
}

// ── 히어로 마스코트: 수화기 들고 대신 전화하는 로봇 (애니메이션) ──
function HeroRobot({ className = "" }) {
  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 220 260" width="100%" height="100%" fill="none">
        {/* 그림자 */}
        <ellipse className="msc-shadow" cx="110" cy="246" rx="62" ry="10" fill="#26211A" opacity="0.18" />
        <g className="msc-float">
          {/* 안테나 (노랑) */}
          <rect x="66" y="18" width="8" height="30" rx="4" fill="#D9C544" transform="rotate(-24 70 33)" />
          <rect x="146" y="18" width="8" height="30" rx="4" fill="#D9C544" transform="rotate(24 150 33)" />
          {/* 머리 */}
          <rect x="52" y="40" width="116" height="66" rx="26" fill="#A9B7A0" />
          {/* 바이저 */}
          <rect x="66" y="54" width="88" height="38" rx="16" fill="#26211A" />
          {/* 눈 (깜빡임) */}
          <circle className="msc-blink" cx="94" cy="73" r="7" fill="#F6EFE2" />
          <circle className="msc-blink" cx="126" cy="73" r="7" fill="#F6EFE2" />
          {/* 목 */}
          <rect x="100" y="106" width="20" height="10" rx="4" fill="#8B9A83" />
          {/* 몸통 */}
          <rect x="62" y="116" width="96" height="76" rx="24" fill="#E8E0CF" />
          {/* 가슴 버튼 */}
          <circle cx="110" cy="150" r="10" fill="#DE7150" />
          <rect x="96" y="168" width="28" height="5" rx="2.5" fill="#C9C0AC" />
          {/* 왼팔 */}
          <rect x="46" y="124" width="18" height="52" rx="9" fill="#A9B7A0" />
          {/* 오른팔 — 수화기 들고 귀에 (살짝 흔들림) */}
          <g className="msc-ring">
            <rect x="150" y="96" width="18" height="52" rx="9" fill="#A9B7A0" transform="rotate(-38 159 122)" />
            <g transform="rotate(-24 168 74)">
              <rect x="146" y="62" width="44" height="14" rx="7" fill="#26211A" />
              <rect x="142" y="58" width="14" height="22" rx="7" fill="#26211A" />
              <rect x="180" y="58" width="14" height="22" rx="7" fill="#26211A" />
            </g>
          </g>
          {/* 전화선 (꼬불꼬불) */}
          <path
            d="M186 84 q14 10 6 22 q-8 12 4 20 q12 8 2 20 q-8 10 0 20"
            stroke="#26211A"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* 다리 */}
          <rect x="80" y="192" width="20" height="34" rx="10" fill="#A9B7A0" />
          <rect x="120" y="192" width="20" height="34" rx="10" fill="#A9B7A0" />
          {/* 발 */}
          <rect x="72" y="222" width="34" height="14" rx="7" fill="#D9C544" />
          <rect x="114" y="222" width="34" height="14" rx="7" fill="#D9C544" />
        </g>
      </svg>
    </div>
  );
}

function Deco({ v = 0 }) {
  const sets = [
    ["bg-[#4C9A8B] rounded-tl-full", "bg-[#D9A83F]", "bg-[#C39BD3] rounded-full"],
    ["bg-[#DE7150] rounded-t-full", "bg-[#7E9EBB]", "bg-[#D9A83F] rounded-br-full"],
    ["bg-[#C39BD3]", "bg-[#4C9A8B] rounded-full", "bg-[#DE7150] rounded-tr-full"],
    ["bg-[#D9A83F] rounded-bl-full", "bg-[#DE7150] rounded-full", "bg-[#7E9EBB]"],
  ];
  const s = sets[v % sets.length];
  return (
    <div className="flex items-end justify-center gap-1 h-8" aria-hidden>
      <span className={`h-4 w-4 ${s[0]}`} />
      <span className={`h-6 w-4 ${s[1]}`} />
      <span className={`h-3 w-3 ${s[2]}`} />
    </div>
  );
}

export default function Home() {
  const tallyFormId = process.env.NEXT_PUBLIC_TALLY_FORM_ID || "XXXXXX";

  return (
    <main className={`relative min-h-screen overflow-hidden ${C.bg} ${C.ink} antialiased`}>
      <style dangerouslySetInnerHTML={{ __html: MOTION_CSS }} />

      {/* Nav — 로봇 픽토그램 로고타입 */}
      <nav className="sticky top-0 z-50 bg-[#F6EFE2]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark />
            <Wordmark className="text-[19px] text-[#26211A]" />
          </Link>
          <div className="flex items-center gap-2">
            <div className={`hidden sm:flex items-center gap-1 rounded-full ${C.card} px-2 py-1.5`}>
              <a href="#how" className="rounded-full px-3 py-1.5 text-[13px] font-medium text-[#5D564A] transition-colors hover:text-[#26211A]">어떻게 작동해요</a>
              <a href="#pricing" className="rounded-full px-3 py-1.5 text-[13px] font-medium text-[#5D564A] transition-colors hover:text-[#26211A]">요금</a>
              <a href="#faq" className="hidden md:inline-flex rounded-full px-3 py-1.5 text-[13px] font-medium text-[#5D564A] transition-colors hover:text-[#26211A]">FAQ</a>
              <Link href="/app" className="rounded-full px-3 py-1.5 text-[13px] font-medium text-[#5D564A] transition-colors hover:text-[#26211A]">앱 열기</Link>
            </div>
            <a href="#waitlist" className={`inline-flex items-center rounded-full ${C.terra} ${C.terraHover} px-4 py-2 text-[13px] font-semibold text-white transition-colors`}>
              대기자 등록
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 md:pt-28 pb-20 px-6">
        {/* 떠다니는 배경 도형 */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <span className="msc-drift absolute left-[8%] top-[14%] h-8 w-8 rounded-full bg-[#D9A83F]/30" />
          <span className="msc-drift absolute right-[10%] top-[22%] h-10 w-10 rounded-tl-full bg-[#4C9A8B]/25" style={{ animationDelay: "-3s" }} />
          <span className="msc-drift absolute left-[16%] bottom-[18%] h-6 w-6 bg-[#C39BD3]/30" style={{ animationDelay: "-6s" }} />
          <span className="msc-drift absolute right-[18%] bottom-[30%] h-7 w-7 rounded-t-full bg-[#DE7150]/25" style={{ animationDelay: "-1.5s" }} />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#ECE4D2] px-4 py-1.5 text-[12px] font-semibold text-[#5D564A]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4C9A8B]" />
            재미 한인을 위한 영어 전화 대행 AI
          </span>
          <h1 className="mt-7 text-[42px] md:text-[64px] font-bold leading-[1.05] tracking-tight">
            영어 전화,
            <br />
            대신 걸어드려요.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[#5D564A] leading-relaxed max-w-2xl mx-auto">
            고객센터·집주인·보험사에 한국어로 상황만 말씀해주세요.
            <br className="hidden md:block" />
            <strong className="text-[#26211A] font-semibold">AI가 자연스러운 영어로 대신 전화</strong>
            하고, 결과를 한국어로 요약해 드립니다.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a href="#waitlist" className={`inline-flex items-center gap-2 rounded-full ${C.terra} ${C.terraHover} px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5`}>
              무료 베타 대기자 등록
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
            <a href="#demo" className="inline-flex items-center gap-2 rounded-full bg-[#26211A] px-7 py-3.5 text-[15px] font-semibold text-[#F6EFE2] transition-all hover:-translate-y-0.5 hover:bg-black">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              데모 보기 (1분)
            </a>
          </div>
          <p className="mt-5 text-xs text-[#948C7B]">
            베타 초대장은 <strong className="text-[#5D564A]">무료 통화 5회</strong> 제공 · 카드 등록 불필요
          </p>
        </div>

        {/* Hero visual — 로봇 마스코트 + 통화 카드 */}
        <div className="mt-16 md:mt-28 max-w-4xl mx-auto">
          <div className="relative">
            {/* 로봇 친구 — 카드 왼쪽에서 대신 전화 중 */}
            <HeroRobot className="hidden md:block absolute -left-6 lg:-left-20 -top-20 w-[200px] z-10" />
            <div className="md:ml-40 rounded-[28px] bg-[#26211A] p-6 md:p-8 shadow-[0_24px_60px_-24px_rgba(38,33,26,0.45)]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#7CC08F]" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B9B2A4]">통화 중</span>
                </div>
                <span className="text-sm font-mono text-[#948C7B]">01:24</span>
              </div>
              <div className="space-y-3 text-sm">
                <Bubble role="ai">
                  Hi, this is Aaron&apos;s assistant calling about the internet issue reported yesterday at 1247 Ocean Blvd.
                </Bubble>
                <Bubble role="them">Okay, can I have the account number?</Bubble>
                <Bubble role="ai">Sure, it&apos;s 8-0-5-5-2-2-1-4-9.</Bubble>
              </div>
              <div className="mt-5 rounded-2xl bg-[#F6EFE2] p-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#B57A22] uppercase tracking-wide mb-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D9A83F]" />
                  AI가 확인 요청
                </div>
                <p className="text-[14px] text-[#26211A] leading-relaxed">
                  &quot;내일 오후 2~4시 사이 기사 방문이 가능한데, 괜찮으신가요?&quot;
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 rounded-xl bg-white/70 px-3 py-2 text-[13px] text-[#5D564A]">
                    네, 3시 방문 부탁드립니다.
                  </div>
                  <button className={`rounded-full ${C.terra} px-4 py-2 text-[12px] font-semibold text-white`}>
                    전달
                  </button>
                </div>
              </div>
            </div>
            {/* 모바일용 로봇 (카드 아래) */}
            <HeroRobot className="md:hidden mx-auto mt-8 w-[150px]" />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 msc-reveal">
            <Deco v={0} />
            <h2 className="mt-4 text-3xl md:text-[40px] font-bold tracking-tight">
              혹시 이런 경험, 있으신가요?
            </h2>
            <p className="mt-3 text-[#948C7B] max-w-xl mx-auto">미국 한인이라면 누구나 한 번쯤.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: "📞", title: "Comcast 인터넷", body: "“Press 1 for…” 자동 메뉴에서 단어 놓쳐서 세 번 다시 전화. 결국 룸메에게 부탁." },
              { icon: "🏠", title: "집주인 · 관리사무소", body: "“물이 천천히 빠져요”를 영어로 설명 못 해서 결국 가족 동석시켜 부탁." },
              { icon: "🏥", title: "보험사 · 병원", body: "Kaiser coverage 물어볼 때마다 한 시간. 미루다가 결국 예약 못 잡음." },
            ].map((p) => (
              <div key={p.title} className={`msc-reveal rounded-[24px] ${C.card} p-7 transition-transform hover:-translate-y-1`}>
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-[#5D564A] leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-base text-[#5D564A] msc-reveal">
            <strong className="text-[#26211A]">영어는 할 줄 아는데 전화가 어려운 이유:</strong>{" "}
            <br className="hidden md:block" />
            비언어적 단서가 없고, IVR 메뉴가 빠르고, 억양도 제각각이니까요.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 msc-reveal">
            <Deco v={1} />
            <h2 className="mt-4 text-3xl md:text-[40px] font-bold tracking-tight">
              한국어로 말하고,
              <br className="md:hidden" /> 한국어로 결과 받으세요.
            </h2>
            <p className="mt-3 text-[#948C7B]">중간 영어 과정은 AI가 알아서 처리합니다.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { n: "1", title: "한국어로 상황 브리핑", desc: "\"우리 아파트 화장실 물이 천천히 빠지는데, 관리사무소에 내일 오후 2시 이후로 수리 요청해줘.\" 라고 말하기만 하면 끝.", icon: "🗣", color: "bg-[#4C9A8B]" },
              { n: "2", title: "AI가 자연스러운 영어로 전화", desc: "My Side Call이 대신 전화를 걸고, IVR 메뉴를 알아서 누르고, 상담원과 자연스럽게 대화합니다. 통화 시작 시 AI임을 고지해서 안전해요.", icon: "📞", color: "bg-[#DE7150]" },
              { n: "3", title: "중간에 막히면 카메라로 보여주기", desc: "AI가 계정 번호·서명한 번호를 물어볼 때 카메라로 서류를 비추면 자동 인식. 전화 끊지 않고 실시간 해결.", icon: "📷", color: "bg-[#D9A83F]" },
              { n: "4", title: "한국어 요약 + 캘린더 자동 등록", desc: "\"기사님 내일 오후 2시 방문 확정\" 같은 액션을 다음 액션은 한국어로 받고, 캘린더에도 자동으로 등록됩니다.", icon: "✅", color: "bg-[#7E9EBB]" },
            ].map((step) => (
              <div key={step.n} className={`msc-reveal rounded-[24px] ${C.card} p-7 transition-transform hover:-translate-y-1`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full ${step.color} text-white font-bold`}>
                    {step.n}
                  </div>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-[#5D564A] leading-relaxed text-[15px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo placeholder */}
      <section id="demo" className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center msc-reveal">
          <Deco v={2} />
          <h2 className="mt-4 text-3xl md:text-[40px] font-bold tracking-tight mb-3">실제 통화 데모</h2>
          <p className="text-[#948C7B] mb-10">AI가 얼마나 자연스러운지 직접 들어보세요. (1분)</p>
          <div className="relative rounded-[28px] bg-[#26211A] aspect-video flex flex-col items-center justify-center overflow-hidden group cursor-pointer">
            <div className={`flex h-20 w-20 items-center justify-center rounded-full ${C.terra} text-white group-hover:scale-110 transition-transform duration-500`}>
              <svg className="h-8 w-8 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <p className="mt-5 text-sm text-[#B9B2A4]">데모 영상 준비 중 (Week 1 완성 예정)</p>
          </div>
        </div>
      </section>

      {/* Differentiator */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 msc-reveal">
            <h2 className="text-3xl md:text-[40px] font-bold tracking-tight mb-3">
              다른 번역 앱과 뭐가 다른가요?
            </h2>
            <p className="text-[#948C7B] max-w-xl mx-auto">동시통역이 아니라, 전화 자체를 대신합니다.</p>
          </div>
          <div className={`msc-reveal overflow-hidden rounded-[24px] ${C.card}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#26211A]/10">
                  <th className="text-left px-6 py-4 font-medium text-[#948C7B]"></th>
                  <th className="px-6 py-4 font-medium text-[#948C7B]">실시간 통역 앱</th>
                  <th className="px-6 py-4 font-bold text-[#26211A]">My Side Call</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26211A]/[0.06]">
                {[
                  ["내가 영어로 말해야 함", "✗"],
                  ["대신 전화 건어줌", "✗"],
                  ["IVR 메뉴 자동 처리", "✗"],
                  ["카메라로 서류 실시간 전달", "✗"],
                  ["결과 한국어 요약", "△"],
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 font-medium">{row[0]}</td>
                    <td className="px-6 py-4 text-center text-[#948C7B]">{row[1]}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#4C9A8B] text-white">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 msc-reveal">
            <Deco v={3} />
            <h2 className="mt-4 text-3xl md:text-[40px] font-bold tracking-tight mb-3">
              요금제 <span className="text-[#948C7B] text-xl font-medium">(출시 예정)</span>
            </h2>
            <p className="text-[#948C7B]">베탄는 무료. 정식 출시 후 예정입니다.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="msc-reveal"><PricingCard tier="Free" price="$0" period="영원히" features={["월 2통화", "5분 이내", "카메라 OCR", "한국어 요약"]} cta={{ label: "무료 시작", href: "#waitlist" }} /></div>
            <div className="msc-reveal"><PricingCard tier="Basic" price="$9.99" period="월" features={["월 10통화", "통화당 15분", "카메라 OCR", "캘린더 연동"]} cta={{ label: "베타 대기자 등록", href: "#waitlist" }} featured /></div>
            <div className="msc-reveal"><PricingCard tier="Pro" price="$19.99" period="월" features={["월 30통화", "통화 길이 무제한", "카메라 OCR 무제한", "우선 처리 · 녹음 보관 무제한"]} cta={{ label: "베타 대기자 등록", href: "#waitlist" }} /></div>
          </div>
          <p className="mt-8 text-center text-sm text-[#948C7B]">종량제 옵션: 구독 없이 통화당 $2.99</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-[40px] font-bold tracking-tight text-center mb-12 msc-reveal">자주 묻는 질문</h2>
          <div className="space-y-3">
            {[
              { q: "AI 음성이 부자연스러워서 상대방이 의심하지 않을까요?", a: "업계 최고 수준의 TTS(ElevenLabs)를 사용해 네이티브에 가깝습니다. 다만 미국 FCC 규정에 따라 통화 시작 시 자동으로 AI임을 고지해요. 상대방이 사람을 원하면 언제든 연결해 드립니다." },
              { q: "통화 내용을 녹음하나요? 안전한가요?", a: "요약 생성을 위해 녹음하며, 미국 주별 녹음법(양방 동의가 12개 포함)을 준수해 시작 시 고지합니다. 녹음은 암호화 저장되고 본인만 접근 가능하며 원하면 즉시 삭제 가능해요." },
              { q: "911 같은 응급 전화도 대신 걸 수 있나요?", a: "안전을 위해 응급전화(911·988 자살예방·가정폭력 핫라인 등)는 차단되어 있어요. 직접 전화하셔야 합니다." },
              { q: "언제 출시되나요?", a: "현재 클로즈드 베타 진행 중이에요. 대기자 명단에 등록해 주시면 베타 초대 우선순위로 연락드립니다." },
              { q: "미국 외 지역에서도 사용 가능한가요?", a: "초기엔 미국 발신 전화만 지원해요. 한국·일룸·유럽 등은 순차 확장 예정입니다." },
              { q: "어떤 상황에서 쓰면 좋을까요?", a: "레스토랑 예약, Comcast·Spectrum 고객센터, 집주인·관리사물소 수리 요청, 항공사·AAA 변경·환불 문의 등. 의료·법률·금융은 안전을 위해 초기엔 제한합니다." },
            ].map((item, i) => (
              <details key={i} className={`msc-reveal group rounded-[20px] ${C.card} overflow-hidden`}>
                <summary className="cursor-pointer px-6 py-4 text-[15px] font-semibold flex items-center justify-between list-none">
                  <span className="pr-4">{item.q}</span>
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#26211A]/[0.06] text-[#5D564A] group-open:bg-[#DE7150] group-open:text-white group-open:rotate-45 transition-all duration-300">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </span>
                </summary>
                <div className="px-6 pb-5 text-sm text-[#5D564A] leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="relative py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className={`msc-reveal rounded-[28px] ${C.card} p-8 md:p-12 text-center`}>
            <Deco v={1} />
            <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight mb-3">베타 대기자 등록</h2>
            <p className="text-lg text-[#5D564A] mb-8">
              출시 즉시 연락드려요. 스팸 없이 단 1회 · 베타 <strong className="text-[#26211A]">무료 통화 5회</strong> 제공
            </p>
            <div className="rounded-2xl bg-white/60 overflow-hidden">
              <iframe
                src={`https://tally.so/embed/${tallyFormId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
                loading="lazy"
                width="100%"
                height="280"
                frameBorder="0"
                title="대기자 등록"
              />
            </div>
            <p className="mt-6 text-xs text-[#948C7B]">
              이메일만 받아요. 스팸 절대 안 보내고 베타 출시 시에만 연락드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[#26211A]/10 py-10 px-6 text-sm text-[#948C7B]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LogoMark size={26} />
            <Wordmark className="text-[16px] text-[#26211A]" />
          </div>
          <div className="flex gap-6">
            <a href="/terms" className="hover:text-[#26211A] transition-colors">이용약관</a>
            <a href="#" className="hover:text-[#26211A] transition-colors">개인정보처리방침</a>
            <a href="mailto:hello@mysidecall.com" className="hover:text-[#26211A] transition-colors">문의</a>
          </div>
          <div>© 2026 My Side Call.</div>
        </div>
        <div className="mt-6 pt-6 border-t border-[#26211A]/10 text-center text-xs text-[#B9B2A4]">
          Built for Korean Americans, by a Korean American.
        </div>
      </footer>
    </main>
  );
}

function Bubble({ role, children }) {
  const isAI = role === "ai";
  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
          isAI
            ? "bg-[#F6EFE2] text-[#26211A] rounded-bl-sm"
            : "bg-white/10 text-[#E8E2D4] rounded-br-sm"
        }`}
      >
        <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isAI ? "text-[#B5652F]" : "text-[#948C7B]"}`}>
          {isAI ? "my side call" : "상대방"}
        </div>
        {children}
      </div>
    </div>
  );
}

function PricingCard({ tier, price, period, features, cta, featured }) {
  return (
    <div
      className={`relative h-full rounded-[24px] p-7 transition-transform hover:-translate-y-1 ${
        featured ? "bg-[#26211A] text-[#F6EFE2]" : "bg-[#ECE4D2]"
      }`}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-[#DE7150] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          ⭐ 가장 인기
        </div>
      )}
      <h3 className={`font-bold text-lg mb-2 ${featured ? "text-[#F6EFE2]" : "text-[#26211A]"}`}>{tier}</h3>
      <div className={`text-4xl font-bold mb-4 tracking-tight ${featured ? "text-white" : "text-[#26211A]"}`}>
        {price}
        <span className={`text-base font-normal ${featured ? "text-[#B9B2A4]" : "text-[#948C7B]"}`}>/{period}</span>
      </div>
      <ul className={`space-y-2.5 text-sm mb-6 ${featured ? "text-[#D8D2C4]" : "text-[#5D564A]"}`}>
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <svg className={`h-4 w-4 mt-0.5 flex-shrink-0 ${featured ? "text-[#DE7150]" : "text-[#4C9A8B]"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <a
        href={cta.href}
        className={`block text-center rounded-full px-4 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
          featured ? "bg-[#DE7150] text-white hover:bg-[#c9603f]" : "bg-[#26211A] text-[#F6EFE2] hover:bg-black"
        }`}
      >
        {cta.label}
      </a>
    </div>
  );
}
