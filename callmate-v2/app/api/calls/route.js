import { NextResponse } from "next/server";
import { createOutboundCall, listCalls } from "@/lib/vapi";
import { getViewer } from "@/lib/viewer";
import { checkQuota, quotaMessage } from "@/lib/quota";

export async function GET() {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "sign in required" }, { status: 401 });
  try {
    const all = await listCalls({ limit: 100 });
    const mine = (Array.isArray(all) ? all : []).filter((c) => viewer.isAdmin || c?.metadata?.userId === viewer.id);
    const rows = mine.map((c) => ({
      id: c.id,
      status: c.status,
      endedReason: c.endedReason || null,
      createdAt: c.createdAt,
      startedAt: c.startedAt || null,
      endedAt: c.endedAt || null,
      to: c.customer?.number || null,
      briefing: c.assistantOverrides?.variableValues?.briefing_content || "",
      lang: c.metadata?.lang || null,
      summary: c.summary || null,
      cost: c.cost ?? null,
    }));
    const quota = await checkQuota(viewer).catch(() => null);
    return NextResponse.json({ calls: rows, viewer: { id: viewer.id, name: viewer.name, isAdmin: viewer.isAdmin }, quota });
  } catch (err) {
    console.error("Call list failed:", err);
    return NextResponse.json({ error: err.message || "통화 목록 실패" }, { status: 500 });
  }
}

export async function POST(req) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "sign in required" }, { status: 401 });
  try {
    const { phoneNumber, userName, briefing, voiceId, lang, attachments } = await req.json();
    const clientLang = ["en", "ko", "es", "ja", "zh"].includes(lang) ? lang : "en";

    if (!phoneNumber || !briefing) {
      return NextResponse.json(
        { error: "전화번호와 브리핑은 필수예요" },
        { status: 400 }
      );
    }

    const quota = await checkQuota(viewer);
    if (!quota.ok) return NextResponse.json({ error: quotaMessage(quota, clientLang), quota }, { status: 402 });

    // E.164 포맷으로 정규화 (+1 prefix가 없으면 붙임)
    let normalized = phoneNumber.replace(/[^\d+]/g, "");
    if (!normalized.startsWith("+")) {
      normalized = `+1${normalized}`;
    }

    const call = await createOutboundCall({
      phoneNumber: normalized,
      userName: userName || viewer.name || "my client",
      briefing,
      voice: voiceId,
      clientLang,
      attachmentSummaries: typeof attachments === "string" ? attachments.slice(0, 4000) : "",
      metadata: { userId: viewer.id, userName: userName || viewer.name || "", app: "mysidecall", lang: clientLang },
      // Free tier: the call ends itself when the remaining minutes run out.
      ...(quota.maxDurationSeconds ? { assistantOverridesExtra: { maxDurationSeconds: Math.max(60, Math.round(quota.maxDurationSeconds)) } } : {}),
    });

    return NextResponse.json({ callId: call.id });
  } catch (err) {
    console.error("Call creation failed:", err);
    return NextResponse.json(
      { error: err.message || "통화 시작 실패" },
      { status: 500 }
    );
  }
}
