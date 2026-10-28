// "Ask Muse" — Muse Spark as the owner's agent, with a phone.   [NEW — hackathon]
//
// POST /api/muse/chat { messages:[{role,content}], phone?, lang? }
//   → { reply, toolEvents:[{name,args,result}], messages }
// Muse Spark gets the same tools as the MCP server (place_call, get_call, answer_question,
// end_call, call_owner, list_calls). It can say "I'll call them" and actually do it, or
// schedule a wake-up call for 7 am. The client re-posts the returned `messages` to continue.

import { NextResponse } from "next/server";
import { getViewer } from "@/lib/viewer";
import { sparkChat } from "@/lib/meta";
import { TOOL_DEFS, runTool } from "@/lib/agentTools";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LANG_NAME = { en: "English", ko: "Korean", es: "Spanish", ja: "Japanese", zh: "Chinese" };

const SYSTEM = (owner, nowIso) => `You are Muse, ${owner.name || "the user"}'s personal assistant inside My Side Call, and you have a real phone.
Today: ${nowIso} (America/New_York). The user's language: ${LANG_NAME[owner.lang] || "English"} — always reply in that language, briefly and warmly, no markdown headers.

You can:
- place_call: phone a US business or person and get something done (reschedule, cancel, ask, book). Write the briefing in clear English with every detail the user gave (names, dates, times, alternatives, limits). After placing a call, tell the user you're on it and that you'll report back; do not invent results.
- get_call: check progress. If pendingQuestion is set, ask the user that question (in their language) and then use answer_question with their reply.
- call_owner: phone the user themselves — wake-up calls ("깨워 줘"), reminders, or to read them a result. For a future time, pass "at" as ISO-8601 with the New York offset (e.g. 2026-10-31T07:00:00-04:00). Confirm the exact time back to the user.
- list_calls, end_call.

Rules: never place emergency (911), medical-advice or legal-judgment calls — say you can't. Never agree to anything the user didn't authorize; put limits in the briefing. If the user's phone number is missing for call_owner, tell them to save it on the Agents page. Keep replies to 1–3 sentences unless reporting a call result.`;

export async function POST(req) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "sign in required" }, { status: 401 });
  let body; try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid JSON" }, { status: 400 }); }
  const owner = { uid: viewer.id, name: viewer.name || "", phone: body.phone || "", lang: ["en", "ko", "es", "ja", "zh"].includes(body.lang) ? body.lang : "en" };
  const incoming = Array.isArray(body.messages) ? body.messages.filter((m) => m && ["user", "assistant", "tool"].includes(m.role)).slice(-30) : [];
  if (!incoming.length) return NextResponse.json({ error: "messages required" }, { status: 400 });

  const nowIso = new Date().toLocaleString("sv-SE", { timeZone: "America/New_York" }).replace(" ", "T");
  const tools = TOOL_DEFS.map((t) => ({ type: "function", function: { name: t.name, description: t.description, parameters: t.parameters } }));
  let messages = [{ role: "system", content: SYSTEM(owner, nowIso) }, ...incoming];
  const toolEvents = [];

  try {
    for (let step = 0; step < 5; step++) {
      const { message } = await sparkChat({ messages, tools, temperature: 0.3, maxTokens: 900, reasoning: "low" });
      const calls = message?.tool_calls || [];
      const content = typeof message?.content === "string" ? message.content : Array.isArray(message?.content) ? message.content.map((p) => p?.text || "").join("") : "";
      messages.push({ role: "assistant", content: content || "", ...(calls.length ? { tool_calls: calls } : {}) });
      if (!calls.length) {
        return NextResponse.json({ reply: content.trim(), toolEvents, messages: messages.slice(1) });
      }
      for (const tc of calls) {
        const name = tc.function?.name; let args = {};
        try { args = JSON.parse(tc.function?.arguments || "{}"); } catch {}
        let result;
        try { result = await runTool(name, args, owner); }
        catch (e) { result = { error: e.message }; }
        toolEvents.push({ name, args, result });
        messages.push({ role: "tool", tool_call_id: tc.id, name, content: JSON.stringify(result) });
      }
    }
    return NextResponse.json({ reply: owner.lang === "ko" ? "진행 중이에요. 잠시 후 다시 확인해 주세요." : "Working on it — check back in a moment.", toolEvents, messages: messages.slice(1) });
  } catch (err) {
    console.error("[muse/chat] failed:", err);
    return NextResponse.json({ error: err.message || "Muse failed" }, { status: 500 });
  }
}
