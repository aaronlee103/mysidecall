// In-memory store for pending "ask_client_question" tool calls.
//
// Why this exists: Vapi's GET /call/{id} doesn't reliably surface async tool-calls
// in call.messages during an in-progress call, so we can't depend on re-fetching
// messages to know a question is pending. We instead snapshot the question as
// soon as the webhook fires, and serve it directly to the dashboard.
//
// Caveat: this is process-local state. Vercel serverless cold starts wipe it.
// In practice webhook -> dashboard poll happens within seconds on the same warm
// Lambda, so this works well for the happy path. For bullet-proof multi-instance
// reliability, swap this out for Vercel KV / Upstash Redis later.

const store =
  globalThis.__mysidecall_pending_store ||
  (globalThis.__mysidecall_pending_store = new Map());

export function setPending(callId, data) {
  if (!callId) return;
  store.set(callId, { ...data, askedAt: Date.now() });
}

export function getPending(callId) {
  if (!callId) return null;
  return store.get(callId) || null;
}

export function clearPending(callId) {
  if (!callId) return;
  store.delete(callId);
}
