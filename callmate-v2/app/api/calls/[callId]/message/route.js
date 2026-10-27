import { NextResponse } from "next/server";
import { injectMessage, getCall } from "@/lib/vapi";
import { getViewer, ownsCall } from "@/lib/viewer";
import { clearPending } from "@/lib/pendingStore";

// 사용자가 대시보드에서 답변을 입력하면 호출됨. Vapi에 system 메시지로
// 주입하고 pendingStore 에서 해당 통화의 질문 스냅샷을 지워서 질문 박스가
// 사라지게 함.
export async function POST(req, { params }) {
  try {
    const { callId } = params;
    const viewer = await getViewer();
    if (!viewer) return NextResponse.json({ error: "sign in required" }, { status: 401 });
    if (!ownsCall(viewer, await getCall(callId))) return NextResponse.json({ error: "not your call" }, { status: 403 });
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "메시지가 비어있어요" }, { status: 400 });
    }
    await injectMessage(callId, message);
    clearPending(callId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Message inject failed:", err);
    return NextResponse.json({ error: err.message || "메시지 전달 실패" }, { status: 500 });
  }
}
