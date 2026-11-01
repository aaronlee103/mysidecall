// Free-tier quota: 3 calls and 10 minutes total per signed-in user. No DB — every call we
// place carries metadata.userId, so usage is just a filtered sum over Vapi's call list.
// The owner (admin cookie) is never limited. [NEW — hackathon]
import { listCalls } from "@/lib/vapi";

export const FREE_CALLS = Number(process.env.FREE_CALLS || 3);
export const FREE_SECONDS = Number(process.env.FREE_SECONDS || 600);
export const FREE_USERS = Number(process.env.FREE_USERS || 100); // beta closes to new users after this many have called
const MIN_CALL_SECONDS = 60; // don't start a call that would be cut off almost at once

function seconds(c) {
  if (c.startedAt && c.endedAt) return Math.max(0, (new Date(c.endedAt) - new Date(c.startedAt)) / 1000);
  if (c.status && c.status !== "ended") return 0; // in progress — counted when it ends
  return 0;
}

export async function getUsage(userId) {
  const all = await listCalls({ limit: 1000 });
  const everyone = new Set((Array.isArray(all) ? all : []).map((c) => c?.metadata?.userId).filter((u) => u && u !== "admin"));
  const mine = (Array.isArray(all) ? all : []).filter((c) => c?.metadata?.userId === userId && c?.metadata?.kind !== "owner");
  // A call that never connected (no startedAt) doesn't burn a free call.
  const connected = mine.filter((c) => c.startedAt || (c.status && c.status !== "ended"));
  const used = connected.reduce((s, c) => s + seconds(c), 0);
  return { calls: connected.length, seconds: Math.round(used), totalUsers: everyone.size, isExisting: everyone.has(userId) };
}

/** Returns { ok, usage, remainingCalls, remainingSeconds, maxDurationSeconds, reason } */
export async function checkQuota(viewer) {
  if (!viewer) return { ok: false, reason: "signin" };
  if (viewer.isAdmin) return { ok: true, unlimited: true };
  const usage = await getUsage(viewer.id);
  const remainingCalls = Math.max(0, FREE_CALLS - usage.calls);
  const remainingSeconds = Math.max(0, FREE_SECONDS - usage.seconds);
  const base = { usage, remainingCalls, remainingSeconds, freeCalls: FREE_CALLS, freeSeconds: FREE_SECONDS };
  // Beta is closed to newcomers once FREE_USERS people have called; existing users keep their remaining quota.
  if (!usage.isExisting && usage.totalUsers >= FREE_USERS) return { ...base, ok: false, reason: "closed" };
  if (remainingCalls <= 0) return { ...base, ok: false, reason: "calls" };
  if (remainingSeconds < MIN_CALL_SECONDS) return { ...base, ok: false, reason: "minutes" };
  return { ...base, ok: true, maxDurationSeconds: Math.min(remainingSeconds, FREE_SECONDS) };
}

export function quotaMessage(q, lang = "en") {
  const ko = lang === "ko";
  if (q.reason === "calls") return ko ? `무료 통화 ${q.freeCalls}회를 모두 쓰셨어요. 정식 출시 소식은 hello@mysidecall.com으로 문의해 주세요.` : `You've used all ${q.freeCalls} free calls. Email hello@mysidecall.com to hear when paid plans launch.`;
  if (q.reason === "closed") return ko ? "무료 체험 인원이 다 찼어요. 정식 출시 소식은 hello@mysidecall.com으로 문의해 주세요." : "The free beta is full. Email hello@mysidecall.com to hear when we open up again.";
  if (q.reason === "minutes") return ko ? `무료 통화 시간 ${Math.round(q.freeSeconds / 60)}분을 모두 쓰셨어요. 정식 출시 소식은 hello@mysidecall.com으로 문의해 주세요.` : `You've used your ${Math.round(q.freeSeconds / 60)} free minutes. Email hello@mysidecall.com to hear when paid plans launch.`;
  return "";
}
