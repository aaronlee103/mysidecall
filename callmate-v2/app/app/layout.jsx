import Providers from "@/app/components/Providers";
import UserMenu from "@/app/components/UserMenu";
import AppHeader from "@/app/components/AppHeader";
import { LangProvider } from "@/app/components/Lang";
import AppFooter from "@/app/components/AppFooter";

export const metadata = {
  title: "My Side Call",
  description: "Your AI. Your Call. Any Language.",
};

export default function AppLayout({ children }) {
  return (
    <Providers>
      <LangProvider>
        <div className="relative min-h-screen bg-ink-950 text-ink-100">
          {/* Warm ambient background */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 bg-grid-dim bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none fixed -top-48 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand-200/40 blur-[140px]"
          />
          <AppHeader userMenu={<UserMenu />} />
          <main className="relative mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">{children}</main>
          <AppFooter />
        </div>
      </LangProvider>
    </Providers>
  );
}
