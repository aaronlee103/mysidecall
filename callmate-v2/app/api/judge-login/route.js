import { NextResponse } from "next/server";
import { JUDGE_COOKIE, mintJudgeCookie, codeOk } from "@/lib/judge";
import { logLogin } from "@/lib/activity";

export async function POST(req) {
  if (!process.env.JUDGE_CODE) return NextResponse.json({ error: "judge access is not enabled" }, { status: 503 });
  const { code } = await req.json().catch(() => ({}));
  if (!codeOk(code)) return NextResponse.json({ error: "That access code isn't right." }, { status: 401 });
  const value = await mintJudgeCookie();
  await logLogin({ id: `judge-${value.split(".")[0]}`, name: "Hackathon judge", method: "judge-code" });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(JUDGE_COOKIE, value, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14 });
  return res;
}
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(JUDGE_COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
