// Vapi "custom-llm" endpoint → Muse Spark (Meta Model API).        [NEW — hackathon]
//
// Vapi POSTs an OpenAI-style chat.completions payload here for every turn of
// the phone call (system prompt + full transcript so far + tool definitions) and
// expects OpenAI-style SSE chunks back. We forward it to Meta's OpenAI-compatible
// endpoint with the Muse Spark model, strip Vapi-only fields, and pipe the
// stream straight through. Tool calls (ask_client_question, endCall) flow back
// to Vapi untouched, so the existing webhook keeps working.
//
// Auth: if LLM_PROXY_SECRET is set, Vapi must send it as
//   Authorization: Bearer <secret>   (Vapi "Custom LLM" credential)  or
//   X-LLM-Secret: <secret>
//
// Docs: https://docs.vapi.ai/customization/tool-calling-integration

import { META_BASE, SPARK_MODEL, metaKey } from "@/lib/meta";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Fields Vapi adds that an OpenAI-compatible server will not accept.
const VAPI_ONLY = new Set([
  "call", "phoneNumber", "customer", "metadata", "assistant", "timestamp",
  "destination", "credentials", "artifact", "chat", "session",
]);

function authorized(req) {
  const secret = process.env.LLM_PROXY_SECRET;
  if (!secret) return true;
  const auth = req.headers.get("authorization") || "";
  if (auth === `Bearer ${secret}`) return true;
  return req.headers.get("x-llm-secret") === secret;
}

// Keep the line alive if Meta is unreachable: one short spoken sentence, OpenAI-shaped.
function fallbackStream(text) {
  const id = "chatcmpl-fallback-" + Date.now();
  const mk = (delta, finish = null) =>
    `data: ${JSON.stringify({ id, object: "chat.completion.chunk", created: Math.floor(Date.now() / 1000), model: SPARK_MODEL, choices: [{ index: 0, delta, finish_reason: finish }] })}\n\n`;
  const body = mk({ role: "assistant", content: text }) + mk({}, "stop") + "data: [DONE]\n\n";
  return new Response(body, { status: 200, headers: sseHeaders() });
}

function sseHeaders() {
  return {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  };
}

// Normalise tool definitions: Vapi sometimes sends tools without a `parameters` object.
function cleanTools(tools) {
  if (!Array.isArray(tools)) return undefined;
  const out = tools
    .filter((t) => t && (t.type === "function" || t.function))
    .map((t) => ({
      type: "function",
      function: {
        name: t.function?.name || t.name,
        description: t.function?.description || t.description || "",
        parameters: t.function?.parameters || t.parameters || { type: "object", properties: {} },
      },
    }))
    .filter((t) => t.function.name);
  return out.length ? out : undefined;
}

// Drop message fields the upstream may reject; keep tool-call plumbing intact.
function cleanMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m) => m && m.role)
    .map((m) => {
      const o = { role: m.role };
      if (m.content !== undefined && m.content !== null) o.content = m.content;
      else if (m.role !== "assistant") o.content = "";
      if (m.name) o.name = m.name;
      if (m.tool_calls) o.tool_calls = m.tool_calls;
      if (m.tool_call_id) o.tool_call_id = m.tool_call_id;
      if (m.role === "assistant" && o.content === undefined && !o.tool_calls) o.content = "";
      return o;
    });
}

// One extra system line so the model never speaks Korean to the person on the
// phone (Korean belongs only inside ask_client_question arguments).
const PHONE_GUARD =
  "Voice rules: everything you say is spoken aloud to the other party on the phone, who speaks English. " +
  "Speak English only, one or two short sentences per turn, no markdown, no lists, no emojis. " +
  "Korean is allowed only inside the arguments of the ask_client_question tool.";

function withPhoneGuard(messages) {
  if (!messages.length) return [{ role: "system", content: PHONE_GUARD }];
  const first = messages[0];
  if (first.role === "system" && typeof first.content === "string") {
    if (first.content.includes("Voice rules:")) return messages;
    return [{ ...first, content: first.content + "\n\n" + PHONE_GUARD }, ...messages.slice(1)];
  }
  return [{ role: "system", content: PHONE_GUARD }, ...messages];
}

export async function POST(req) {
  if (!authorized(req)) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  let payload;
  try { payload = await req.json(); }
  catch { return new Response(JSON.stringify({ error: "invalid JSON" }), { status: 400 }); }

  const callId = payload?.call?.id || null;
  const body = {};
  for (const [k, v] of Object.entries(payload || {})) if (!VAPI_ONLY.has(k)) body[k] = v;

  body.model = SPARK_MODEL;                        // Vapi's `model` is a label; Muse Spark answers.
  body.messages = cleanMessages(body.messages);
  body.stream = body.stream !== false;             // Vapi always streams; honour explicit false for curl tests.
  const tools = cleanTools(body.tools);
  if (tools) { body.tools = tools; body.tool_choice = body.tool_choice || "auto"; } else { delete body.tools; delete body.tool_choice; }
  if (body.max_tokens == null) body.max_tokens = 600; // phone turns are short
  if (body.temperature == null) body.temperature = 0.4;
  // Muse Spark reasons before it speaks. On a live call we want it to answer
  // fast, and without this flag reasoning alone can eat the whole token budget
  // (observed: 1,498 reasoning tokens, no words). "minimal" measured ~1.5 s.
  if (body.reasoning_effort == null) body.reasoning_effort = process.env.META_REASONING || "minimal";
  delete body.stream_options;
  body.messages = withPhoneGuard(body.messages);

  let key;
  try { key = metaKey(); }
  catch (e) {
    console.error("[llm] " + e.message);
    return fallbackStream("I'm sorry, I'm having a technical issue on my end. Let me get back to you shortly.");
  }

  const started = Date.now();
  let upstream;
  try {
    upstream = await fetch(`${META_BASE}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", Accept: body.stream ? "text/event-stream" : "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(45000),
    });
  } catch (e) {
    console.error(`[llm] call=${callId} upstream fetch failed: ${e.message}`);
    return fallbackStream("One moment please, I'm checking on that.");
  }

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    console.error(`[llm] call=${callId} upstream ${upstream.status}: ${text.slice(0, 300)}`);
    return fallbackStream("I'm sorry, could you say that once more?");
  }

  console.log(`[llm] call=${callId} turns=${body.messages.length} tools=${tools?.length || 0} ttfb=${Date.now() - started}ms`);

  if (!body.stream) {
    return new Response(upstream.body, { status: 200, headers: { "Content-Type": "application/json" } });
  }
  return new Response(upstream.body, { status: 200, headers: sseHeaders() });
}

export async function GET() {
  return new Response(JSON.stringify({ ok: true, provider: "meta", model: SPARK_MODEL, base: META_BASE, keyConfigured: Boolean(process.env.MODEL_API_KEY) }), {
    headers: { "Content-Type": "application/json" },
  });
}
