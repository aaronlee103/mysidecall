// Landing page — cream/terracotta design (Oct 27, 2026). Markup lives in
// app/landing/landing-body.html, copy toggles EN/한국어 in landing-script.js.
// Rendered as static HTML so the design file stays the single source of truth.
import { LANDING_CSS, LANDING_HTML, LANDING_JS } from "./landing/content";

export const metadata = {
  title: "My Side Call — Your AI. Your Call. Any Language.",
  description: "Tell us what you need in your language. Your AI makes the real phone call, checks back with you, and gives you a summary. Built for people and for AI agents.",
};

export default function Landing() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: LANDING_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: LANDING_HTML }} />
      <script dangerouslySetInnerHTML={{ __html: LANDING_JS }} />
    </>
  );
}
