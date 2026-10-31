// The phone, as tools.   [NEW — hackathon]
//
// One implementation shared by the MCP server (/api/mcp — any agent: Claude, ChatGPT,
// your own) and by "Ask Muse" (/api/muse/chat — Muse Spark with these tools). Every
// tool runs as a specific owner (from the agent key or the signed-in session), so an
// agent can only see and control that owner's calls.
//
// Safety rules live here too: no emergency / medical / legal-judgment calls, US numbers
// only, owner calls go to the owner's verified number only.

import { checkQuota, quotaMessage } from "@/lib/quota";
import { createOutboundCall, getCall, injectMessage, endCall, listCalls, getAssistant } from "@/lib/vapi";
import { getPending, clearPending } from "@/lib/pendingStore";

const LANGS = ["en", "ko", "es", "ja", "zh"];
const BLOCKED = /\b(911|emergency|suicide|overdose|poison control|ambulance)\b|(^|\D)(1-?)?800-?273-?8255/i;

export function normalizeUS(phone) {
  let n = String(phone || "").replace(/[^\d+]/g, "");
  if (!n.startsWith("+")) n = n.length === 10 ? `+1${n}` : n.length === 11 && n.startsWith("1") ? `+${n}` : `+1${n}`;
  if (!/^\+1\d{10}$/.test(n)) throw new Error("US numbers only (+1 and 10 digits)");
  return n;
}

function callView(call) {
  const msgs = Array.isArray(call.messages) ? call.messages : [];
  const transcript = msgs
    .filter((m) => (m.role === "bot" || m.role === "assistant" || m.role === "user") && (m.message || m.content))
    .map((m) => `${m.role === "user" ? "Other party" : "My Side Call"}: ${m.message || m.content}`)
    .join("\n");
  const pending = getPending(call.id);
  return {
    callId: call.id,
    status: call.status,
    endedReason: call.endedReason || null,
    to: call.customer?.number || null,
    startedAt: call.startedAt || null,
    endedAt: call.endedAt || null,
    durationSec: call.startedAt && call.endedAt ? Math.round((new Date(call.endedAt) - new Date(call.startedAt)) / 1000) : null,
    pendingQuestion: pending ? { question: pending.question, context: pending.context || null } : null,
    summary: call.summary || null,
    transcript,
    kind: call.metadata?.kind || "outbound",
  };
}

/** Tool definitions in OpenAI function format (used by MCP → converted, and by Muse Spark directly). */
export const TOOL_DEFS = [
  {
    name: "place_call",
    description: "Place a real phone call in the US on behalf of the owner. My Side Call's AI speaks English to the other party, follows the briefing, asks the owner (via ask-question flow) when something is not covered, and never agrees to anything outside the briefing. Returns a call_id immediately; poll get_call for progress. Not for emergencies, medical or legal advice.",
    parameters: {
      type: "object",
      properties: {
        phone_number: { type: "string", description: "US number to call, e.g. +1 201 555 0123" },
        briefing: { type: "string", description: "What the call should accomplish, in any language. Include names, dates, times, account numbers, acceptable alternatives and what must NOT be agreed to." },
        language: { type: "string", enum: LANGS, description: "Owner's language for mid-call questions and the summary (default from the key)." },
      },
      required: ["phone_number", "briefing"],
    },
  },
  {
    name: "get_call",
    description: "Get the live status, transcript so far, any question the AI is waiting on, and (when ended) the summary of a call.",
    parameters: { type: "object", properties: { call_id: { type: "string" } }, required: ["call_id"] },
  },
  {
    name: "answer_question",
    description: "Answer the question the AI asked mid-call (see get_call.pendingQuestion), or give it extra instructions while the call is live.",
    parameters: { type: "object", properties: { call_id: { type: "string" }, answer: { type: "string" } }, required: ["call_id", "answer"] },
  },
  {
    name: "end_call",
    description: "Hang up a live call.",
    parameters: { type: "object", properties: { call_id: { type: "string" } }, required: ["call_id"] },
  },
  {
    name: "call_owner",
    description: "Phone the owner themselves at their verified number and speak a message — a wake-up call, a reminder, a check-in, or the result of an errand. Optional `at` schedules it for later (ISO-8601 with timezone, e.g. 2026-10-31T07:00:00-04:00). The AI reads the message, can take a short reply, and hangs up.",
    parameters: {
      type: "object",
      properties: {
        message: { type: "string", description: "What to tell the owner, in the owner's language. Keep it to a few sentences." },
        at: { type: "string", description: "When to call (ISO-8601 with offset). Omit to call now." },
        purpose: { type: "string", enum: ["wake_up", "reminder", "check_in", "result", "other"] },
      },
      required: ["message"],
    },
  },
  {
    name: "list_calls",
    description: "List the owner's recent calls (newest first) with status and one-line briefing.",
    parameters: { type: "object", properties: { limit: { type: "integer", minimum: 1, maximum: 20 } } },
  },
];

const OWNER_PROMPT = (name, lang, message, purpose) => `# ROLE
You are My Side Call, ${name || "the owner"}'s own AI assistant, phoning ${name || "them"} directly. This is NOT a call to a business — you are talking to your owner.
Speak ${{ en: "English", ko: "Korean", es: "Spanish", ja: "Japanese", zh: "Chinese" }[lang] || "English"} only. Warm, brief, natural. One or two short sentences per turn. No markdown.

# WHAT TO DO
Purpose: ${purpose || "message"}.
1. Greet by name, say you are their My Side Call assistant${purpose === "wake_up" ? " and that this is their wake-up call" : ""}.
2. Deliver this message, naturally: """${message}"""
3. Ask if they want to hear it again or have a quick reply; if they give a reply, acknowledge it and repeat the key point back.
4. Say goodbye and call the endCall tool.
If voicemail picks up, leave the message once, then end the call. Never give medical, legal or emergency advice; if they describe an emergency, tell them to call 911 and end the call.`;

/** Run one tool as `owner` ({ uid, name, phone, lang }). Returns a JSON-able result. */
export async function runTool(name, args, owner) {
  if (!owner?.uid) throw new Error("no owner context");
  const a = args || {};
  switch (name) {
    case "place_call": {
      if (BLOCKED.test(`${a.phone_number} ${a.briefing}`)) throw new Error("My Side Call does not place emergency, medical-advice or legal-judgment calls.");
      const number = normalizeUS(a.phone_number);
      const lang = LANGS.includes(a.language) ? a.language : owner.lang || "en";
      const quota = await checkQuota({ id: owner.uid, isAdmin: owner.uid === "admin" });
      if (!quota.ok) throw new Error(quotaMessage(quota, lang === "ko" ? "ko" : "en"));
      const call = await createOutboundCall({
        phoneNumber: number,
        userName: owner.name || "my client",
        briefing: String(a.briefing || "").slice(0, 6000),
        clientLang: lang,
        metadata: { userId: owner.uid, userName: owner.name || "", app: "mysidecall", lang, via: "agent", kind: "outbound" },
        ...(quota.maxDurationSeconds ? { assistantOverridesExtra: { maxDurationSeconds: Math.max(60, Math.round(quota.maxDurationSeconds)) } } : {}),
      });
      return { ok: true, callId: call.id, status: call.status, to: number, watchUrl: `${baseUrl()}/app/call/${call.id}`, note: "Poll get_call every ~10 s. If pendingQuestion appears, answer it with answer_question." };
    }
    case "get_call": {
      const call = await getCall(String(a.call_id));
      assertOwns(owner, call);
      const view = callView(call);
      if (call.status === "ended") view.briefUrl = `${baseUrl()}/app/summary/${call.id}`;
      return view;
    }
    case "answer_question": {
      const call = await getCall(String(a.call_id));
      assertOwns(owner, call);
      if (call.status === "ended") throw new Error("call already ended");
      await injectMessage(call.id, String(a.answer || "").slice(0, 1000));
      clearPending(call.id);
      return { ok: true };
    }
    case "end_call": {
      const call = await getCall(String(a.call_id));
      assertOwns(owner, call);
      if (call.status !== "ended") await endCall(call.id);
      return { ok: true, status: "ending" };
    }
    case "call_owner": {
      if (!owner.phone) throw new Error("The owner has not saved a phone number for owner calls (set it on /app/agents).");
      const number = normalizeUS(owner.phone);
      const lang = owner.lang || "en";
      let earliestAt;
      if (a.at) {
        const t = new Date(a.at);
        if (Number.isNaN(t.getTime())) throw new Error("`at` must be ISO-8601 with timezone offset");
        if (t.getTime() > Date.now() + 60_000) earliestAt = t.toISOString();
      }
      // Reuse the assistant's model config (custom-llm → Muse Spark) with an owner-call system prompt
      const asst = await getAssistant();
      const model = { ...(asst.model || {}) };
      delete model.tools; delete model.toolIds; delete model.knowledgeBase; delete model.knowledgeBaseId;
      model.messages = [{ role: "system", content: OWNER_PROMPT(owner.name, lang, String(a.message || "").slice(0, 1500), a.purpose) }];
      const call = await createOutboundCall({
        phoneNumber: number,
        userName: owner.name || "owner",
        briefing: `(owner call: ${a.purpose || "message"}) ${String(a.message || "").slice(0, 500)}`,
        clientLang: lang,
        earliestAt,
        metadata: { userId: owner.uid, userName: owner.name || "", app: "mysidecall", lang, via: "agent", kind: "owner", purpose: a.purpose || "other" },
        assistantOverridesExtra: {
          model,
          firstMessage: lang === "ko" ? `${owner.name || ""}님, My Side Call 비서예요.` : `Hi ${owner.name || "there"}, it's your My Side Call assistant.`,
        },
      });
      return { ok: true, callId: call.id, status: call.status, to: number, scheduledFor: earliestAt || null, note: earliestAt ? `Scheduled. Vapi will dial at ${earliestAt}.` : "Dialing the owner now." };
    }
    case "list_calls": {
      const all = await listCalls({ limit: 100 });
      const mine = (Array.isArray(all) ? all : []).filter((c) => c?.metadata?.userId === owner.uid).slice(0, Math.min(Number(a.limit) || 10, 20));
      return { calls: mine.map((c) => ({ callId: c.id, status: c.status, to: c.customer?.number || null, createdAt: c.createdAt, kind: c.metadata?.kind || "outbound", briefing: (c.assistantOverrides?.variableValues?.briefing_content || "").slice(0, 140) })) };
    }
    default:
      throw new Error(`unknown tool: ${name}`);
  }
}

function assertOwns(owner, call) {
  const uid = call?.metadata?.userId;
  if (!uid || uid !== owner.uid) throw new Error("not your call");
}

export function baseUrl() {
  return (process.env.PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "https://mysidecall.com").replace(/\/$/, "");
}
