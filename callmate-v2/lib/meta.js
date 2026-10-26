// Meta Model API client (hackathon, 2026-10)
// Docs: https://dev.meta.ai — OpenAI-compatible /v1/chat/completions, /v1/responses,
//       Anthropic-compatible /v1/messages, Muse Voice Transcribe /v1/asr/*
//
// One place for base URL, key and model names so every feature (call brain,
// Korean summary, document OCR, re-transcription) reads the same config.

export const META_BASE = (process.env.META_API_BASE || "https://api.meta.ai/v1").replace(/\/$/, "");
export const SPARK_MODEL = process.env.META_TEXT_MODEL || "muse-spark-1.3";

export function metaKey() {
  const k = process.env.MODEL_API_KEY;
  if (!k) throw new Error("MODEL_API_KEY is not set (Meta Model API key)");
  return k;
}

export function metaHeaders(extra = {}) {
  return {
    Authorization: `Bearer ${metaKey()}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

/**
 * Non-streaming chat completion against Muse Spark.
 * Returns the assistant message content (string) — or parsed JSON when `json: true`.
 */
export async function sparkChat({ messages, model = SPARK_MODEL, temperature = 0.3, maxTokens = 1500, json = false, tools, signal }) {
  const body = { model, messages, temperature, max_tokens: maxTokens, stream: false };
  if (json) body.response_format = { type: "json_object" };
  if (tools?.length) { body.tools = tools; body.tool_choice = "auto"; }

  const res = await fetch(`${META_BASE}/chat/completions`, {
    method: "POST",
    headers: metaHeaders(),
    body: JSON.stringify(body),
    cache: "no-store",
    signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Meta Model API ${res.status}: ${text.slice(0, 400)}`);
  }
  const data = await res.json();
  const msg = data?.choices?.[0]?.message;
  const content = typeof msg?.content === "string"
    ? msg.content
    : Array.isArray(msg?.content) ? msg.content.map((p) => p?.text || "").join("") : "";
  if (!json) return { content, message: msg, usage: data.usage };
  const cleaned = content.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
  try { return { content: JSON.parse(cleaned), message: msg, usage: data.usage }; }
  catch { throw new Error("Muse Spark did not return valid JSON: " + cleaned.slice(0, 200)); }
}

/** Muse Spark vision: an image (data: URL or https URL) plus a question. */
export async function sparkVision({ imageUrl, prompt, json = false, maxTokens = 1200 }) {
  return sparkChat({
    json,
    maxTokens,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
  });
}
