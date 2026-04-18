import Link from "next/link";

export default function Home() {
  const tallyFormId = process.env.NEXT_PUBLIC_TALLY_FORM_ID || "XXXXXX";

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-950 text-ink-100">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-dim bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[140px]" />
        <div className="absolute top-[30%] -right-40 h-[500px] w-[700px] rounded-full bg-accent-pink/15 blur-[140px] animate-aurora-drift" />
        <div className="absolute top-[60%] -left-40 h-[500px] w-[700px] rounded-full bg-accent-cyan/10 blur-[140px] animate-aurora-drift" style={{ animationDelay: "-8s" }} />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-pink text-white shadow-lg shadow-brand-500/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              My Side Call
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <a href="#how" className="hidden sm:inline-flex rounded-full px-3 py-1.5 text-[13px] font-medium text-ink-400 transition-colors hover:text-ink-100">
              어떻게 작동해요
            </a>
            <a href="#pricing" className="hidden sm:inline-flex rounded-full px-3 py-1.5 text-[13px] font-medium text-ink-400 transition-colors hover:text-ink-100">
              요금
            </a>
            <a href="#faq" className="hidden md:inline-flex rounded-full px-3 py-1.5 text-[13px] font-medium text-ink-400 transition-colors hover:text-ink-100">
              FAQ
            </a>
            <Link
              href="/app"
              className="ml-1 rounded-full bg-white/5 px-3.5 py-1.5 text-[13px] font-medium text-ink-100 ring-1 ring-inset ring-white/10 transition-all hover:bg-white/10 hover:ring-white/20"
            >
              앱 열기
            </Link>
            <a
              href="#waitlist"
              className="ml-1 hidden sm:inline-flex items-center rounded-full bg-gradient-to-r from-brand-500 to-accent-pink px-3.5 py-1.5 text-[13px] font-semibold text-white shadow-lg shadow-brand-500/25 transition-transform hover:-translate-y-0.5"
            >
              대기자 등록
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 md:pt-32 pb-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="eyebrow animate-fade-in-down">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            재미 한인을 위한 영어 전화 대행 AI
          </span>
          <h1 className="mt-6 text-[44px] md:text-7xl font-bold leading-[1.02] tracking-tight animate-fade-in-up" style={{ animationDelay: "0.08s" }}>
            영어 전화,{" "}
            <br className="md:hidden" />
            <span className="gradient-text">대신 걸어드려요.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ink-300 leading-relaxed max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            고객센터·집주인·보험사에 한국어로 상황만 말씀해주세요.
            <br className="hidden md:block" />
            <strong className="text-ink-100 font-medium">AI가 자연스러운 영어로 대신 전화</strong>
            하고, 결과를 한국어로 요약해 드립니다.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.22s" }}>
            <a href="#waitlist" className="btn-primary group px-7 py-3.5 text-[15px]">
              무료 베타 대기자 등록
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
            <a href="#demo" className="btn-secondary px-7 py-3.5 text-[15px]">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              데모 보기 (1분)
            </a>
          </div>
          <p className="mt-5 text-xs text-ink-500 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            베타 초대장은 <strong className="text-ink-300">무료 통화 5회</strong> 제공 · 카드 등록 불필요
          </p>
        </div>

        {/* Hero visual — floating call card */}
        <div className="mt-16 md:mt-24 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-brand-500/20 via-accent-violet/20 to-accent-pink/20 blur-2xl opacity-60" />
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-ink-850/90 via-ink-900/90 to-ink-850/90 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-pulse-ring" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-300">
                    통화 중
                  </span>
                </div>
                <span className="text-sm font-mono text-ink-400">01:24</span>
              </div>
              <div className="space-y-3 text-sm">
                <Bubble role="ai">
                  Hi, this is Aaron's assistant calling about the internet issue reported yesterday at 1247 Ocean Blvd.
                </Bubble>
                <Bubble role="them">
                  Okay, can I have the account number?
                </Bubble>
                <Bubble role="ai">
                  Sure, it's 8-0-5-5-2-2-1-4-9.
                </Bubble>
              </div>
              <div className="mt-5 relative rounded-xl border border-amber-400/40 bg-amber-500/[0.06] p-4 animate-spring-in" style={{ animationDelay: "0.9s" }}>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 uppercase tracking-wide mb-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-70 animate-pulse-ring" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                  </span>
                  AI가 확인 요청
                </div>
                <p className="text-[14px] text-ink-100 leading-relaxed">
                  "내일 오후 2~4시 사이 기사 방문이 가능한데, 괜찮으신가요?"
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 rounded-lg border border-white/10 bg-ink-900/60 px-3 py-2 text-[13px] text-ink-300 font-mono">
                    네, 3시 방문 부탁드립니다.
                  </div>
                  <button className="rounded-lg bg-gradient-to-r from-brand-500 to-accent-pink px-3.5 py-2 text-[12px] font-medium text-white shadow-lg shadow-brand-500/30">
                    전달
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="eyebrow">⚡ 공감 포인트</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
              혹시 이런 경험, 있으신가요?
            </h2>
            <p className="mt-3 text-ink-400 max-w-xl mx-auto">
              미국 한인이라면 누구나 한 번쯤.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 stagger">
            {[
              { icon: "📞", title: "Comcast 인터넷", body: "“Press 1 for…” 자동 메뉴에서 단어 놓쳐서 세 번 다시 전화. 결국 룸메에게 부탁." },
              { icon: "🏠", title: "집주인 · 관리사무소", body: "“물이 천천히 빠져요”를 영어로 설명 못 해서 결국 가족 동석시켜 부탁." },
              { icon: "🏥", title: "보험사 · 병원", body: "Kaiser coverage 물어볼 때마다 한 시간. 미루다가 결국 예약 못 잡음." },
            ].map((p) => (
              <div key={p.title} className="card p-6 card-hover">
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="font-semibold text-lg mb-2 text-ink-100">{p.title}</h3>
                <p className="text-sm text-ink-400 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-base text-ink-300">
            <strong className="text-ink-100">영어는 할 줄 아는데 전화가 어려운 이유:</strong>{" "}
            <br className="hidden md:block" />
            비언어적 단서가 없고, IVR 메뉴가 빠르고, 억양도 제각각이니까요.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="eyebrow">🎯 4단계</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
              한국어로 말하고, <span className="gradient-text">한국어로 결과</span> 받으세요.
            </h2>
            <p className="mt-3 text-ink-400">중간 영어 과정은 AI가 알아서 처리합니다.</p>
          </div>

          <div className="space-y-4 relative">
            {/* Connecting line */}
            <div aria-hidden className="absolute left-7 top-7 bottom-7 w-px bg-gradient-to-b from-brand-500/60 via-white/10 to-transparent hidden md:block" />

            {[
              {
                n: "1",
                title: "한국어로 상황 브리핑",
                desc: "\"우리 아파트 화장실 물이 천천히 빠지는데, 관리사무소에 내일 오후 2시 이후로 수리 요청해줘.\" 라고 말하기만 하면 끝.",
                icon: "🗣",
              },
              {
                n: "2",
                title: "AI가 자연스러운 영어로 전화",
                desc: "My Side Call이 대신 전화를 걸고, IVR 메뉴를 알아서 누르고, 상담원과 자연스럽게 대화합니다. 통화 시작 시 AI임을 고지해서 안전해요.",
                icon: "📞",
              },
              {
                n: "3",
                title: "중간에 막히면 카메라로 보여주기",
                desc: "AI가 계정 번호·서명한 번호를 물어볼 때 카메라로 서류를 비추면 자동 인식. 전화 끊지 않고 실시간 해결.",
                icon: "📷",
              },
              {
                n: "4",
                title: "한국어 요약 + 캘린더 자동 등록",
                desc: "\"기사님 내일 오후 2시 방문 확정\" 같은 액션을 다음 액션은 한국어로 받고, 캘린더에도 자동으로 등록됩니다.",
                icon: "✅",
              },
            ].map((step, i) => (
              <div key={step.n} className="relative md:pl-6">
                <div className="flex gap-5 md:gap-8 items-start rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 md:p-7 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex-shrink-0 relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-pink text-white font-bold text-lg shadow-lg shadow-brand-500/30">
                      {step.n}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xl">{step.icon}</span>
                      <h3 className="font-semibold text-lg text-ink-100">{step.title}</h3>
                    </div>
                    <p className="text-ink-400 leading-relaxed text-[15px]">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo placeholder */}
      <section id="demo" className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            실제 통화 데모
          </h2>
          <p className="text-ink-400 mb-10">
            AI가 얼마나 자연스러운지 직접 들어보세요. (1분)
          </p>
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-ink-850 via-ink-900 to-ink-850 aspect-video flex flex-col items-center justify-center overflow-hidden group cursor-pointer hover:border-white/20 transition-all">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-pink text-white shadow-2xl shadow-brand-500/40 group-hover:scale-110 transition-transform duration-500">
              <svg className="h-8 w-8 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <p className="relative mt-5 text-sm text-ink-400">데모 영상 준비 중 (Week 1 완성 예정)</p>
          </div>
        </div>
      </section>

      {/* Differentiator */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              다른 번역 앱과 뭐가 다른가요?
            </h2>
            <p className="text-ink-400 max-w-xl mx-auto">
              동시통역이 아니라, 전화 자체를 대신합니다.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-6 py-4 font-medium text-ink-400"></th>
                  <th className="px-6 py-4 font-medium text-ink-400">실시간 통역 앱</th>
                  <th className="px-6 py-4 font-semibold">
                    <span className="gradient-text">My Side Call</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ["내가 영어로 말해야 함", "✗", "✓"],
                  ["대신 전화 건어줌", "✗", "✓"],
                  ["IVR 메뉴 자동 처리", "✗", "✓"],
                  ["카메라로 서류 실시간 전달", "✗", "✓"],
                  ["결과 한국어 요약", "△", "✓"],
                ].map((row, i) => (
                  <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-ink-200">{row[0]}</td>
                    <td className="px-6 py-4 text-center text-ink-500">{row[1]}</td>
                    <td className="px-6 py-4 text-center font-semibold">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-brand-300">
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
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              요금제 <span className="text-ink-400 text-xl">(출시 예정)</span>
            </h2>
            <p className="text-ink-400">
              베탄는 무료. 정식 출시 후 예정입니다.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Free */}
            <PricingCard
              tier="Free"
              price="$0"
              period="영원히"
              features={["월 2통화", "5분 이내", "카메라 OCR", "한국어 요약"]}
              cta={{ label: "무료 시작", href: "#waitlist" }}
            />
            {/* Basic (featured) */}
            <PricingCard
              tier="Basic"
              price="$9.99"
              period="월"
              features={["월 10통화", "통화당 15분", "카메라 OCR", "캘린더 연동"]}
              cta={{ label: "베타 대기자 등록", href: "#waitlist" }}
              featured
            />
            {/* Pro */}
            <PricingCard
              tier="Pro"
              price="$19.99"
              period="월"
              features={[
                "월 30통화",
                "통화 길이 무제한",
                "카메라 OCR 무제한",
                "우선 처리 · 녹음 보관 무제한",
              ]}
              cta={{ label: "베타 대기자 등록", href: "#waitlist" }}
            />
          </div>
          <p className="mt-8 text-center text-sm text-ink-500">
            종량제 옵션: 구독 없이 통화당 $2.99
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">
            자주 묻는 질문
          </h2>
          <div className="space-y-3">
            {[
              { q: "AI 음성이 부자연스러워서 상대방이 의심하지 않을까요?", a: "업계 최고 수준의 TTS(ElevenLabs)를 사용해 네이티브에 가깝습니다. 다만 미국 FCC 규정에 따라 통화 시작 시 자동으로 AI임을 고지해요. 상대방이 사람을 원하면 언제든 연결해 드립니다." },
              { q: "통화 내용을 녹음하나요? 안전한가요?", a: "요약 생성을 위해 녹음하며, 미국 주별 녹음법(양방 동의가 12개 포함)을 준수해 시작 시 고지합니다. 녹음은 암호화 저장되고 본인만 접근 가능하며 원하면 즉시 삭제 가능해요." },
              { q: "911 같은 응급 전화도 대신 걸 수 있나요?", a: "안전을 위해 응급전화(911·988 자살예방·가정폭력 핫라인 등)는 차단되어 있어요. 직접 전화하셔야 합니다." },
              { q: "언제 출시되나요?", a: "현재 클로즈드 베타 진행 중이에요. 대기자 명단에 등록해 주시면 베타 초대 우선순위로 연락드립니다." },
              { q: "미국 외 지역에서도 사용 가능한가요?", a: "초기엔 미국 발신 전화만 지원해요. 한국·일룸·유럽 등은 순차 확장 예정입니다." },
              { q: "어떤 상황에서 쓰면 좋을까요?", a: "레스토랑 예약, Comcast·Spectrum 고객센터, 집주인·관리사물소 수리 요청, 항공사·AAA 변경·환불 문의 등. 의료·법률·금융은 안전을 위해 초기엔 제한합니다." },
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden transition-all hover:border-white/15 open:border-white/15 open:bg-white/[0.03]"
              >
                <summary className="cursor-pointer px-5 py-4 text-[15px] font-medium flex items-center justify-between list-none hover:bg-white/[0.02]">
                  <span className="pr-4">{item.q}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-ink-400 group-open:bg-brand-500 group-open:border-brand-500 group-open:text-white group-open:rotate-45 transition-all duration-300">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm text-ink-300 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="relative py-24 px-6">
        <div className="max-w-2xl mx-auto relative">
          <div aria-hidden className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-brand-500/25 via-accent-violet/25 to-accent-pink/25 blur-2xl opacity-60" />
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-ink-900 via-ink-850 to-ink-900 p-8 md:p-12 text-center overflow-hidden">
            <div aria-hidden className="aurora-bg opacity-40" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
                <span className="gradient-text">베타 대기자 등록</span>
              </h2>
              <p className="text-lg text-ink-300 mb-8">
                출시 즉시 연락드려요. 스팸 없이 단 1회 · 베타 <strong className="text-ink-100">무료 통화 5회</strong> 제공
              </p>
              <div className="rounded-2xl border border-white/10 bg-ink-950/50 overflow-hidden">
                <iframe
                  src={`https://tally.so/embed/${tallyFormId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
                  loading="lazy"
                  width="100%"
                  height="280"
                  frameBorder="0"
                  title="대기자 등록"
                />
              </div>
              <p className="mt-6 text-xs text-ink-500">
                이메일만 받아요. 스팸 절대 안 보내고 베타 출시 시에만 연락드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-10 px-6 text-sm text-ink-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-brand-500 to-accent-pink text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </span>
            <span className="font-semibold text-ink-200">My Side Call</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-ink-200 transition-colors">이용약관</a>
            <a href="#" className="hover:text-ink-200 transition-colors">개인정보처리방침</a>
            <a href="mailto:hello@mysidecall.com" className="hover:text-ink-200 transition-colors">문의</a>
          </div>
          <div className="text-ink-500">© 2026 My Side Call.</div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-ink-600">
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
            ? "bg-brand-500/15 border border-brand-500/30 text-ink-100 rounded-bl-sm"
            : "bg-white/[0.04] border border-white/10 text-ink-200 rounded-br-sm"
        }`}
      >
        <div className={`text-[10px] font-semibold uppercase tracking-wider mb-0.5 ${isAI ? "text-brand-300" : "text-ink-400"}`}>
          {isAI ? "My Side Call" : "상대방"}
        </div>
        {children}
      </div>
    </div>
  );
}

function PricingCard({ tier, price, period, features, cta, featured }) {
  return (
    <div
      className={`relative rounded-2xl p-7 transition-all duration-500 hover:-translate-y-1 ${
        featured
          ? "border-2 border-brand-400/50 bg-gradient-to-br from-brand-500/10 via-ink-850/80 to-ink-900/80 shadow-glow"
          : "border border-white/10 bg-white/[0.02] hover:border-white/20"
      }`}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-500 to-accent-pink px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg">
          ⭐ 가장 인기
        </div>
      )}
      <h3 className="font-semibold text-lg mb-2 text-ink-100">{tier}</h3>
      <div className="text-4xl font-bold mb-4 tracking-tight text-ink-50">
        {price}
        <span className="text-base text-ink-500 font-normal">/{period}</span>
      </div>
      <ul className="space-y-2.5 text-sm text-ink-300 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <svg className="h-4 w-4 text-brand-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <a
        href={cta.href}
        className={`block text-center rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
          featured
            ? "bg-gradient-to-r from-brand-500 to-accent-pink text-white shadow-lg shadow-brand-500/30 hover:-translate-y-0.5"
            : "border border-white/10 bg-white/[0.02] text-ink-100 hover:border-white/20 hover:bg-white/[0.06]"
        }`}
      >
        {cta.label}
      </a>
    </div>
  );
}
