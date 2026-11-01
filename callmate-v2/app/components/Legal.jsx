// Shared shell for /privacy and /terms — paper theme, Fredoka, one column.
export const CONTACT = "hello@mysidecall.com";
export const COMPANY = "HARUDAOL LLC, Cresskill, New Jersey, USA";

export function LegalPage({ title, updated, children }) {
  return (
    <div style={{ background: "#F7F2E8", minHeight: "100vh", color: "#1E1915", fontFamily: "Fredoka, Pretendard, ui-sans-serif, system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap" rel="stylesheet" />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px", lineHeight: 1.65, fontSize: 16 }}>
        <a href="/" style={{ color: "#9A9088", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>← My Side <span style={{ color: "#E2603F" }}>Call</span></a>
        <h1 style={{ fontSize: 40, letterSpacing: "-.02em", lineHeight: 1, margin: "22px 0 10px", fontWeight: 600 }}>{title}</h1>
        <p style={{ color: "#9A9088", fontSize: 14, margin: "0 0 28px" }}>Last updated {updated} · {COMPANY} · <a href={`mailto:${CONTACT}`} style={{ color: "#E2603F" }}>{CONTACT}</a></p>
        <style>{`.legal h2{font-size:22px;font-weight:600;margin:34px 0 8px;letter-spacing:-.01em}.legal p,.legal li{margin:0 0 10px;color:#3a332d}.legal ul{padding-left:20px;margin:0 0 10px}.legal a{color:#E2603F}.legal hr{border:0;border-top:2px dashed #DED5C6;margin:40px 0}.legal .ko{color:#4b443e}`}</style>
        <div className="legal">{children}</div>
        <p style={{ marginTop: 48, fontSize: 13, color: "#9A9088" }}>© 2026 HARUDAOL LLC · <a href="/privacy" style={{ color: "#9A9088" }}>Privacy</a> · <a href="/terms" style={{ color: "#9A9088" }}>Terms</a> · <a href={`mailto:${CONTACT}`} style={{ color: "#9A9088" }}>Contact</a></p>
      </main>
    </div>
  );
}
