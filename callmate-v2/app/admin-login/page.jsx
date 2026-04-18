"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/app";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = redirect;
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "로그인 실패");
    } catch (err) {
      setError("네트워크 오류: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
    >
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🔒</div>
        <h1 className="text-xl font-bold">관리자 전용</h1>
        <p className="text-sm text-gray-500 mt-2">
          이 페이지는 관리자만 접근할 수 있어요
        </p>
      </div>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        autoFocus
        required
      />

      {error && (
        <p className="text-sm text-red-600 mt-3" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !password}
        className="w-full mt-4 bg-black text-white rounded-lg py-3 font-semibold disabled:opacity-50 transition-opacity"
      >
        {loading ? "확인 중..." : "접속"}
      </button>

      <p className="text-xs text-gray-400 text-center mt-6">
        비밀번호를 잊으셨다면 관리자에게 문의하세요.
      </p>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
