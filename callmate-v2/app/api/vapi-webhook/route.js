import { NextResponse } from "next/server";
import { setPending } from "@/lib/pendingStore";

// Vapi 서버 URL로 설정되는 웹훅. ask_client_question 툴 콜을 받으면
// 질문 텍스트를 pendingStore에 스냅샷으로 저장해서 대시보드가 바로 볼 수 있게 함.
// async 툴이라 AI는 응답 안 기다리고 "request-start" 메시지 말하고 묵음 대기.

export async function POST(req) {
  try {
    const body = await req.json();
    const msg = body?.message || body;
    const type = msg?.type;
    const callId = msg?.call?.id || body?.call?.id;

    console.log(`[vapi-webhook] type=${type} callId=${callId}`);

    if (type === "tool-calls" || type === "function-call") {
      const list = Array.isArray(msg.toolCalls)
        ? msg.toolCalls
        : msg.functionCall
        ? [msg.functionCall]
        : msg.toolCallList || [];
      const results = [];

      for (const c of list) {
        const name = c?.function?.name || c?.name;
        const id = c?.id || c?.toolCallId;
        if (name === "ask_client_question") {
          let args = {};
          try {
            const argsStr = c.function?.arguments || c.arguments || "{}";
            args = typeof argsStr === "string" ? JSON.parse(argsStr) : argsStr;
          } catch {}

          if (callId) {
            setPending(callId, {
              question: args.question_ko || args.question || "",
              context: args.context_en || args.context || null,
              toolCallId: id,
            });
            console.log(`[vapi-webhook] saved pending for ${callId}: "${args.question_ko || args.question}"`);
          }

          results.push({
            toolCallId: id,
            result:
              "Question forwarded to the client. Tell the other party 'One moment please' and wait silently. The client's answer will arrive as a system message shortly.",
          });
        }
      }

      if (results.length > 0) {
        return NextResponse.json({ results });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("vapi-webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 200 });
  }
}
