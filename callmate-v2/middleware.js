import { NextResponse } from "next/server";

const ADMIN_COOKIE = "mysidecall_admin";

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * /app 이하 모든 페이지와 /api/calls API를 관리자 전용으로 보호합니다.
 * 쿠키가 없거나 일치하지 않으면 /admin-login 페이지로 리디렉트.
 * 인증은 ADMIN_PASSWORD 환경변수로 관리.
 */
export async function middleware(req) {
  const { pathname, search } = req.nextUrl;

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return new NextResponse(
      "ADMIN_PASSWORD 환경변수가 설정되지 않았습니다.",
      { status: 503 }
    );
  }

  const expected = await sha256(adminPassword);
  const cookieValue = req.cookies.get(ADMIN_COOKIE)?.value;

  if (cookieValue === expected) {
    return NextResponse.next();
  }

  // API 요청은 401 JSON 반환
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "인증이 필요합니다" },
      { status: 401 }
    );
  }

  // 페이지는 로그인 페이지로 리디렉트
  const loginUrl = new URL("/admin-login", req.url);
  loginUrl.searchParams.set("redirect", pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/app", "/app/:path*", "/api/calls/:path*"],
};
