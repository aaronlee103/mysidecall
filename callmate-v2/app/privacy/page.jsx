import { LegalPage, CONTACT } from "@/app/components/Legal";
export const metadata = { title: "Privacy Policy — My Side Call" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="October 31, 2026">
      <h2>What My Side Call does</h2>
      <p>My Side Call places real phone calls on your behalf using an AI assistant. You describe what you need in your own language; the assistant speaks with the other party in English, may ask you questions during the call, and gives you a summary afterwards.</p>

      <h2>What we collect</h2>
      <p><b>Account.</b> When you sign in with Facebook we receive your name, email address, profile picture and a Facebook user ID. We use them only to identify your account and show you your own calls. We never post to Facebook and never read your friends, posts or messages.</p>
      <p><b>Calls.</b> The request you type, the phone number you ask us to call, any document photo you attach (for example a bill), the call audio and transcript, and the AI-generated summary.</p>
      <p><b>Agent access.</b> If you connect an AI agent (Meta Muse, Claude or another MCP client), we store the phone number and language you give it so the agent can call you back. Agent keys are signed tokens; we can revoke them on request.</p>
      <p><b>Technical.</b> Standard server logs (IP address, browser, timestamps) kept for security and debugging.</p>

      <h2>Call recording and AI disclosure</h2>
      <p>Calls are recorded so the summary can be produced and so you can review what was said. In the first sentence of every call the assistant says that it is an AI assistant calling on your behalf and that the call may be recorded, and it asks whether now is a good time. You are responsible for only requesting calls you are allowed to make to that number.</p>

      <h2>Who processes it</h2>
      <p>Telephony, speech-to-text and text-to-speech are provided by <b>Vapi</b> and its carriers (voices by ElevenLabs). The AI that speaks on the call, reads documents and writes your summary is <b>Meta Muse Spark</b>; transcript clean-up uses <b>Meta Muse Voice</b>, both via the Meta Model API. Hosting is on <b>Vercel</b>. These providers process data under their own terms and only to deliver the service.</p>

      <h2>How long we keep it</h2>
      <p>Call recordings, transcripts and summaries are kept so you can revisit them, and are deleted on request (below). Server logs are kept for up to 30 days.</p>

      <h2>What we don't do</h2>
      <p>We do not sell your data and do not use your calls for advertising or to train models. We do not place emergency (911), medical-advice or legal-advice calls, and the assistant never agrees to anything you did not ask for without checking with you first.</p>

      <h2 id="delete">Deleting your data</h2>
      <p>Email <a href={`mailto:${CONTACT}?subject=Delete%20my%20My%20Side%20Call%20data`}>{CONTACT}</a> from the address on your account with the subject "Delete my My Side Call data", or remove the app from your Facebook settings (Settings → Apps and Websites → My Side Call → Remove). We delete your account record and all call recordings, transcripts and summaries within 30 days and confirm by email.</p>

      <h2>Children</h2>
      <p>My Side Call is not directed to children under 13 and we do not knowingly collect their data.</p>

      <h2>Contact</h2>
      <p>HARUDAOL LLC · Cresskill, NJ · <a href={`mailto:${CONTACT}`}>{CONTACT}</a></p>

      <h2>Changes</h2>
      <p>If this policy changes materially we will update the date at the top of this page.</p>

      <hr />
      <h2>한국어 요약</h2>
      <p className="ko">Facebook 로그인 시 이름·이메일·프로필 사진·사용자 ID만 받습니다(게시 안 함). 통화 요청문, 전화번호, 첨부한 사진, 통화 녹음·대화 내용·요약이 저장됩니다. 모든 통화는 녹음되며, AI는 첫 문장에서 AI 비서임과 녹음 사실을 밝힙니다. 전화선·음성은 Vapi, 통화 AI·요약·문서 읽기는 Meta Muse Spark, 전사 정리는 Muse Voice가 처리합니다. 데이터를 팔거나 광고·모델 학습에 쓰지 않습니다. 삭제를 원하시면 <a href={`mailto:${CONTACT}`}>{CONTACT}</a>로 요청하시면 30일 안에 삭제하고 회신합니다.</p>
    </LegalPage>
  );
}
