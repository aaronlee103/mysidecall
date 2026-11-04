// Lightweight activity log on Vercel Blob (no database).  [NEW — hackathon]
// One tiny object per event; the facts live in the pathname so an admin listing needs no reads:
//   logins/<ISO time>_<method>_<uid>_<name>.json
// Silently does nothing when BLOB_READ_WRITE_TOKEN is not configured.
import { put, list } from "@vercel/blob";

const enabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
// encodeURIComponent leaves . _ ~ alone; encode them too so "_" stays our field separator
const safe = (s) => encodeURIComponent(String(s || "").slice(0, 80)).replace(/[._~]/g, (c) => ({ ".": "%2E", _: "%5F", "~": "%7E" }[c]));

export async function logLogin({ id, name, method }) {
  if (!enabled() || !id) return;
  const ts = new Date().toISOString();
  const path = `logins/${ts}_${safe(method)}_${safe(id)}_${safe(name)}.json`;
  try {
    await put(path, JSON.stringify({ ts, id, name, method }), { access: process.env.BLOB_ACCESS || "private", addRandomSuffix: false, contentType: "application/json" });
  } catch (e) {
    console.warn("[activity] logLogin failed:", e?.message || e);
  }
}

/** Every login event, newest first: [{ ts, method, id, name }] */
export async function listLogins({ limit = 1000 } = {}) {
  if (!enabled()) return { enabled: false, events: [] };
  const events = [];
  let cursor;
  do {
    const page = await list({ prefix: "logins/", limit: Math.min(1000, limit - events.length), cursor });
    for (const b of page.blobs) {
      const m = /^logins\/([^_]+)_([^_]*)_([^_]*)_([^_]*)\.json$/.exec(b.pathname);
      if (!m) continue;
      events.push({ ts: m[1], method: decodeURIComponent(m[2]), id: decodeURIComponent(m[3]), name: decodeURIComponent(m[4]) });
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor && events.length < limit);
  events.sort((a, b) => (a.ts < b.ts ? 1 : -1));
  return { enabled: true, events };
}

/** Group login events by user: [{ id, name, method, first, last, logins }] sorted by last seen */
export function summarizeUsers(events) {
  const users = new Map();
  for (const e of events) {
    const u = users.get(e.id) || { id: e.id, name: e.name, method: e.method, first: e.ts, last: e.ts, logins: 0 };
    u.logins += 1;
    if (e.ts < u.first) u.first = e.ts;
    if (e.ts > u.last) { u.last = e.ts; if (e.name) u.name = e.name; }
    users.set(e.id, u);
  }
  return [...users.values()].sort((a, b) => (a.last < b.last ? 1 : -1));
}
