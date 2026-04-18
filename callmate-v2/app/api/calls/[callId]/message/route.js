import { NextResponse } from "next/server";
import { injectMessage } from "@/lib/vapi";

export async function POST(req, { params }) {
  try {
    const { callId } = params;
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "메시지가 비어있어요" },
        { status: 400 }
      );
    }

    await injectMessage(callId, message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Message inject failed:", err);
    return NextResponse.json(
      { error: err.message || "메시지 전달 실패" },
      { status: 500 }
    );
  }
}
