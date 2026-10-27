// Muse Voice Transcribe (Meta Model API) — batch transcription over the realtime socket.   [NEW — hackathon]
//
// Meta's ASR is realtime-only: wss://api.meta.ai/v1/asr/realtime, PCM16 mono 16/24 kHz,
// raw binary frames after a JSON handshake. To re-transcribe a finished call we decode
// the WAV, push the audio through the socket faster than realtime, collect the
// `speechComplete` events, and return the segments in order. Node ≥ 22 has a global
// WebSocket, so no extra dependency.

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
 * Transcribe PCM16 mono 16 kHz audio with Muse Voice Transcribe.
 * Native protocol (as used by Pipecat's Meta STT service):
 *   1. open wss://api.meta.ai/v1/asr/realtime
 *   2. first frame = JSON handshake with the key inside: {authorization:{accessToken:"Bearer …"}, audioEncoding:"PCM_16KHZ", model, mode:"ENDPOINTING", partialMode:"CUMULATIVE"}
 *   3. server acks with {sessionId}
 *   4. send raw PCM16 bytes as binary frames; {"type":"endStream"} when done
 *   5. events: speechStart / transcript (partials) / speechEnd / speechComplete {transcript, turnId} / error
 * Returns { segments: [{ text, turnId }], text, seconds }.
 */
export function transcribePcm16({ pcm, language, timeoutMs = 50000, diarize = false }) {
  return new Promise((resolve, reject) => {
    const key = metaKey();
    const ws = new WebSocket(ASR_URL);
    ws.binaryType = "arraybuffer";
    const segments = [];
    let done = false, acked = false, sentAll = false, lastPartial = "";
    const finish = (err) => {
      if (done) return; done = true; clearTimeout(timer);
      try { ws.close(); } catch {}
      if (err && !segments.length) return reject(err);
      // In ENDPOINTING mode the last turn may not be closed by VAD; keep the last partial if it adds words.
      if (lastPartial && !segments.some((sg) => sg.text === lastPartial)) segments.push({ text: lastPartial, turnId: null, partial: true });
      resolve({ segments, text: segments.map((sg) => sg.text).join(" ").replace(/\s+/g, " ").trim(), seconds: pcm.length / 16000 });
    };
    const timer = setTimeout(() => finish(new Error("ASR timeout")), timeoutMs);

    const streamAudio = () => {
      // 100 ms frames of PCM16 @ 16 kHz = 3,200 bytes; send back-to-back (server buffers)
      const step = 1600;
      let i = 0;
      const pump = () => {
        let n = 0;
        while (i < pcm.length && n < 50) {
          const chunk = pcm.subarray(i, Math.min(i + step, pcm.length));
          ws.send(Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength));
          i += step; n++;
        }
        if (i < pcm.length) return setTimeout(pump, 20);
        // trailing silence so the endpointer closes the final turn
        ws.send(Buffer.alloc(16000 * 2 * 2));
        ws.send(JSON.stringify({ type: "endStream" }));
        sentAll = true;
        setTimeout(() => finish(), Math.min(timeoutMs - 500, 6000));
      };
      pump();
    };

    ws.onopen = () => {
      const handshake = {
        authorization: { accessToken: `Bearer ${key}` },
        audioEncoding: "PCM_16KHZ",
        model: ASR_MODEL,
        mode: diarize ? "DIARIZATION" : "ENDPOINTING",
        partialMode: "CUMULATIVE",
        emitAudioProgress: false,
        ...(language ? { languageBias: [language] } : {}),
      };
      ws.send(JSON.stringify(handshake));
    };
    ws.onmessage = (ev) => {
      if (typeof ev.data !== "string") return;
      let msg; try { msg = JSON.parse(ev.data); } catch { return; }
      if (!acked) {
        if (msg.sessionId) { acked = true; streamAudio(); return; }
        return finish(new Error(`Meta STT rejected the session: ${msg.message || JSON.stringify(msg).slice(0, 200)}`));
      }
      switch (msg.type) {
        case "transcript": if (msg.transcript) lastPartial = String(msg.transcript).trim(); break;
        case "speechComplete":
          if (msg.transcript?.trim()) segments.push({ text: String(msg.transcript).trim(), turnId: msg.turnId ?? null, speaker: msg.speaker ?? msg.label ?? null });
          lastPartial = "";
          break;
        case "error":
          console.error("[museVoice] error event:", JSON.stringify(msg).slice(0, 800));
          finish(new Error(`ASR error: ${msg.message || JSON.stringify(msg).slice(0, 200)}`));
          break;
        default:
          if (process.env.META_ASR_DEBUG) console.log("[museVoice] event:", JSON.stringify(msg).slice(0, 300));
      }
    };
    ws.onerror = (e) => finish(new Error(`ASR socket error${e?.message ? ": " + e.message : ""}`));
    ws.onclose = (e) => { if (sentAll || segments.length) finish(); else finish(new Error(`ASR socket closed (${e?.code || "?"}) before audio was sent`)); };
  });
}
