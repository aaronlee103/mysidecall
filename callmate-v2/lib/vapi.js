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

// Voice selection. Vapi's built-in voices are `vapi/<Name>`; ElevenLabs voices (more
// natural, billed through Vapi) are referenced by id. Accepts "Elliot", "vapi:Elliot",
// "11labs:<voiceId>" or a full voice object.   [NEW — hackathon]
export function voiceSpec(voice) {
  if (!voice) return undefined;
  if (typeof voice === "object") return voice;
  const [prov, id] = voice.includes(":") ? voice.split(":", 2) : ["vapi", voice];
  if (prov === "11labs") return { provider: "11labs", voiceId: id, model: process.env.ELEVENLABS_MODEL || "eleven_turbo_v2_5", stability: 0.5, similarityBoost: 0.75 };
  if (prov === "cartesia") return { provider: "cartesia", voiceId: id };
  if (prov === "openai") return { provider: "openai", voiceId: id };
  return { provider: "vapi", voiceId: id };
}

// 아웃바운드 전화 시작
export async function createOutboundCall({
  phoneNumber,
  userName,
  briefing,
  voice,
  metadata,
  clientLang,
  attachmentSummaries,
  earliestAt,          // ISO datetime → Vapi schedules the call instead of dialing now  [NEW — hackathon]
  assistantOverridesExtra, // extra overrides merged in (e.g. a different system prompt for owner calls)
}) {
  const body = {
    assistantId: process.env.VAPI_ASSISTANT_ID,
    phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
    customer: {
      number: phoneNumber,
    },
    ...(earliestAt ? { schedulePlan: { earliestAt } } : {}),
    // Who asked for this call (Facebook user id) — how the dashboard finds "my calls" without a DB.
    ...(metadata ? { metadata } : {}),
    assistantOverrides: {
      variableValues: {
        user_name: userName || "my client",
        briefing_content: briefing || "",
        attachment_summaries: attachmentSummaries || "None",
        client_language: clientLang || "ko",
      },
      ...(voice ? { voice: voiceSpec(voice) } : {}),
      ...(assistantOverridesExtra || {}),
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
  const content = `The user has just provided you this information (in their own language; use the meaning): "${userMessageKo}". Please use this information naturally in your next response to the other party.`;

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

// 어시스턴트 설정 조회 (owner-call 프롬프트 오버라이드에 모델 설정을 재사용)  [NEW — hackathon]
export async function getAssistant(id = process.env.VAPI_ASSISTANT_ID) {
  return vapiFetch(`/assistant/${id}`);
}
