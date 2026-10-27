// Re-transcribe a finished call's recording with Muse Voice Transcribe (Meta).   [NEW — hackathon]
//
// POST /api/calls/:id/transcribe[?language=en]  → { text, segments[], seconds, model }
// Vapi's live transcript comes from the telephony STT (word-by-word, under latency
// pressure). For the archive we pull the recording and run it through Meta's ASR —
// a cleaner transcript for the client to keep and search. Cached per call in memory.

import { NextResponse } from "next/server";
import { getCall } from "@/lib/vapi";
import { getViewer, ownsCall } from "@/lib/viewer";
import { parseWav, toMono16k, transcribePcm16 } from "@/lib/museVoice";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const cache = globalThis.__msc_asr_cache || (globalThis.__msc_asr_cache = new Map());

export async function POST(req, { params }) {
  const { callId } = params;
  const sp = new URL(req.url).searchParams;
  const language = sp.get("language") || "en";
  const force = sp.get("refresh") === "1";
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "sign in required" }, { status: 401 });

  try {
    const call = await getCall(callId);
    if (!ownsCall(viewer, call)) return NextResponse.json({ error: "not your call" }, { status: 403 });
    if (call.status !== "ended") return NextResponse.json({ error: "call not ended yet" }, { status: 409 });
    if (!force && cache.has(callId)) return NextResponse.json({ cached: true, ...cache.get(callId) });

    const started = Date.now();
    const rec = await fetch(`https://api.vapi.ai/call/${encodeURIComponent(callId)}/mono-recording`, {
      headers: { Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}` }, redirect: "follow", cache: "no-store",
    });
    if (!rec.ok) return NextResponse.json({ error: `recording ${rec.status === 404 ? "not ready" : "unavailable"}` }, { status: rec.status === 404 ? 404 : 502 });
    const buf = Buffer.from(await rec.arrayBuffer());
    if (buf.length > 25_000_000) return NextResponse.json({ error: "recording too large for re-transcription" }, { status: 413 });

    const wav = parseWav(buf);
    const pcm = toMono16k(wav.data, wav.channels, wav.sampleRate, 16000);
    const audioSeconds = pcm.length / 16000;
    const result = await transcribePcm16({ pcm, language, timeoutMs: 50000 });

    const out = {
      text: result.text,
      segments: result.segments,
      seconds: result.seconds || audioSeconds,
      audioSeconds,
      language,
      model: process.env.META_ASR_MODEL || "muse-voice-transcribe-1.0",
      generatedAt: new Date().toISOString(),
    };
    cache.set(callId, out);
    console.log(`[transcribe] call=${callId} audio=${audioSeconds.toFixed(1)}s segments=${result.segments.length} ms=${Date.now() - started}`);
    return NextResponse.json(out);
  } catch (err) {
    console.error("[transcribe] failed:", err);
    return NextResponse.json({ error: err.message || "transcription failed" }, { status: 500 });
  }
}
