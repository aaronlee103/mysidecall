import { NextResponse } from "next/server";

const ADMIN_COOKIE = "mysidecall_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7일

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD 환경변수가 설정되지 않았어요" },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  }

  const { password } = body || {};
  if (!password || typeof password !== "string") {
    return NextResponse.json(
      { error: "비밀번호를 입력해주세요" },
      { status: 400 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json(
      { error: "비밀번호가 틀렸어요" },
      { status: 401 }
    );
  }

  const token = await sha256(adminPassword);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}

// Sign out of the owner (legacy) cookie.  [NEW — hackathon]
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 0 });
  return res;
}
