import Link from "next/link";

export const metadata = {
  title: "My Side Call App",
  description: "영어 전화, 대신 걸어드려요",
};

export default function AppLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-ink-950">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-grid-dim bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[140px]"
      />

      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link
            href="/app"
            className="group flex items-center gap-2.5 text-ink-100"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-pink text-white shadow-lg shadow-brand-500/30 transition-transform duration-300 group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              My Side Call
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="rounded-full px-3 py-1.5 text-[13px] font-medium text-ink-400 transition-colors hover:text-ink-100"
            >
              홈
            </Link>
            <Link
              href="/app/new"
              className="rounded-full bg-white/5 px-3.5 py-1.5 text-[13px] font-medium text-ink-100 ring-1 ring-inset ring-white/10 transition-all hover:bg-white/10 hover:ring-white/20"
            >
              새 통화
            </Link>
          </nav>
        </div>
      </header>
      <main className="relative mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
