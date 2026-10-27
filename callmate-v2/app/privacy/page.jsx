export const metadata = { title: "Privacy Policy — My Side Call" };

const S = { maxWidth: 760, margin: "0 auto", padding: "56px 24px 80px", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", color: "#28211d", lineHeight: 1.7 };
const H = { fontSize: 20, marginTop: 36, letterSpacing: "-.3px" };

export default function Privacy() {
  return (
    <div style={{ background: "#faf6ef", minHeight: "100vh" }}>
      <main style={S}>
        <a href="/" style={{ color: "#8b8177", textDecoration: "none", fontSize: 14 }}>← My Side Call</a>
        <h1 style={{ fontSize: 34, letterSpacing: "-1.2px", margin: "18px 0 6px" }}>Privacy Policy</h1>
        <p style={{ color: "#746d66" }}>Last updated: October 27, 2026 · HARUDAOL LLC, Cresskill, NJ · <a href="mailto:aaronlee103@gmail.com">aaronlee103@gmail.com</a></p>

        <h2 style={H}>What My Side Call does</h2>
        <p>My Side Call places real phone calls on your behalf using an AI assistant. You describe what you need; the assistant speaks with the other party, may ask you questions during the call, and gives you a summary afterwards.</p>

        <h2 style={H}>What we collect</h2>
        <p><b>Account.</b> When you sign in with Facebook we receive your name, email address, profile picture and a Facebook user ID. We use them only to identify your account and show your own calls to you. We do not post to Facebook and do not read your friends, posts or messages.</p>
        <p><b>Calls.</b> The request you type, the phone number you ask us to call, the call audio and transcript, and the AI-generated summary. Calls are recorded so the summary can be produced and so you can review what was said.</p>
        <p><b>Technical.</b> Standard server logs (IP address, browser, timestamps) kept for security and debugging.</p>

        <h2 style={H}>Who processes it</h2>
        <p>Telephony, speech-to-text and text-to-speech are provided by <b>Vapi</b> (and its carriers). The AI that speaks on the call and writes your summary is <b>Meta's Muse Spark</b> via the Meta Model API. Hosting is on <b>Vercel</b>. These providers process data under their own terms and only to deliver the service.</p>

        <h2 style={H}>What we don't do</h2>
        <p>We do not sell your data. We do not use your calls for advertising. We do not place emergency (911), medical-advice or legal-advice calls. The assistant identifies itself as an assistant when the other party asks.</p>

        <h2 style={H} id="delete">Deleting your data</h2>
        <p>Email <a href="mailto:aaronlee103@gmail.com">aaronlee103@gmail.com</a> from the address on your account with the subject "Delete my My Side Call data", or remove the app from your Facebook settings (Settings → Apps and Websites → My Side Call → Remove). We delete your account record and your call recordings, transcripts and summaries within 30 days and confirm by email.</p>

        <h2 style={H}>Children</h2>
        <p>My Side Call is not directed to children under 13 and we do not knowingly collect their data.</p>

        <h2 style={H}>Changes</h2>
        <p>If this policy changes materially we will note the new date at the top of this page.</p>

        <hr style={{ border: 0, borderTop: "1px solid #e9ded2", margin: "40px 0" }} />
        <h2 style={H}>한국어 요약</h2>
        <p>Facebook 로그인 시 이름·이메일·프로필 사진·사용자 ID만 받습니다(게시 안 함). 통화 요청문, 전화번호, 통화 녹음·대화 내용·요약이 저장되며, 전화선·음성인식은 Vapi, 통화 AI와 요약은 Meta Muse Spark가 처리합니다. 데이터를 팔거나 광고에 쓰지 않습니다. 삭제를 원하시면 위 이메일로 요청하시면 30일 안에 삭제하고 회신합니다.</p>
      </main>
    </div>
  );
}
