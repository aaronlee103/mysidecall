import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { JUDGE_COOKIE, verifyJudgeCookie } from "@/lib/judge";

const ADMIN_COOKIE = "mysidecall_admin";

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * /app/* and /api/calls/* require a signed-in user:
 *   - Facebook Login session (Auth.js JWT), or
 *   - the owner's ADMIN_PASSWORD cookie (legacy fallback).
 * Pages redirect to /login, API calls get 401 JSON.
 */
export async function middleware(req) {
  const { pathname, search } = req.nextUrl;

  const token = process.env.NEXTAUTH_SECRET
    ? await getToken({ req, secret: process.env.NEXTAUTH_SECRET }).catch(() => null)
    : null;
  if (token?.uid) return NextResponse.next();

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminPassword) {
    const expected = await sha256(adminPassword);
    if (req.cookies.get(ADMIN_COOKIE)?.value === expected) return NextResponse.next();
  }

  if (await verifyJudgeCookie(req.cookies.get(JUDGE_COOKIE)?.value)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "sign in required" }, { status: 401 });
  }
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/app", "/app/:path*", "/api/calls", "/api/calls/:path*"],
};
