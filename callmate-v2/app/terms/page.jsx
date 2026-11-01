import { LegalPage, CONTACT } from "@/app/components/Legal";
export const metadata = { title: "Terms of Service — My Side Call" };

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" updated="October 31, 2026">
      <h2>1. The service</h2>
      <p>My Side Call ("the service"), operated by HARUDAOL LLC ("we"), places phone calls in the United States on your behalf using an AI assistant. By signing in you agree to these terms and to our <a href="/privacy">Privacy Policy</a>.</p>

      <h2>2. Free beta</h2>
      <p>The service is currently a free beta. Each account includes <b>3 calls and 10 minutes of talk time in total</b>; a call ends automatically when the included minutes run out. The beta may close to new users, change limits, or pause at any time. Paid plans will be announced before any charge applies, and nothing is charged without your explicit purchase.</p>

      <h2>3. What you may ask for</h2>
      <p>You may only request calls that you yourself would be allowed to make to that number: reservations, appointments, customer service, questions, and similar everyday calls. You must have the right to share any phone number, name or document you give us.</p>
      <p>You may <b>not</b> use the service for: emergency services (911), medical or legal advice, debt collection, telemarketing or sales calls, harassment or threats, impersonating a specific real person, calls to numbers on a do-not-call list, or anything unlawful. We block such requests and may suspend accounts that attempt them.</p>

      <h2>4. How the assistant behaves</h2>
      <p>The assistant introduces itself as an AI assistant calling on your behalf, states that the call may be recorded, follows your request, and asks you before agreeing to anything you did not mention (a different time, an extra fee, personal details). You stay responsible for what you ask it to do and for the decisions you make when it asks you.</p>

      <h2>5. Recording</h2>
      <p>Every call is recorded and transcribed so we can give you a summary. Recording laws vary by state; the assistant discloses recording at the start of every call. Do not ask us to call a party who has told you they do not consent to recording.</p>

      <h2>6. Accuracy and liability</h2>
      <p>The assistant is an AI and can mishear, misunderstand, or be given wrong information by the other party. Summaries are a convenience, not a record you should rely on without checking. The service is provided "as is". To the fullest extent permitted by law, HARUDAOL LLC is not liable for missed appointments, failed reservations, charges agreed on a call, or any indirect or consequential loss. Our total liability for any claim is limited to the amount you paid us in the 12 months before the claim (currently $0).</p>

      <h2>7. Accounts and agents</h2>
      <p>You are responsible for your Facebook account and for any agent key you issue; treat keys like passwords. We may suspend accounts that break these terms. You can delete your account and data at any time as described in the Privacy Policy.</p>

      <h2>8. Changes and law</h2>
      <p>We may update these terms; the date at the top shows the current version and continued use means acceptance. These terms are governed by the laws of the State of New Jersey, USA. Questions: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>

      <hr />
      <h2>한국어 요약</h2>
      <p className="ko">My Side Call은 HARUDAOL LLC가 운영하는 AI 대리 전화 서비스입니다. 현재 무료 베타로 계정당 <b>3통·총 10분</b>이 제공되며, 유료 전환 시 사전에 안내하고 동의 없이는 결제되지 않습니다. 응급(911)·의료·법률 자문·채권 추심·영업 전화·괴롭힘·특정인 사칭 등은 금지됩니다. AI는 통화 첫 문장에서 AI임과 녹음 사실을 밝히고, 부탁에 없던 결정은 반드시 사용자에게 먼저 묻습니다. 모든 통화는 녹음·전사되며, AI 요약은 참고용이므로 중요한 내용은 직접 확인하세요. 서비스는 "있는 그대로" 제공되고, 예약 실패·통화 중 발생한 비용 등에 대해 당사는 책임지지 않습니다. 준거법은 미국 뉴저지주 법이며, 문의는 <a href={`mailto:${CONTACT}`}>{CONTACT}</a>로 주세요.</p>
    </LegalPage>
  );
}
