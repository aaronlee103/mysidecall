import { NextResponse } from "next/server";
import { createOutboundCall } from "@/lib/vapi";

export async function POST(req) {
  try {
    const { phoneNumber, userName, briefing, voiceId } = await req.json();

    if (!phoneNumber || !briefing) {
      return NextResponse.json(
        { error: "전화번호와 브리핑은 필수예요" },
        { status: 400 }
      );
    }

    // E.164 포맷으로 정규화 (+1 prefix가 없으면 붙임)
    let normalized = phoneNumber.replace(/[^\d+]/g, "");
    if (!normalized.startsWith("+")) {
      normalized = `+1${normalized}`;
    }

    const call = await createOutboundCall({
      phoneNumber: normalized,
      userName: userName || "my client",
      briefing,
      voice: voiceId,
    });

    return NextResponse.json({ callId: call.id });
  } catch (err) {
    console.error("Call creation failed:", err);
    return NextResponse.json(
      { error: err.message || "통화 시작 실패" },
      { status: 500 }
    );
  }
}
