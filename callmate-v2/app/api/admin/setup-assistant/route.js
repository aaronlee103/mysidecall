// Admin: inspect the Vapi assistant and switch its brain.               [NEW — hackathon]
//
//   GET /api/admin/setup-assistant?secret=…              → report (model, tools, server URL)
//   GET /api/admin/setup-assistant?secret=…&apply=meta   → brain = Muse Spark via /api/llm (custom-llm)
//   GET /api/admin/setup-assistant?secret=…&apply=openai → brain = OpenAI gpt-4.1 (rollback)
//
// Both modes keep the same system prompt and the same tools (endCall,
// ask_client_question → /api/vapi-webhook). Secret comes from ADMIN_SETUP_SECRET
// (falls back to ADMIN_PASSWORD) — never hard-coded.

import { NextResponse } from "next/server";
import { SPARK_MODEL } from "@/lib/meta";

export const dynamic = "force-dynamic";

const VAPI = "https://api.vapi.ai";

function askClientTool(webhookUrl) {
  return {
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
}

export async function GET(req) {
  const url = new URL(req.url);
  const secret = process.env.ADMIN_SETUP_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret || url.searchParams.get("secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const key = process.env.VAPI_PRIVATE_KEY;
  const id = process.env.VAPI_ASSISTANT_ID;
  if (!key || !id) return NextResponse.json({ error: "VAPI env vars missing" }, { status: 500 });

  const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  const curRes = await fetch(`${VAPI}/assistant/${id}`, { headers, cache: "no-store" });
  if (!curRes.ok) return NextResponse.json({ error: "assistant fetch failed", status: curRes.status }, { status: 500 });
  const cur = await curRes.json();

  const describe = (a) => ({
    name: a.name,
    provider: a.model?.provider || null,
    model: a.model?.model || null,
    customLlmUrl: a.model?.url || null,
    voice: a.voice ? a.voice.voiceId || a.voice.provider : null,
    transcriber: a.transcriber ? `${a.transcriber.provider}/${a.transcriber.model || ""}` : null,
    serverUrl: a.server?.url || a.serverUrl || null,
    tools: (a.model?.tools || []).map((t) => t.function?.name || t.type),
    promptHead: a.model?.messages?.[0]?.content?.slice(0, 200) || null,
  });

  const apply = url.searchParams.get("apply");
  if (!apply) return NextResponse.json({ mode: "check", report: describe(cur) });

  const origin = process.env.PUBLIC_BASE_URL || url.origin;
  const webhookUrl = `${origin}/api/vapi-webhook`;
  const messages = cur.model?.messages || [];
  const others = (cur.model?.tools || []).filter((t) => t.function?.name !== "ask_client_question");
  if (!others.some((t) => t.type === "endCall")) others.push({ type: "endCall" });
  const tools = [...others, askClientTool(webhookUrl)];

  let model;
  if (apply === "meta") {
    model = {
      provider: "custom-llm",
      url: `${origin}/api/llm/chat/completions`,
      model: SPARK_MODEL,
      temperature: cur.model?.temperature ?? 0.4,
      maxTokens: cur.model?.maxTokens ?? 350,
      messages,
      tools,
    };
  } else if (apply === "openai") {
    model = {
      provider: "openai",
      model: "gpt-4.1",
      temperature: cur.model?.temperature ?? 0.4,
      maxTokens: cur.model?.maxTokens ?? 350,
      messages,
      tools,
    };
  } else {
    return NextResponse.json({ error: "apply must be 'meta' or 'openai'" }, { status: 400 });
  }

  const patchRes = await fetch(`${VAPI}/assistant/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ model, server: { url: webhookUrl } }),
  });
  const out = await patchRes.json().catch(() => ({}));
  if (!patchRes.ok) return NextResponse.json({ error: "patch failed", status: patchRes.status, detail: out }, { status: 500 });

  return NextResponse.json({ mode: `applied:${apply}`, report: describe(out) });
}
