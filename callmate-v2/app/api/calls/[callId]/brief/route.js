// Post-call brief in the client's language: summary + outcome + action items, by Muse Spark.   [NEW — hackathon]
//
// GET /api/calls/:id/brief[?lang=ko|en|es|ja|zh]  → { lang, summary, summaryKo, outcome, keyFacts[], actions[], followUp, confidence }
// The call transcript (English) comes from Vapi; Muse Spark reads it and writes
// what the client actually needs: what was agreed, what's still open, and what to
// put on the calendar — in the language the client chose when creating the call
// (call.metadata.lang), or the ?lang override. Cached per call+lang in memory.
// `summaryKo` is kept as an alias of `summary` for older clients.

import { NextResponse } from "next/server";
import { getCall } from "@/lib/vapi";
import { sparkChat } from "@/lib/meta";
import { getViewer, ownsCall } from "@/lib/viewer";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const cache = globalThis.__msc_brief_cache || (globalThis.__msc_brief_cache = new Map());

const LANGS = {
  en: { name: "English", style: "plain, friendly English" },
  ko: { name: "Korean", style: "natural Korean (존댓말, 간결하게)" },
  es: { name: "Spanish", style: "natural, neutral Spanish (usted)" },
  ja: { name: "Japanese", style: "natural polite Japanese (です・ます)" },
  zh: { name: "Chinese", style: "natural Simplified Chinese" },
};

const systemFor = (lang) => {
  const L = LANGS[lang] || LANGS.en;
  return `You are the post-call desk of My Side Call, a service where an AI makes English phone calls on behalf of clients in the United States who prefer another language.
You receive the briefing the client gave before the call and the transcript of the call ("assistant" = our AI caller, "user" = the other party on the phone).
Write for the client, in ${L.style}. Never invent facts that are not in the transcript. If something was not settled, say so.

Return ONLY a JSON object with these keys:
- "summary": 2–4 sentences in ${L.name}. What happened and the result.
- "outcome": one of "success" | "partial" | "failed" | "no_answer" | "unclear".
- "keyFacts": array of short ${L.name} strings — names, dates, times, prices, confirmation numbers, addresses mentioned. Keep numbers, names and English proper nouns exactly as said.
- "actions": array of objects {"title": ${L.name}, "when": ISO-8601 datetime or null, "note": ${L.name} or null} — things the client must do next (appointments to attend, documents to bring, callbacks to expect).
- "followUp": ${L.name} string or null — if another call is needed, what to ask for.
- "confidence": 0–1 how sure you are the transcript supports this summary.`;
};

const EMPTY = {
  en: "Nothing was recorded on this call.",
  ko: "통화 내용이 기록되지 않았습니다.",
  es: "No se registró contenido en esta llamada.",
  ja: "この通話の内容は記録されませんでした。",
  zh: "此次通话没有记录到内容。",
};

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
  const sp = new URL(req.url).searchParams;
  const force = sp.get("refresh") === "1";
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "sign in required" }, { status: 401 });

  try {
    const call = await getCall(callId);
    if (!ownsCall(viewer, call)) return NextResponse.json({ error: "not your call" }, { status: 403 });
    const lang = LANGS[sp.get("lang")] ? sp.get("lang") : LANGS[call.metadata?.lang] ? call.metadata.lang : "ko";
    const cacheKey = `${callId}:${lang}`;
    if (!force && cache.has(cacheKey)) return NextResponse.json({ cached: true, ...cache.get(cacheKey) });
    if (call.status !== "ended") {
      return NextResponse.json({ error: "call not ended yet", status: call.status }, { status: 409 });
    }
    const transcript = transcriptText(call);
    if (!transcript.trim()) {
      const empty = { lang, summary: EMPTY[lang], summaryKo: EMPTY[lang], outcome: call.endedReason === "customer-did-not-answer" ? "no_answer" : "unclear", keyFacts: [], actions: [], followUp: null, confidence: 1 };
      cache.set(cacheKey, empty);
      return NextResponse.json(empty);
    }

    const briefing = call.assistantOverrides?.variableValues?.briefing_content || "";
    const userName = call.assistantOverrides?.variableValues?.user_name || "";
    const { content, usage } = await sparkChat({
      json: true,
      temperature: 0.2,
      maxTokens: 1200,
      messages: [
        { role: "system", content: systemFor(lang) },
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

    const summary = String(content.summary || content.summaryKo || "").trim();
    const brief = {
      lang,
      summary,
      summaryKo: summary,
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
    cache.set(cacheKey, brief);
    return NextResponse.json(brief);
  } catch (err) {
    console.error("[brief] failed:", err);
    return NextResponse.json({ error: err.message || "brief failed" }, { status: 500 });
  }
}
