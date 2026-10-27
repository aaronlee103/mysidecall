import { NextResponse } from "next/server";
import { endCall, getCall } from "@/lib/vapi";
import { getViewer, ownsCall } from "@/lib/viewer";

export async function POST(req, { params }) {
  try {
    const { callId } = params;
    const viewer = await getViewer();
    if (!viewer) return NextResponse.json({ error: "sign in required" }, { status: 401 });
    if (!ownsCall(viewer, await getCall(callId))) return NextResponse.json({ error: "not your call" }, { status: 403 });
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
