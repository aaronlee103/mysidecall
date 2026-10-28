// MCP server — "give your AI agent a phone".   [NEW — hackathon]
//
// Streamable HTTP transport, stateless JSON responses (no SSE needed for tool calls).
// Endpoint: POST https://mysidecall.com/api/mcp   Authorization: Bearer msc_…
// Works with Claude (custom connector / claude_desktop_config "url"), ChatGPT
// developer-mode connectors, and any MCP client that speaks 2025-03-26+.
//
// Tools: place_call, get_call, answer_question, end_call, call_owner, list_calls
// (see lib/agentTools.js). Each key is bound to one owner; agents only see that
// owner's calls and can only phone that owner's verified number.

import { verifyAgentKey, bearerFrom } from "@/lib/agentKeys";
import { TOOL_DEFS, runTool } from "@/lib/agentTools";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const PROTOCOL = "2025-06-18";
const SERVER = { name: "my-side-call", version: "0.1.0" };

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Authorization, Content-Type, Mcp-Session-Id, MCP-Protocol-Version", "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE" } });
const rpcErr = (id, code, message) => ({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });

export async function OPTIONS() { return json({}, 204); }

export async function GET(req) {
  // Discovery for humans & health checks. SSE streaming is not offered (405 per spec is acceptable).
  const accept = req.headers.get("accept") || "";
  if (accept.includes("text/event-stream")) return new Response("SSE stream not supported; use POST", { status: 405 });
  return json({ ok: true, server: SERVER, protocol: PROTOCOL, transport: "streamable-http", endpoint: "/api/mcp", auth: "Authorization: Bearer msc_<key from /app/agents>", tools: TOOL_DEFS.map((t) => t.name) });
}

export async function DELETE() { return json({ ok: true }); }

export async function POST(req) {
  const owner = verifyAgentKey(bearerFrom(req));
  let body;
  try { body = await req.json(); } catch { return json(rpcErr(null, -32700, "Parse error"), 400); }
  const batch = Array.isArray(body) ? body : [body];
  const out = [];
  for (const msg of batch) {
    const res = await handle(msg, owner);
    if (res) out.push(res);
  }
  if (!out.length) return new Response(null, { status: 202 });
  return json(Array.isArray(body) ? out : out[0]);
}

async function handle(msg, owner) {
  const { id, method, params } = msg || {};
  if (!method) return rpcErr(id, -32600, "Invalid request");
  const isNotification = id === undefined;

  // Unauthenticated: allow initialize/ping so clients can show a clear auth error later.
  if (!owner && !["initialize", "ping", "notifications/initialized"].includes(method)) {
    return isNotification ? null : rpcErr(id, -32001, "Unauthorized: send `Authorization: Bearer msc_…` (create a key at https://mysidecall.com/app/agents)");
  }

  switch (method) {
    case "initialize":
      return { jsonrpc: "2.0", id, result: { protocolVersion: PROTOCOL, capabilities: { tools: { listChanged: false } }, serverInfo: SERVER, instructions: "My Side Call places real US phone calls for its owner and can phone the owner. Use place_call with a clear briefing, then poll get_call every ~10 seconds; if pendingQuestion appears, decide if you know the answer from context, otherwise ask your user, then call answer_question. Never place emergency, medical or legal-judgment calls." } };
    case "notifications/initialized":
    case "notifications/cancelled":
      return null;
    case "ping":
      return { jsonrpc: "2.0", id, result: {} };
    case "tools/list":
      return { jsonrpc: "2.0", id, result: { tools: TOOL_DEFS.map((t) => ({ name: t.name, description: t.description, inputSchema: t.parameters })) } };
    case "tools/call": {
      const name = params?.name; const args = params?.arguments || {};
      try {
        const result = await runTool(name, args, owner);
        return { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], structuredContent: result, isError: false } };
      } catch (e) {
        return { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: `Error: ${e.message}` }], isError: true } };
      }
    }
    case "resources/list": return { jsonrpc: "2.0", id, result: { resources: [] } };
    case "prompts/list": return { jsonrpc: "2.0", id, result: { prompts: [] } };
    default:
      return isNotification ? null : rpcErr(id, -32601, `Method not found: ${method}`);
  }
}
