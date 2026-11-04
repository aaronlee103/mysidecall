// Owner-only: who signed in, who called. Logins from Vercel Blob (lib/activity), calls from Vapi.  [NEW — hackathon]
import { NextResponse } from "next/server";
import { getViewer } from "@/lib/viewer";
import { listLogins, summarizeUsers } from "@/lib/activity";
import { listCalls } from "@/lib/vapi";

export const dynamic = "force-dynamic";

function secs(c) {
  return c.startedAt && c.endedAt ? Math.max(0, (new Date(c.endedAt) - new Date(c.startedAt)) / 1000) : 0;
}

export async function GET() {
  const viewer = await getViewer();
  if (!viewer?.isAdmin) return NextResponse.json({ error: "owner only" }, { status: 403 });
  const [logins, calls] = await Promise.all([
    listLogins().catch((e) => ({ enabled: false, error: e.message, events: [] })),
    listCalls({ limit: 1000 }).catch(() => []),
  ]);
  const byUser = new Map();
  for (const c of Array.isArray(calls) ? calls : []) {
    const uid = c?.metadata?.userId; if (!uid) continue;
    const u = byUser.get(uid) || { id: uid, name: c.metadata?.userName || "", calls: 0, seconds: 0, last: null, via: new Set() };
    u.calls += 1; u.seconds += secs(c); if (c.metadata?.via) u.via.add(c.metadata.via);
    const t = c.createdAt || c.startedAt; if (t && (!u.last || t > u.last)) u.last = t;
    if (!u.name && c.metadata?.userName) u.name = c.metadata.userName;
    byUser.set(uid, u);
  }
  const callers = [...byUser.values()].map((u) => ({ ...u, seconds: Math.round(u.seconds), via: [...u.via] })).sort((a, b) => (a.last < b.last ? 1 : -1));
  const users = summarizeUsers(logins.events);
  return NextResponse.json({
    loginsEnabled: logins.enabled, loginsError: logins.error || null,
    totals: { users: users.length, logins: logins.events.length, callers: callers.length, calls: callers.reduce((s, u) => s + u.calls, 0), minutes: Math.round(callers.reduce((s, u) => s + u.seconds, 0) / 60) },
    users, callers, recentLogins: logins.events.slice(0, 50),
  });
}
