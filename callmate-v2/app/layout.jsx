import "./globals.css";

export const metadata = {
  title: "My Side Call — Your AI. Your Call. Any Language.",
  description:
    "Your AI makes the phone call for you, in English or any language, checks back with you mid-call, and summarizes it in your language.",
  openGraph: {
    title: "My Side Call",
    description: "Your AI. Your Call. Any Language.",
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  themeColor: "#faf6ef",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap" />
      </head>
      <body className="min-h-screen bg-ink-950 text-ink-100 antialiased selection:bg-brand-500/40">
        {children}
      </body>
    </html>
  );
}
