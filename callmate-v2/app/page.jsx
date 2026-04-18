export default function Home() {
  const tallyFormId = process.env.NEXT_PUBLIC_TALLY_FORM_ID || "XXXXXX";

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📞</span>
            <span className="font-bold text-lg">My Side Call</span>
          </div>
          <a
            href="#waitlist"
            className="bg-brand-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-brand-700 transition"
          >
            대기자 등록
          </a>
        </div>X
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-brand-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-brand-100 text-brand-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            재미 한인을 위한 영어 전화 대행 AI
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            영어 전화, <br />
            <span className="text-brand-600">대신 걸어드려요.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            고객센터·집주인·보험사에 한국어로 상황만 말해주세요.
            <br className="hidden md:block" />
            <strong className="text-gray-800">
              AI가 자연스러운 영어로 대신 전화
            </strong>
            하고, 결과를 한국어로 요약해 드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#waitlist"
              className="bg-brand-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-700 transition shadow-lg shadow-brand-600/30"
            >
              무료 베타 대기자 등록 →
            </a>
            <a
              href="#demo"
              className="text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition flex items-center gap-2"
            >
              <span>▶</span> 데모 듣기 (1분)
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            베타 초대받은 분께 <strong>무료 통화 5회</strong> 제공 · 카드 등록 불필요
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            혹시 이런 경험, 있으신가요?
          </h2>
          <p className="text-center text-gray-600 mb-12">
            미국 한인이라면 누구나 한 번쯤…
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="text-3xl mb-4">📺</div>
              <h3 className="font-bold text-lg mb-2">Comcast 인터넷</h3>
              <p className="text-gray-600">
                "Press 1 for…" 자동 메뉴에서 단어 놓쳐서 세 번 다시 전화. 결국 룸메한테 부탁.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="text-3xl mb-4">🏠</div>
              <h3 className="font-bold text-lg mb-2">집주인·관리사무소</h3>
              <p className="text-gray-600">
                "물이 천천히 빠져요"를 영어로 설명 못해서 결국 가족 통역사에게 부탁.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="text-3xl mb-4">🏥</div>
              <h3 className="font-bold text-lg mb-2">보험사·병원</h3>
              <p className="text-gray-600">
                Kaiser coverage 물어볼 엄두가 안 나서 미루다가 결국 예약 못 잡음.
              </p>
            </div>
          </div>
          <p className="text-center mt-12 text-lg text-gray-700">
            <strong>영어는 할 줄 아는데 전화만 어려운 이유</strong>는
            <br className="hidden md:block" />
            비언어적 단서가 없고, IVR 메뉴가 빠르고, 악센트가 제각각이라서예요.
          </p>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 px-6 bg-gradient-to-b from-brand-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            한국어로 말하고, 한국어로 결과 받으세요.
          </h2>
          <p className="text-center text-gray-600 mb-16">
            중간 영어 과정은 AI가 알아서 처리합니다.
          </p>

          <div className="space-y-6">
            {[
              {
                n: "1",
                title: "한국어로 상황 브리핑",
                desc: '"우리 아파트 화장실 물이 천천히 빠지는데, 관리사무소에 내일 오후 2시 이후로 수리 요청해줘." 라고 말하기만 하면 끝.',
                icon: "🎙️",
              },
              {
                n: "2",
                title: "AI가 자연스러운 영어로 전화",
                desc: "My Side Call가 대신 전화를 걸고, IVR 메뉴도 알아서 누르고, 상담원과 자연스럽게 대화합니다. 통화 시작 시 AI임을 고지해서 안전해요.",
                icon: "📞",
              },
              {
                n: "3",
                title: "중간에 막히면 카메라로 보여주기",
                desc: "AI가 계정 번호·처방전 번호를 물어볼 때 카메라로 서류를 비추면 자동 인식. 전화 끊지 않고 실시간 해결.",
                icon: "📷",
              },
              {
                n: "4",
                title: "한국어 요약 + 캘린더 자동 등록",
                desc: '"기사님 내일 오후 2시 방문 확정" 같은 요약과 다음 액션을 한국어로 받고, 캘린더에도 자동으로 등록됩니다.',
                icon: "✅",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {step.n}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{step.icon}</span>
                    <h3 className="font-bold text-xl">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo (placeholder) */}
      <section id="demo" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            실제 통화 데모
          </h2>
          <p className="text-center text-gray-600 mb-12">
            AI가 얼마나 자연스러운지 직접 들어보세요 (1분)
          </p>
          <div className="bg-gray-900 rounded-3xl aspect-video flex flex-col items-center justify-center text-white">
            <div className="text-6xl mb-4">▶</div>
            <p className="text-gray-400">
              데모 영상 준비 중 (Week 1 완성 예정)
            </p>
          </div>
        </div>
      </section>

      {/* Differentiator */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            다른 번역 앱과 뭐가 다른가요?
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-6 py-4 font-semibold">기능</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    실시간 통역 앱
                  </th>
                  <th className="px-6 py-4 font-semibold text-brand-600">
                    My Side Call
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-4 font-medium">내가 영어로 말해야 함</td>
                  <td className="px-6 py-4 text-center">😰 O</td>
                  <td className="px-6 py-4 text-center text-brand-600 font-bold">
                    X
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">대신 전화 걸어줌</td>
                  <td className="px-6 py-4 text-center">X</td>
                  <td className="px-6 py-4 text-center text-brand-600 font-bold">
                    O
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">IVR 메뉴 자동 처리</td>
                  <td className="px-6 py-4 text-center">X</td>
                  <td className="px-6 py-4 text-center text-brand-600 font-bold">
                    O
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">카메라로 서류 실시간 전달</td>
                  <td className="px-6 py-4 text-center">X</td>
                  <td className="px-6 py-4 text-center text-brand-600 font-bold">
                    ⭐ O
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">결과 한국어 요약</td>
                  <td className="px-6 py-4 text-center">△</td>
                  <td className="px-6 py-4 text-center text-brand-600 font-bold">
                    O
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            요금제 (출시 예정)
          </h2>
          <p className="text-center text-gray-600 mb-12">
            베타는 무료. 정식 출시 후 예정 가격입니다.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="font-bold text-lg mb-2">Free</h3>
              <div className="text-4xl font-extrabold mb-4">$0</div>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ 월 2통화</li>
                <li>✓ 5분 이하</li>
                <li>✗ 카메라 OCR</li>
                <li>✓ 한국어 요약</li>
              </ul>
            </div>
            <div className="rounded-2xl p-8 border-2 border-brand-600 bg-brand-50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                가장 인기
              </div>
              <h3 className="font-bold text-lg mb-2">Basic</h3>
              <div className="text-4xl font-extrabold mb-4">
                $9.99<span className="text-lg text-gray-500">/월</span>
              </div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ 월 10통화</li>
                <li>✓ 통화당 15분</li>
                <li>✓ 카메라 OCR</li>
                <li>✓ 캘린더 연동</li>
              </ul>
            </div>
            <div className="rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="font-bold text-lg mb-2">Pro</h3>
              <div className="text-4xl font-extrabold mb-4">
                $19.99<span className="text-lg text-gray-500">/월</span>
              </div>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ 월 30통화</li>
                <li>✓ 통화 길이 무제한</li>
                <li>✓ 카메라 OCR 무제한</li>
                <li>✓ 우선 처리·녹음 보관 무제한</li>
              </ul>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            종량제 옵션: 구독 없이 통화당 $2.99
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "AI 음성이 부자연스러워서 상대방이 의심하지 않을까요?",
                a: "업계 최고 수준의 TTS(ElevenLabs)를 사용해 네이티브에 가깝습니다. 다만 미국 FCC 규정에 따라 통화 시작 시 자동으로 AI임을 고지해요. 상대방이 사람을 원하면 언제든 옵션을 드립니다.",
              },
              {
                q: "통화 내용을 녹음하나요? 안전한가요?",
                a: "요약 생성을 위해 녹음하며, 미국 주별 녹음법(양방 동의주 12개 포함)을 준수해 시작 시 고지합니다. 녹음은 암호화 저장되고 본인만 접근 가능하며 원하면 즉시 삭제 가능해요.",
              },
              {
                q: "911 같은 응급 전화도 대신 걸 수 있나요?",
                a: "안전을 위해 응급전화(911·988 자살예방·가정폭력 핫라인 등)는 차단되어 있어요. 직접 전화하셔야 합니다.",
              },
              {
                q: "언제 출시되나요?",
                a: "현재 클로즈드 베타 진행 중이에요. 대기자 명단에 등록해 주시면 베타 초대 우선순위로 연락드립니다.",
              },
              {
                q: "미국 외 지역에서도 사용 가능한가요?",
                a: "초기엔 미국 발신 전화만 지원해요. 한국·일본·유럽 등은 순차 확장 예정입니다.",
              },
              {
                q: "어떤 상황에서 쓰면 좋을까요?",
                a: "레스토랑 예약, Comcast·Spectrum 고객센터, 집주인/관리사무소 수리 요청, 항공사·AAA 변경·환불 문의 등. 의료·법률·금융은 안전을 위해 초기엔 제한합니다.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <summary className="cursor-pointer px-6 py-4 font-semibold flex items-center justify-between hover:bg-gray-50">
                  <span>{item.q}</span>
                  <span className="text-brand-600 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section
        id="waitlist"
        className="py-20 px-6 bg-gradient-to-br from-brand-600 to-brand-800 text-white"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            베타 대기자 등록
          </h2>
          <p className="text-xl text-brand-100 mb-10">
            출시 즉시 연락드려요. <br className="md:hidden" />
            초대받은 분께 <strong className="text-white">무료 통화 5회</strong> 제공.
          </p>
          <div className="bg-white rounded-2xl overflow-hidden">
            <iframe
              src={`https://tally.so/embed/${tallyFormId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
              loading="lazy"
              width="100%"
              height="280"
              frameBorder="0"
              title="대기자 등록"
            />
          </div>
          <p className="text-sm text-brand-200 mt-6">
            이메일만 받아요. 스팸 절대 안 보내고 베타 출시 시에만 연락드립니다.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400 text-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white">
              <span className="text-2xl">📞</span>
              <span className="font-bold">My Side Call</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">
                이용약관
              </a>
              <a href="#" className="hover:text-white">
                개인정보처리방침
              </a>
              <a href="mailto:hello@mysidecall.com" className="hover:text-white">
                문의
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            © 2026 My Side Call. Built for Korean Americans, by a Korean American.
          </div>
        </div>
      </footer>
    </main>
  );
}export default function Home() {
  const tallyFormId = process.env.NEXT_PUBLIC_TALLY_FORM_ID || "XXXXXX";

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📞</span>
            <span className="font-bold text-lg">Callmate</span>
          </div>
          <a
            href="#waitlist"
            className="bg-brand-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-brand-700 transition"
          >
            대기자 등록
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-brand-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-brand-100 text-brand-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            재미 한인을 위한 영어 전화 대행 AI
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            영어 전화, <br />
            <span className="text-brand-600">대신 걸어드려요.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            고객센터·집주인·보험사에 한국어로 상황만 말해주세요.
            <br className="hidden md:block" />
            <strong className="text-gray-800">
              AI가 자연스러운 영어로 대신 전화
            </strong>
            하고, 결과를 한국어로 요약해 드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#waitlist"
              className="bg-brand-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-700 transition shadow-lg shadow-brand-600/30"
            >
              무료 베타 대기자 등록 →
            </a>
            <a
              href="#demo"
              className="text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition flex items-center gap-2"
            >
              <span>▶</span> 데모 듣기 (1분)
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            베타 초대받은 분께 <strong>무료 통화 5회</strong> 제공 · 카드 등록 불필요
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            혹시 이런 경험, 있으신가요?
          </h2>
          <p className="text-center text-gray-600 mb-12">
            미국 한인이라면 누구나 한 번쯤…
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="text-3xl mb-4">📺</div>
              <h3 className="font-bold text-lg mb-2">Comcast 인터넷</h3>
              <p className="text-gray-600">
                "Press 1 for…" 자동 메뉴에서 단어 놓쳐서 세 번 다시 전화. 결국 룸메한테 부탁.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="text-3xl mb-4">🏠</div>
              <h3 className="font-bold text-lg mb-2">집주인·관리사무소</h3>
              <p className="text-gray-600">
                "물이 천천히 빠져요"를 영어로 설명 못해서 결국 가족 통역사에게 부탁.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="text-3xl mb-4">🏥</div>
              <h3 className="font-bold text-lg mb-2">보험사·병원</h3>
              <p className="text-gray-600">
                Kaiser coverage 물어볼 엄두가 안 나서 미루다가 결국 예약 못 잡음.
              </p>
            </div>
          </div>
          <p className="text-center mt-12 text-lg text-gray-700">
            <strong>영어는 할 줄 아는데 전화만 어려운 이유</strong>는
            <br className="hidden md:block" />
            비언어적 단서가 없고, IVR 메뉴가 빠르고, 악센트가 제각각이라서예요.
          </p>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 px-6 bg-gradient-to-b from-brand-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            한국어로 말하고, 한국어로 결과 받으세요.
          </h2>
          <p className="text-center text-gray-600 mb-16">
            중간 영어 과정은 AI가 알아서 처리합니다.
          </p>

          <div className="space-y-6">
            {[
              {
                n: "1",
                title: "한국어로 상황 브리핑",
                desc: '"우리 아파트 화장실 물이 천천히 빠지는데, 관리사무소에 내일 오후 2시 이후로 수리 요청해줘." 라고 말하기만 하면 끝.',
                icon: "🎙️",
              },
              {
                n: "2",
                title: "AI가 자연스러운 영어로 전화",
                desc: "Callmate가 대신 전화를 걸고, IVR 메뉴도 알아서 누르고, 상담원과 자연스럽게 대화합니다. 통화 시작 시 AI임을 고지해서 안전해요.",
                icon: "📞",
              },
              {
                n: "3",
                title: "중간에 막히면 카메라로 보여주기",
                desc: "AI가 계정 번호·처방전 번호를 물어볼 때 카메라로 서류를 비추면 자동 인식. 전화 끊지 않고 실시간 해결.",
                icon: "📷",
              },
              {
                n: "4",
                title: "한국어 요약 + 캘린더 자동 등록",
                desc: '"기사님 내일 오후 2시 방문 확정" 같은 요약과 다음 액션을 한국어로 받고, 캘린더에도 자동으로 등록됩니다.',
                icon: "✅",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {step.n}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{step.icon}</span>
                    <h3 className="font-bold text-xl">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo (placeholder) */}
      <section id="demo" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            실제 통화 데모
          </h2>
          <p className="text-center text-gray-600 mb-12">
            AI가 얼마나 자연스러운지 직접 들어보세요 (1분)
          </p>
          <div className="bg-gray-900 rounded-3xl aspect-video flex flex-col items-center justify-center text-white">
            <div className="text-6xl mb-4">▶</div>
            <p className="text-gray-400">
              데모 영상 준비 중 (Week 1 완성 예정)
            </p>
          </div>
        </div>
      </section>

      {/* Differentiator */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            다른 번역 앱과 뭐가 다른가요?
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-6 py-4 font-semibold">기능</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    실시간 통역 앱
                  </th>
                  <th className="px-6 py-4 font-semibold text-brand-600">
                    Callmate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-4 font-medium">내가 영어로 말해야 함</td>
                  <td className="px-6 py-4 text-center">😰 O</td>
                  <td className="px-6 py-4 text-center text-brand-600 font-bold">
                    X
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">대신 전화 걸어줌</td>
                  <td className="px-6 py-4 text-center">X</td>
                  <td className="px-6 py-4 text-center text-brand-600 font-bold">
                    O
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">IVR 메뉴 자동 처리</td>
                  <td className="px-6 py-4 text-center">X</td>
                  <td className="px-6 py-4 text-center text-brand-600 font-bold">
                    O
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">카메라로 서류 실시간 전달</td>
                  <td className="px-6 py-4 text-center">X</td>
                  <td className="px-6 py-4 text-center text-brand-600 font-bold">
                    ⭐ O
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">결과 한국어 요약</td>
                  <td className="px-6 py-4 text-center">△</td>
                  <td className="px-6 py-4 text-center text-brand-600 font-bold">
                    O
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            요금제 (출시 예정)
          </h2>
          <p className="text-center text-gray-600 mb-12">
            베타는 무료. 정식 출시 후 예정 가격입니다.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="font-bold text-lg mb-2">Free</h3>
              <div className="text-4xl font-extrabold mb-4">$0</div>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ 월 2통화</li>
                <li>✓ 5분 이하</li>
                <li>✗ 카메라 OCR</li>
                <li>✓ 한국어 요약</li>
              </ul>
            </div>
            <div className="rounded-2xl p-8 border-2 border-brand-600 bg-brand-50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                가장 인기
              </div>
              <h3 className="font-bold text-lg mb-2">Basic</h3>
              <div className="text-4xl font-extrabold mb-4">
                $9.99<span className="text-lg text-gray-500">/월</span>
              </div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ 월 10통화</li>
                <li>✓ 통화당 15분</li>
                <li>✓ 카메라 OCR</li>
                <li>✓ 캘린더 연동</li>
              </ul>
            </div>
            <div className="rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="font-bold text-lg mb-2">Pro</h3>
              <div className="text-4xl font-extrabold mb-4">
                $19.99<span className="text-lg text-gray-500">/월</span>
              </div>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ 월 30통화</li>
                <li>✓ 통화 길이 무제한</li>
                <li>✓ 카메라 OCR 무제한</li>
                <li>✓ 우선 처리·녹음 보관 무제한</li>
              </ul>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            종량제 옵션: 구독 없이 통화당 $2.99
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "AI 음성이 부자연스러워서 상대방이 의심하지 않을까요?",
                a: "업계 최고 수준의 TTS(ElevenLabs)를 사용해 네이티브에 가깝습니다. 다만 미국 FCC 규정에 따라 통화 시작 시 자동으로 AI임을 고지해요. 상대방이 사람을 원하면 언제든 옵션을 드립니다.",
              },
              {
                q: "통화 내용을 녹음하나요? 안전한가요?",
                a: "요약 생성을 위해 녹음하며, 미국 주별 녹음법(양방 동의주 12개 포함)을 준수해 시작 시 고지합니다. 녹음은 암호화 저장되고 본인만 접근 가능하며 원하면 즉시 삭제 가능해요.",
              },
              {
                q: "911 같은 응급 전화도 대신 걸 수 있나요?",
                a: "안전을 위해 응급전화(911·988 자살예방·가정폭력 핫라인 등)는 차단되어 있어요. 직접 전화하셔야 합니다.",
              },
              {
                q: "언제 출시되나요?",
                a: "현재 클로즈드 베타 진행 중이에요. 대기자 명단에 등록해 주시면 베타 초대 우선순위로 연락드립니다.",
              },
              {
                q: "미국 외 지역에서도 사용 가능한가요?",
                a: "초기엔 미국 발신 전화만 지원해요. 한국·일본·유럽 등은 순차 확장 예정입니다.",
              },
              {
                q: "어떤 상황에서 쓰면 좋을까요?",
                a: "레스토랑 예약, Comcast·Spectrum 고객센터, 집주인/관리사무소 수리 요청, 항공사·AAA 변경·환불 문의 등. 의료·법률·금융은 안전을 위해 초기엔 제한합니다.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <summary className="cursor-pointer px-6 py-4 font-semibold flex items-center justify-between hover:bg-gray-50">
                  <span>{item.q}</span>
                  <span className="text-brand-600 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section
        id="waitlist"
        className="py-20 px-6 bg-gradient-to-br from-brand-600 to-brand-800 text-white"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            베타 대기자 등록
          </h2>
          <p className="text-xl text-brand-100 mb-10">
            출시 즉시 연락드려요. <br className="md:hidden" />
            초대받은 분께 <strong className="text-white">무료 통화 5회</strong> 제공.
          </p>
          <div className="bg-white rounded-2xl overflow-hidden">
            <iframe
              src={`https://tally.so/embed/${tallyFormId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
              loading="lazy"
              width="100%"
              height="280"
              frameBorder="0"
              title="대기자 등록"
            />
          </div>
          <p className="text-sm text-brand-200 mt-6">
            이메일만 받아요. 스팸 절대 안 보내고 베타 출시 시에만 연락드립니다.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400 text-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white">
              <span className="text-2xl">📞</span>
              <span className="font-bold">Callmate</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">
                이용약관
              </a>
              <a href="#" className="hover:text-white">
                개인정보처리방침
              </a>
              <a href="mailto:hello@callmate.app" className="hover:text-white">
                문의
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            © 2026 Callmate. Built for Korean Americans, by a Korean American.
          </div>
        </div>
      </footer>
    </main>
  );
}
