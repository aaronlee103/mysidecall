// Korean post-call brief: summary + outcome + action items, by Muse Spark.   [NEW — hackathon]
//
// GET /api/calls/:id/brief  → { summaryKo, outcome, keyFacts[], actions[], followUp, confidence }
// The call transcript (English) comes from Vapi; Muse Spark reads it and writes
// what the Korean-speaking client actually needs: what was agreed, what's still
// open, and what to put on the calendar. Cached per call in memory.

import { NextResponse } from "next/server";
import { getCall } from "@/lib/vapi";
import { sparkChat } from "@/lib/meta";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const cache = globalThis.__msc_brief_cache || (globalThis.__msc_brief_cache = new Map());

const SYSTEM = `You are the post-call desk of My Side Call, a service where an AI makes English phone calls on behalf of Korean-speaking clients in the United States.
You receive the briefing the client gave before the call and the transcript of the call ("assistant" = our AI caller, "user" = the other party on the phone).
Write for the client, in natural Korean (존댓말, 간결하게). Never invent facts that are not in the transcript. If something was not settled, say so.

Return ONLY a JSON object with these keys:
- "summaryKo": 2–4 sentences in Korean. What happened and the result.
- "outcome": one of "success" | "partial" | "failed" | "no_answer" | "unclear".
- "keyFacts": array of short Korean strings — names, dates, times, prices, confirmation numbers, addresses mentioned. Keep numbers exactly as said.
- "actions": array of objects {"title": Korean, "when": ISO-8601 datetime or null, "note": Korean or null} — things the client must do next (appointments to attend, documents to bring, callbacks to expect).
- "followUp": Korean string or null — if another call is needed, what to ask for.
- "confidence": 0–1 how sure you are the transcript supports this summary.`;

function transcriptText(call) {
  const msgs = Array.isArray(call.messages) ? call.messages : [];
  const lines = [];
  for (const m of msgs) {
    const role = m.role === "bot" || m.role === "assistant" ? "assistant" : m.role === "user" ? "user" : null;
    if (!role) continue;
    const text = (m.message || m.content || "").toString().trim();
    if (text) lines.push(`${role}: ${text}`);
  }
  if (lines.length) return lines.join("\n");
  return (call.transcript || "").toString();
}

export async function GET(req, { params }) {
  const { callId } = params;
  const force = new URL(req.url).searchParams.get("refresh") === "1";
  if (!force && cache.has(callId)) return NextResponse.json({ cached: true, ...cache.get(callId) });

  try {
    const call = await getCall(callId);
    if (call.status !== "ended") {
      return NextResponse.json({ error: "call not ended yet", status: call.status }, { status: 409 });
    }
    const transcript = transcriptText(call);
    if (!transcript.trim()) {
      const empty = { summaryKo: "통화 내용이 기록되지 않았습니다.", outcome: call.endedReason === "customer-did-not-answer" ? "no_answer" : "unclear", keyFacts: [], actions: [], followUp: null, confidence: 1 };
      cache.set(callId, empty);
      return NextResponse.json(empty);
    }

    const briefing = call.assistantOverrides?.variableValues?.briefing_content || "";
    const userName = call.assistantOverrides?.variableValues?.user_name || "";
    const { content, usage } = await sparkChat({
      json: true,
      temperature: 0.2,
      maxTokens: 1200,
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content:
            `Client name: ${userName || "(unknown)"}\n` +
            `Call to: ${call.customer?.number || "(unknown)"}\n` +
            `Call started: ${call.startedAt || ""} (America/New_York)\n` +
            `Ended reason: ${call.endedReason || ""}\n\n` +
            `BRIEFING FROM CLIENT:\n${briefing || "(none)"}\n\n` +
            `TRANSCRIPT:\n${transcript.slice(0, 24000)}`,
        },
      ],
    });

    const brief = {
      summaryKo: String(content.summaryKo || "").trim(),
      outcome: content.outcome || "unclear",
      keyFacts: Array.isArray(content.keyFacts) ? content.keyFacts.map(String).slice(0, 12) : [],
      actions: Array.isArray(content.actions)
        ? content.actions.slice(0, 8).map((a) => ({ title: String(a?.title || ""), when: a?.when || null, note: a?.note || null })).filter((a) => a.title)
        : [],
      followUp: content.followUp || null,
      confidence: typeof content.confidence === "number" ? content.confidence : null,
      model: "muse-spark-1.3",
      usage: usage || null,
      generatedAt: new Date().toISOString(),
    };
    cache.set(callId, brief);
    return NextResponse.json(brief);
  } catch (err) {
    console.error("[brief] failed:", err);
    return NextResponse.json({ error: err.message || "요약 생성 실패" }, { status: 500 });
  }
}
