// Authenticated recording proxy.   [NEW — hackathon]
//
// Vapi moved recordings behind authentication (Oct 2026): the `recordingUrl` on the
// call object no longer plays in a browser. This route checks that the signed-in user
// owns the call, then fetches GET https://api.vapi.ai/call/{id}/mono-recording with
// the private key (follows the 302 to a short-lived signed URL) and streams it back.
//
// GET /api/calls/:id/recording[?kind=mono|stereo]

import { NextResponse } from "next/server";
import { getCall } from "@/lib/vapi";
import { getViewer, ownsCall } from "@/lib/viewer";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req, { params }) {
  const { callId } = params;
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "sign in required" }, { status: 401 });
  const sp = new URL(req.url).searchParams;
  const kind = sp.get("kind") === "stereo" ? "stereo" : "mono";
  const download = sp.get("download") === "1";

  try {
    const call = await getCall(callId);
    if (!ownsCall(viewer, call)) return NextResponse.json({ error: "not your call" }, { status: 403 });

    const upstream = await fetch(`https://api.vapi.ai/call/${encodeURIComponent(callId)}/${kind}-recording`, {
      headers: { Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}` },
      redirect: "follow",
      cache: "no-store",
    });
    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text().catch(() => "");
      console.error(`[recording] call=${callId} upstream ${upstream.status}: ${text.slice(0, 200)}`);
      return NextResponse.json({ error: upstream.status === 404 ? "recording not ready" : "recording unavailable" }, { status: upstream.status === 404 ? 404 : 502 });
    }
    const type = upstream.headers.get("content-type") || "audio/wav";
    const ext = type.includes("mpeg") || type.includes("mp3") ? "mp3" : "wav";
    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": type,
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="mysidecall-call-${(call.startedAt || call.createdAt || "").slice(0, 10) || "recording"}-${callId.slice(0, 8)}.${ext}"`,
        "Cache-Control": "private, no-store",
        ...(upstream.headers.get("content-length") ? { "Content-Length": upstream.headers.get("content-length") } : {}),
      },
    });
  } catch (err) {
    console.error("[recording] failed:", err);
    return NextResponse.json({ error: err.message || "recording failed" }, { status: 500 });
  }
}
