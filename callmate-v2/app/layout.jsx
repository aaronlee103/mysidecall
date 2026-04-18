import "./globals.css";

export const metadata = {
  title: "My Side Call — 영어 전화, 대신 걸어드려요",
  description:
    "AI가 당신 대신 영어로 전화합니다. 한국어로 상황만 말해주세요. 중간에 끼어들어 지시하거나 답을 전달할 수 있어요.",
  openGraph: {
    title: "My Side Call",
    description: "AI가 대신 거는 영어 전화 — 중간에 끼어들어 조율 가능",
  },
  twitter: { card: "summary_large_image" },
  themeColor: "#09090b",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="dark">
      <body className="min-h-screen bg-ink-950 text-ink-100 antialiased selection:bg-brand-500/40">
        {children}
      </body>
    </html>
  );
}
