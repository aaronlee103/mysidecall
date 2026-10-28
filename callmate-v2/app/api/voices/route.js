// Voice catalog with preview clips.   [NEW — hackathon]
//
// GET /api/voices[?provider=11labs|vapi|cartesia|openai]
// Proxies Vapi's voice library (private key stays on the server) and returns the
// curated voices the new-call form offers, each with a previewUrl the browser can
// play. Falls back to the provider list without previews if the library call fails.

import { NextResponse } from "next/server";
import { getViewer } from "@/lib/viewer";

export const dynamic = "force-dynamic";

const cache = globalThis.__msc_voice_cache || (globalThis.__msc_voice_cache = new Map());
const TTL = 6 * 60 * 60 * 1000;

export async function GET(req) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "sign in required" }, { status: 401 });
  const sp = new URL(req.url).searchParams;
  const provider = sp.get("provider") || "11labs";
  const raw = sp.get("raw") === "1" && viewer.isAdmin;
  const key = `${provider}:${raw ? "raw" : "cur"}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return NextResponse.json({ cached: true, ...hit.data });

  try {
    const r = await fetch(`https://api.vapi.ai/voice-library/${encodeURIComponent(provider)}?limit=200`, {
      headers: { Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}` }, cache: "no-store",
    });
    const text = await r.text();
    if (!r.ok) return NextResponse.json({ error: `voice library ${r.status}`, detail: text.slice(0, 300) }, { status: 502 });
    let list; try { list = JSON.parse(text); } catch { list = []; }
    const items = (Array.isArray(list) ? list : list?.results || list?.voices || []).map((v) => ({
      id: v.providerId || v.voiceId || v.id || v.slug,
      name: v.name || v.slug,
      gender: v.gender || null,
      accent: v.accent || null,
      age: v.age || null,
      description: v.description || null,
      previewUrl: v.previewUrl || v.preview_url || v.sampleUrl || null,
      isPublic: v.isPublic ?? null,
    })).filter((v) => v.id);
    const data = { provider, count: items.length, voices: raw ? items : items };
    cache.set(key, { at: Date.now(), data });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message || "voice library failed" }, { status: 500 });
  }
}
