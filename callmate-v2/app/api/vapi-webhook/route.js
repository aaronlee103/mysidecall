import { NextResponse } from "next/server";

// Vapi 서버 URL로 설정되는 웹훅. 현재는 로깅 용도 + 툴 콜에 대한 즉시 ACK.
// ask_client_question 툴은 async로 설정돼 있어 AI가 서버 응답을 기다리지 않고
// request-start 메시지("One moment please, let me check with my client.")만 말하고
// 다음 지시를 기다려요 (클라이언트가 /api/calls/[id]/message 로 보낼 때까지).
//
// 참고: Vapi 메시지 종류
//   - "function-call" / "tool-calls": AI가 툴 호출
//   - "end-of-call-report": 통화 종료 리포트
//   - "status-update", "speech-update", "conversation-update": 실시간 이벤트
//   - "hang": 무응답 hangup
//   - "transcript": 실시간 전사

export async function POST(req) {
  try {
    const body = await req.json();
    const msg = body?.message || body;
    const type = msg?.type;

    // 간단 로깅 (Vercel 로그에서 확인 가능)
    console.log(`[vapi-webhook] type=${type}`);

    // 툴 콜 처리: ask_client_question
    if (type === "tool-calls" || type === "function-call") {
      const toolCalls = msg.toolCalls || msg.functionCall ? [msg.functionCall] : msg.toolCallList || [];
      const results = [];

      // tool-calls 포맷 (여러 개 올 수 있음)
      const list = Array.isArray(msg.toolCalls) ? msg.toolCalls : toolCalls;
      for (const c of list) {
        const name = c?.function?.name || c?.name;
        const id = c?.id || c?.toolCallId;
        if (name === "ask_client_question") {
          // 즉시 ACK. 실제 답변은 클라이언트가 /api/calls/[id]/message 로 보냄.
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

    // end-of-call-report, status-update 등은 단순 ACK
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("vapi-webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 200 });
    // 500을 반환하면 Vapi가 재시도해서 통화 흐름이 꼬일 수 있음 → 200으로 무마
  }
}
