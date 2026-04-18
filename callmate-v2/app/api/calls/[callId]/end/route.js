import { NextResponse } from "next/server";
import { endCall } from "@/lib/vapi";

export async function POST(req, { params }) {
  try {
    const { callId } = params;
    await endCall(callId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Call end failed:", err);
    return NextResponse.json(
      { error: err.message || "통화 종료 실패" },
      { status: 500 }
    );
  }
}
