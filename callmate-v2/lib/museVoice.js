// Muse Voice Transcribe (Meta Model API) — batch transcription over the realtime socket.   [NEW — hackathon]
//
// Meta's ASR is realtime-only: wss://api.meta.ai/v1/asr/realtime, PCM16 mono 16 kHz,
// base64 chunks ≤ 4 s each. To re-transcribe a finished call we decode the WAV, push
// the audio through the socket as fast as it accepts it, collect the
// `conversation.item.input_audio_transcription.completed` events, and return the
// segments in order. Node ≥ 22 has a global WebSocket, so no extra dependency.

import { META_BASE, metaKey } from "@/lib/meta";

const ASR_URL = (process.env.META_ASR_URL || META_BASE.replace(/^http/, "ws").replace(/\/v1$/, "") + "/v1/asr/realtime");
const ASR_MODEL = process.env.META_ASR_MODEL || "muse-voice-transcribe-1.0";

/** Minimal WAV reader → { sampleRate, channels, bits, pcm: Int16Array per channel (interleaved kept) } */
export function parseWav(buf) {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") throw new Error("not a WAV file");
  let off = 12, fmt = null, data = null;
  while (off + 8 <= buf.length) {
    const id = buf.toString("ascii", off, off + 4);
    const size = dv.getUint32(off + 4, true);
    const body = off + 8;
    if (id === "fmt ") fmt = { format: dv.getUint16(body, true), channels: dv.getUint16(body + 2, true), sampleRate: dv.getUint32(body + 4, true), bits: dv.getUint16(body + 14, true) };
    else if (id === "data") { data = buf.subarray(body, Math.min(body + size, buf.length)); break; }
    off = body + size + (size % 2);
  }
  if (!fmt || !data) throw new Error("WAV missing fmt/data chunk");
  if (fmt.format !== 1 || fmt.bits !== 16) throw new Error(`unsupported WAV (format=${fmt.format}, bits=${fmt.bits}); need PCM16`);
  return { ...fmt, data };
}

/** Interleaved PCM16 → mono Int16Array, resampled (linear) to targetRate. */
export function toMono16k(data, channels, sampleRate, targetRate = 16000) {
  const frames = Math.floor(data.length / 2 / channels);
  const src = new Int16Array(data.buffer, data.byteOffset, frames * channels);
  const mono = new Float32Array(frames);
  for (let i = 0; i < frames; i++) {
    let s = 0;
    for (let c = 0; c < channels; c++) s += src[i * channels + c];
    mono[i] = s / channels;
  }
  if (sampleRate === targetRate) return Int16Array.from(mono, (v) => Math.max(-32768, Math.min(32767, Math.round(v))));
  const ratio = sampleRate / targetRate;
  const outLen = Math.floor(frames / ratio);
  const out = new Int16Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const pos = i * ratio, i0 = Math.floor(pos), i1 = Math.min(i0 + 1, frames - 1), f = pos - i0;
    out[i] = Math.max(-32768, Math.min(32767, Math.round(mono[i0] * (1 - f) + mono[i1] * f)));
  }
  return out;
}

/**
 * Transcribe PCM16 mono 16 kHz audio. Returns { segments: [{ text, order }], text, seconds }.
 * `language` is an optional hint ("en", "ko", ...).
 */
export function transcribePcm16({ pcm, language, timeoutMs = 50000 }) {
  return new Promise((resolve, reject) => {
    const key = metaKey();
    const ws = new WebSocket(ASR_URL, { headers: { Authorization: `Bearer ${key}` } });
    const segments = [];
    let seconds = 0, done = false, sent = false;
    const finish = (err) => {
      if (done) return; done = true; clearTimeout(timer);
      try { ws.close(); } catch {}
      if (err && !segments.length) return reject(err);
      resolve({ segments, text: segments.map((s) => s.text).join(" ").replace(/\s+/g, " ").trim(), seconds });
    };
    const timer = setTimeout(() => finish(new Error("ASR timeout")), timeoutMs);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "session.update",
        session: {
          audio: { input: { format: { type: "audio/pcm", rate: 16000, channels: 1 } } },
          transcription: { model: ASR_MODEL, ...(language ? { language } : {}) },
          turn_detection: { type: "server_vad" },
        },
      }));
      // ≤ 4 s per append → 3 s chunks of PCM16 @16k = 96,000 bytes
      const step = 16000 * 3;
      for (let i = 0; i < pcm.length; i += step) {
        const chunk = pcm.subarray(i, Math.min(i + step, pcm.length));
        ws.send(JSON.stringify({ type: "input_audio_buffer.append", audio: Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength).toString("base64") }));
      }
      // 1.5 s of silence so server VAD closes the last turn, then commit
      ws.send(JSON.stringify({ type: "input_audio_buffer.append", audio: Buffer.alloc(16000 * 3).toString("base64") }));
      ws.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
      sent = true;
      // give the server time to flush the final segment(s)
      setTimeout(() => finish(), Math.min(timeoutMs - 1000, 4000 + (pcm.length / 16000) * 150));
    };
    ws.onmessage = (ev) => {
      let msg; try { msg = JSON.parse(typeof ev.data === "string" ? ev.data : Buffer.from(ev.data).toString()); } catch { return; }
      if (msg.type === "conversation.item.input_audio_transcription.completed") {
        if (msg.transcript?.trim()) segments.push({ text: msg.transcript.trim(), itemId: msg.item_id || null });
        if (msg.usage?.seconds) seconds += msg.usage.seconds;
      } else if (msg.type === "error") {
        finish(new Error(`ASR error: ${msg.error?.message || msg.error?.type || "unknown"}`));
      }
    };
    ws.onerror = (e) => finish(new Error(`ASR socket error${e?.message ? ": " + e.message : ""}`));
    ws.onclose = () => { if (sent) finish(); else finish(new Error("ASR socket closed before audio was sent")); };
  });
}
