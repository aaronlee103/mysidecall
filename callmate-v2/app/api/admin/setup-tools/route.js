import { NextResponse } from "next/server";

// 1회성 관리 엔드포인트: Vapi 어시스턴트에 ask_client_question 툴 등록 + Server URL 설정
// 확인만:  GET /api/admin/setup-tools?secret=SECRET
// 적용:    GET /api/admin/setup-tools?secret=SECRET&apply=1
// 등록 완료 후에는 이 파일을 삭제해도 됩니다.

const SECRET = "mysidecall-setup-7301";

export async function GET(req) {
    const url = new URL(req.url);
    if (url.searchParams.get("secret") !== SECRET) {
          return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

  const key = process.env.VAPI_PRIVATE_KEY;
    const id = process.env.VAPI_ASSISTANT_ID;
    if (!key || !id) {
          return NextResponse.json({ error: "VAPI env vars missing" }, { status: 500 });
    }

  const headers = { Authorization: "Bearer " + key, "Content-Type": "application/json" };
    const curRes = await fetch("https://api.vapi.ai/assistant/" + id, { headers, cache: "no-store" });
    if (!curRes.ok) {
          return NextResponse.json({ error: "assistant fetch failed", status: curRes.status }, { status: 500 });
    }
    const cur = await curRes.json();

  const report = {
        name: cur.name,
        model: (cur.model && cur.model.model) || null,
        voice: cur.voice ? (cur.voice.voiceId || cur.voice.provider) : null,
        serverUrl: (cur.server && cur.server.url) || cur.serverUrl || null,
        tools: ((cur.model && cur.model.tools) || []).map(function (t) { return (t.function && t.function.name) || t.type; }),
        legacyFunctions: ((cur.model && cur.model.functions) || []).map(function (f) { return f.name; }),
        promptHead: (((cur.model && cur.model.messages) || [])[0] || {}).content ? cur.model.messages[0].content.slice(0, 300) : null,
  };

  if (url.searchParams.get("apply") !== "1") {
        return NextResponse.json({ mode: "check", report });
  }

  const webhookUrl = url.origin + "/api/vapi-webhook";

  const askTool = {
        type: "function",
        async: false,
        server: { url: webhookUrl },
        function: {
                name: "ask_client_question",
                description:
                          "Ask the client (the Korean-speaking user who requested this call) a question when you need information that was not in the briefing, or when the other party makes a proposal the client must approve (for example a different meeting time). The client sees the question on their screen and their answer will arrive as a system message. While waiting, tell the other party 'one moment please' and keep the line open. Do NOT hang up while waiting.",
                parameters: {
                          type: "object",
                          properties: {
                                      question_ko: { type: "string", description: "The question for the client, written in Korean." },
                                      context_en: { type: "string", description: "One-line summary of what the other party just said, in English." },
                          },
                          required: ["question_ko"],
                },
        },
  };

  const others = ((cur.model && cur.model.tools) || []).filter(function (t) {
        return !(t.function && t.function.name === "ask_client_question");
  });
    if (!others.some(function (t) { return t.type === "endCall"; })) {
          others.push({ type: "endCall" });
    }

  const model = Object.assign({}, cur.model, { tools: others.concat([askTool]) });
    delete model.functions;

  const patchRes = await fetch("https://api.vapi.ai/assistant/" + id, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ model: model, server: { url: webhookUrl } }),
  });
    const out = await patchRes.json();
    if (!patchRes.ok) {
          return NextResponse.json({ error: "patch failed", status: patchRes.status, detail: out }, { status: 500 });
    }

  return NextResponse.json({
        mode: "applied",
        serverUrl: (out.server && out.server.url) || null,
        tools: ((out.model && out.model.tools) || []).map(function (t) { return (t.function && t.function.name) || t.type; }),
  });
}
