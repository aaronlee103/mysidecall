import Link from 'next/link'

export const metadata = {
  title: '이용약관 · My Side Call',
  description: 'My Side Call 서비스 이용약관입니다.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <header className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <span aria-hidden>←</span>
            <span>홈으로</span>
          </Link>
          <h1 className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight gradient-text">
            이용약관
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            시행일 : 2026년 4월 18일
          </p>
        </header>

        <article className="prose-legal space-y-10 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">제 1 조 (목적)</h2>
            <p>
              이 약관은 harudaol LLC(이하 “회사”)가 제공하는 My Side Call(이하 “서비스”)의
              이용과 관련하여 회사와 이용자(이하 “회원”)의 권리·의무 및 책임사항, 기타
              필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">제 2 조 (정의)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>“서비스”란 회사가 AI 음성 에이전트를 통해 회원의 요청을 대행하여 영어 전화 통화를 수행하고, 그 결과를 한국어로 요약 제공하는 일체의 서비스를 말합니다.</li>
              <li>“회원”이란 본 약관에 동의하고 서비스를 이용하는 자를 말합니다.</li>
              <li>“콘텐츠”란 서비스 내에서 생성, 제공되는 통화 녹음·전사·요약 등 일체의 정보를 말합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">제 3 조 (약관의 효력 및 변경)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>본 약관은 서비스 내 공지 또는 회원에게 통지함으로써 효력을 발생합니다.</li>
              <li>회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 변경 시 변경사유와 적용일자를 명시하여 최소 7일 전에 공지합니다. 회원에게 불리한 변경의 경우 30일 전에 공지합니다.</li>
              <li>회원이 변경된 약관에 동의하지 않을 경우 이용계약을 해지할 수 있으며, 공지된 적용일 이후에도 서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 봅니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">제 4 조 (서비스의 제공)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>회사는 회원에게 다음과 같은 서비스를 제공합니다.
                <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
                  <li>AI 음성 에이전트를 통한 영어 전화 대행</li>
                  <li>통화 내용의 한국어 요약 및 스크립트 제공</li>
                  <li>실시간 통화 모니터링 및 개입 기능</li>
                  <li>기타 회사가 추가 개발 또는 제휴를 통해 회원에게 제공하는 서비스</li>
                </ul>
              </li>
              <li>서비스는 연중무휴 24시간 제공함을 원칙으로 하나, 시스템 점검·교체, 통신두절, 제 3 자(예 : 통신사, 음성 AI 제공사)의 장애 등 불가피한 사유로 일시 중단될 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">제 5 조 (이용 요금)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>베타 기간 중 일부 서비스는 무료로 제공될 수 있으며, 회사는 서비스 정식 출시와 함께 유료 요금제를 도입할 수 있습니다.</li>
              <li>유료 서비스 이용 시 회원은 회사가 정한 요금을 결제하여야 하며, 결제 수단·청구 주기·환불 기준 등 세부 사항은 서비스 내 별도의 결제 안내에 따릅니다.</li>
              <li>전자상거래 등에서의 소비자보호에 관한 법률 등 관계 법령에서 정한 청약 철회 및 환불 규정이 적용됩니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">제 6 조 (회원의 의무)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>회원은 서비스 이용 시 다음 각 호의 행위를 하여서는 아니 됩니다.
                <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
                  <li>타인의 정보를 도용하거나 허위 정보를 입력하는 행위</li>
                  <li>서비스를 이용하여 불법·기망·괴롭힘 목적의 통화를 요청하는 행위</li>
                  <li>서비스의 정상적인 운영을 고의로 방해하는 행위</li>
                  <li>회사의 지식재산권, 제 3 자의 권리를 침해하는 행위</li>
                  <li>관계 법령 및 본 약관이 금지하는 행위</li>
                </ul>
              </li>
              <li>회원은 자신이 요청한 통화의 목적과 상대방에 대해 적법한 권한과 정당한 사유를 가져야 하며, 그로 인한 분쟁의 책임은 회원에게 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">제 7 조 (서비스 이용 제한 및 계약 해지)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>회원이 본 약관 또는 관계 법령을 위반하는 경우 회사는 사전 통지 없이 서비스 이용을 제한하거나 계약을 해지할 수 있습니다.</li>
              <li>회원은 언제든지 서비스 내 탈퇴 기능 또는 문의 채널을 통해 이용계약을 해지할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">제 8 조 (책임의 제한)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>회사는 AI의 특성상 통화 결과가 회원의 의도와 완전히 일치하지 않을 수 있음을 사전에 고지하며, 회원의 최종 확인과 판단을 전제로 서비스를 제공합니다.</li>
              <li>회사는 천재지변, 전시, 통신사·AI 공급자 등 제 3 자의 장애, 회원의 귀책사유로 인한 손해에 대하여 책임을 지지 않습니다.</li>
              <li>회사의 고의 또는 중과실이 없는 한, 서비스 이용과 관련하여 회원에게 발생한 간접적·특별한·결과적 손해에 대해서는 책임을 지지 않습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">제 9 조 (준거법 및 분쟁 해결)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>본 약관은 대한민국 법령 및 회사 소재지인 미국 뉴저지주 법령에 따라 해석·적용됩니다.</li>
              <li>서비스 이용과 관련하여 분쟁이 발생한 경우 양 당사자는 우선 상호 협의를 통해 해결하도록 노력하며, 협의가 이루어지지 않을 경우 민사소송법상 관할 법원을 제 1 심 관할 법원으로 합니다.</li>
            </ol>
          </section>

          <section className="pt-6 border-t border-zinc-800">
            <h2 className="text-xl font-semibold text-white mb-3">부칙</h2>
            <p className="text-zinc-400">본 약관은 2026년 4월 18일부터 적용됩니다.</p>
          </section>
        </article>

        <footer className="mt-16 pt-8 border-t border-zinc-800 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-300 transition-colors">홈</Link>
          <Link href="/privacy" className="hover:text-zinc-300 transition-colors">개인정보처리방침</Link>
          <Link href="/contact" className="hover:text-zinc-300 transition-colors">문의</Link>
          <span className="ml-auto">© 2026 harudaol LLC</span>
        </footer>
      </div>
    </main>
  )
}
