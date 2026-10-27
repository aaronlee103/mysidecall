// Vapi API 래퍼
// 문서: https://docs.vapi.ai/api-reference

const VAPI_BASE = "https://api.vapi.ai";

function getApiKey() {
  const key = process.env.VAPI_PRIVATE_KEY;
  if (!key) {
    throw new Error("VAPI_PRIVATE_KEY 환경변수가 설정되지 않았어요");
  }
  return key;
}

async function vapiFetch(path, options = {}) {
  const res = await fetch(`${VAPI_BASE}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vapi API ${res.status}: ${text}`);
  }

  return res.json();
}

// 아웃바운드 전화 시작
export async function createOutboundCall({
  phoneNumber,
  userName,
  briefing,
  voice,
  metadata,
}) {
  const body = {
    assistantId: process.env.VAPI_ASSISTANT_ID,
    phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
    customer: {
      number: phoneNumber,
    },
    // Who asked for this call (Facebook user id) — how the dashboard finds "my calls" without a DB.
    ...(metadata ? { metadata } : {}),
    assistantOverrides: {
      variableValues: {
        user_name: userName || "my client",
        briefing_content: briefing || "",
        attachment_summaries: "None",
      },
      ...(voice ? { voice: { provider: "vapi", voiceId: voice } } : {}),
    },
  };

  return vapiFetch("/call/phone", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// 통화 상태·transcript 조회
export async function getCall(callId) {
  return vapiFetch(`/call/${callId}`);
}

// 진행 중인 통화에 메시지 주입 (사용자 개입)
export async function injectMessage(callId, userMessageKo) {
  // 한국어 사용자 메시지를 시스템 메시지로 AI에게 전달
  // AI가 맥락 파악해서 영어로 상대방에게 전달
  const content = `The user has just provided you this information (originally in Korean, translated for you): "${userMessageKo}". Please use this information naturally in your next response to the other party.`;

  return vapiFetch(`/call/${callId}/control`, {
    method: "POST",
    body: JSON.stringify({
      type: "add-message",
      message: {
        role: "system",
        content,
      },
    }),
  });
}

// 통화 강제 종료
export async function endCall(callId) {
  return vapiFetch(`/call/${callId}/control`, {
    method: "POST",
    body: JSON.stringify({
      type: "end-call",
    }),
  });
}

// 최근 통화 목록 (이 어시스턴트 기준). 대시보드가 metadata.userId 로 "내 통화"만 거른다.
export async function listCalls({ limit = 100 } = {}) {
  const q = new URLSearchParams({ limit: String(limit) });
  if (process.env.VAPI_ASSISTANT_ID) q.set("assistantId", process.env.VAPI_ASSISTANT_ID);
  return vapiFetch(`/call?${q.toString()}`);
}
