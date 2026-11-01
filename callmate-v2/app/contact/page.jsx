import { LegalPage, CONTACT } from "@/app/components/Legal";
import Mascot from "@/app/components/Mascot";
export const metadata = { title: "Contact — My Side Call" };

const Row = ({ title, subject, children }) => (
  <p><b>{title}</b> — {children} <a href={`mailto:${CONTACT}?subject=${encodeURIComponent(subject)}`}>Email us →</a></p>
);

export default function Contact() {
  return (
    <LegalPage title="Contact" updated="November 1, 2026">
      <div style={{ width: 220, margin: "-8px 0 18px" }}><Mascot mood="wave" /></div>
      <p style={{ fontSize: 20, fontWeight: 500 }}>One address for everything: <a href={`mailto:${CONTACT}`}>{CONTACT}</a></p>
      <p>We're a small team in New Jersey and answer in English or Korean, usually within one business day.</p>

      <h2>What to write</h2>
      <Row title="Something went wrong on a call" subject="Call issue">Send the date, the number you asked us to call, and what happened. Including the call link from your dashboard helps.</Row>
      <Row title="Delete my account and data" subject="Delete my My Side Call data">Write from the email on your Facebook account. We delete everything within 30 days and confirm. Details in the <a href="/privacy#delete">Privacy Policy</a>.</Row>
      <Row title="Paid plans / more minutes" subject="My Side Call launch">The beta includes 3 calls and 10 minutes. Tell us you want in and we'll email you when paid plans open.</Row>
      <Row title="Connect my agent or app" subject="Agent / MCP">Questions about the MCP server, Meta Muse connector, or agent keys.</Row>
      <Row title="Press, partnerships, or the hackathon" subject="Press / partnership">We're happy to talk.</Row>

      <h2>Company</h2>
      <p>HARUDAOL LLC<br />Cresskill, New Jersey, USA<br /><a href={`mailto:${CONTACT}`}>{CONTACT}</a></p>

      <hr />
      <h2>한국어</h2>
      <p className="ko">문의는 모두 <a href={`mailto:${CONTACT}`}>{CONTACT}</a> 한 곳으로 보내 주세요. 한국어·영어 모두 가능하며 보통 1영업일 안에 답장드립니다. 통화 문제는 날짜·전화번호·상황을, 계정 삭제는 Facebook 계정 이메일로 요청해 주시면 30일 안에 처리합니다.</p>
    </LegalPage>
  );
}
