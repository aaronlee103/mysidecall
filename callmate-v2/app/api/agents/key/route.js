// Issue an agent key for the signed-in owner.   [NEW — hackathon]
// POST { phone, lang } → { key, mcpUrl }
import { NextResponse } from "next/server";
import { getViewer } from "@/lib/viewer";
import { issueAgentKey } from "@/lib/agentKeys";
import { normalizeUS, baseUrl } from "@/lib/agentTools";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "sign in required" }, { status: 401 });
  let body = {}; try { body = await req.json(); } catch {}
  let phone = "";
  if (body.phone) { try { phone = normalizeUS(body.phone); } catch (e) { return NextResponse.json({ error: e.message }, { status: 400 }); } }
  const lang = ["en", "ko", "es", "ja", "zh"].includes(body.lang) ? body.lang : "en";
  const key = issueAgentKey({ uid: viewer.id, name: viewer.name || "", phone, lang });
  return NextResponse.json({ key, mcpUrl: `${baseUrl()}/api/mcp`, owner: { name: viewer.name, phone, lang } });
}
