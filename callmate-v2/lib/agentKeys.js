// Agent API keys — stateless, HMAC-signed.   [NEW — hackathon]
//
// There is no database, so a key *is* the record: base64url(payload).signature,
// payload = { uid, name, phone, lang, iat }. Signed with NEXTAUTH_SECRET.
// The owner creates one on /app/agents and pastes it into their agent (MCP) as a
// Bearer token. Revocation: rotate NEXTAUTH_SECRET (all keys) — fine for the hackathon.

import { createHmac, timingSafeEqual } from "node:crypto";

const PREFIX = "msc_";

function secret() {
  const s = process.env.AGENT_KEY_SECRET || process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("NEXTAUTH_SECRET is not set");
  return s;
}
const b64u = (buf) => Buffer.from(buf).toString("base64url");
const sign = (data) => createHmac("sha256", secret()).update(data).digest("base64url").slice(0, 32);

export function issueAgentKey({ uid, name, phone, lang = "en" }) {
  if (!uid) throw new Error("uid required");
  const payload = b64u(JSON.stringify({ uid, name: name || "", phone: phone || "", lang, iat: Math.floor(Date.now() / 1000) }));
  return `${PREFIX}${payload}.${sign(payload)}`;
}

/** Returns the key's payload or null. */
export function verifyAgentKey(key) {
  if (!key || typeof key !== "string" || !key.startsWith(PREFIX)) return null;
  const body = key.slice(PREFIX.length);
  const dot = body.lastIndexOf(".");
  if (dot < 1) return null;
  const payload = body.slice(0, dot), sig = body.slice(dot + 1);
  const expected = sign(payload);
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const p = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return p?.uid ? p : null;
  } catch { return null; }
}

/** Pull a Bearer token from a Request. */
export function bearerFrom(req) {
  const h = req.headers.get("authorization") || "";
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1].trim() : null;
}
