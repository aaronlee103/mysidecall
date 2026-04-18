import { NextResponse } from "next/server";
import { getCall } from "@/lib/vapi";

export async function GET(req, { params }) {
  try {
    const { callId } = params;
    const call = await getCall(callId);

    // 프론트엔드가 필요한 필드만 추출
    const response = {
      id: call.id,
      status: call.status, // queued / ringing / in-progress / ended / failed
      startedAt: call.startedAt,
      endedAt: call.endedAt,
      endedReason: call.endedReason,
      cost: call.cost,
      transcript: call.transcript || "",
      messages: call.messages || [],
      summary: call.summary || null,
      customer: call.customer,
      recordingUrl: call.recordingUrl,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Call fetch failed:", err);
    return NextResponse.json(
      { error: err.message || "통화 조회 실패" },
      { status: 500 }
    );
  }
}
