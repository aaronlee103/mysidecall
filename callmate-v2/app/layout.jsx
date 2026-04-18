import "./globals.css";

export const metadata = {
  title: "My Side Call — 영어 전화, 대신 걸어드려요",
  description:
    "고객센터·집주인·보험사에 한국어로 상황만 말하면, AI가 자연스러운 영어로 대신 전화합니다. 재미 한인을 위한 영어 전화 대행 앱.",
  openGraph: {
    title: "My Side Call — 영어 전화, 대신 걸어드려요",
    description:
      "고객센터·집주인·보험사에 한국어로 상황만 말하면, AI가 자연스러운 영어로 대신 전화합니다.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Side Call — 영어 전화, 대신 걸어드려요",
    description:
      "고객센터·집주인·보험사에 한국어로 상황만 말하면, AI가 자연스러운 영어로 대신 전화합니다.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
