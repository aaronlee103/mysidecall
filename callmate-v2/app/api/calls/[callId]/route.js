import { NextResponse } from "next/server";
import { getCall } from "@/lib/vapi";

// 메시지 배열에서 "지금 클라이언트(=Aaron님) 답변을 기다리는 중인 질문" 추출.
// 로직: 마지막 ask_client_question 툴 콜을 찾고, 그 뒤에
//   (a) injectMessage 시스템 메시지 ("The user has just provided you this information...") 가 있거나
//   (b) 이후 assistant가 상대방과 새 대화 사이클을 진행했으면
// 이미 답변된 걸로 간주.
function extractPendingQuestion(messages) {
  if (!Array.isArray(messages)) return null;

  // Vapi가 반환하는 메시지 형식은 모델에 따라 몇 가지 변형이 있어요:
  // - { role: "tool_calls", toolCalls: [{ function: { name, arguments } }] }
  // - { role: "tool_call_result", ... }
  // - { role: "function_call", name, arguments }
  // - { role: "bot" | "assistant" | "user" | "system", message | content }
  // 아래 로직은 두 포맷 모두 커버.

  let lastQuestionIdx = -1;
  let questionKo = null;
  let contextEn = null;

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    const roleIsToolCall = m.role === "tool_calls" || m.role === "function_call";
    if (!roleIsToolCall) continue;

    let calls = [];
    if (Array.isArray(m.toolCalls)) calls = m.toolCalls;
    else if (m.name) calls = [{ function: { name: m.name, arguments: m.arguments } }];

    for (const c of calls) {
      const name = c?.function?.name || c?.name;
      if (name !== "ask_client_question") continue;
      let argsStr = c?.function?.arguments || c?.arguments || "{}";
      let args = {};
      try {
        args = typeof argsStr === "string" ? JSON.parse(argsStr) : argsStr;
      } catch {
        args = {};
      }
      lastQuestionIdx = i;
      questionKo = args.question_ko || args.question || null;
      contextEn = args.context_en || args.context || null;
    }
  }

  if (lastQuestionIdx < 0 || !questionKo) return null;

  // 툴 콜 이후에 사용자가 답변을 보냈는지 확인
  // injectMessage는 role: "system", content: "The user has just provided you this information..." 형식
  for (let j = lastQuestionIdx + 1; j < messages.length; j++) {
    const m = messages[j];
    const content = m.content || m.message || "";
    if (
      m.role === "system" &&
      typeof content === "string" &&
      content.includes("The user has just provided you this information")
    ) {
      return null; // 이미 답변됨
    }
  }

  return {
    question: questionKo,
    context: contextEn,
    askedAt: lastQuestionIdx,
  };
}

export async function GET(req, { params }) {
  try {
    const { callId } = params;
    const call = await getCall(callId);

    // 프론트엔드가 필요한 필드만 추출
    const messages = call.messages || [];
    const pendingQuestion = extractPendingQuestion(messages);

    const response = {
      id: call.id,
      status: call.status, // queued / ringing / in-progress / ended / failed
      startedAt: call.startedAt,
      endedAt: call.endedAt,
      endedReason: call.endedReason,
      cost: call.cost,
      transcript: call.transcript || "",
      messages,
      summary: call.summary || null,
      customer: call.customer,
      recordingUrl: call.recordingUrl,
      pendingQuestion, // ← NEW: AI가 지금 클라이언트에게 물어보고 있는 질문
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
