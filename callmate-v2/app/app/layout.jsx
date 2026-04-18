import Link from "next/link";

export const metadata = {
  title: "My Side Call App",
  description: "영어 전화, 대신 걸어드려요",
};

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/app" className="flex items-center gap-2">
            <span className="text-2xl">📞</span>
            <span className="font-bold text-lg">My Side Call</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            홈으로
          </Link>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
