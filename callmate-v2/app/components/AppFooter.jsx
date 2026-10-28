"use client";
// Small footer for /app — credits the Meta models the product runs on.  [NEW — hackathon]
import { useLang } from "@/app/components/Lang";

export default function AppFooter() {
  const { t } = useLang();
  return (
    <footer className="mx-auto max-w-5xl px-4 sm:px-6 pb-8 pt-4 text-[11px] text-ink-500">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-line pt-4">
        <span className="font-semibold text-ink-400">{t("foot.built")}</span>
        <Chip>Muse Spark</Chip>
        <Chip>Muse Voice Transcribe</Chip>
        <Chip>Facebook Login</Chip>
        <span className="ml-auto">© 2026 HARUDAOL LLC · <a href="/privacy" className="hover:text-ink-100">Privacy</a> · <a href="/terms" className="hover:text-ink-100">Terms</a></span>
      </div>
    </footer>
  );
}
function Chip({ children }) {
  return <span className="rounded-full border border-line bg-paper px-2 py-0.5 text-[10.5px] font-medium text-ink-400">{children}</span>;
}
