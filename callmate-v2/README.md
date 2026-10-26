# My Side Call — a phone for AI agents

**My Side Call makes real phone calls on behalf of people who would rather not make them in English — and, during this hackathon, on behalf of AI agents too.**

A Korean-speaking immigrant in New Jersey types what they need in Korean ("cancel my Comcast appointment, ask for a refund of the $40 fee"). My Side Call dials the number, talks to the human on the other end in English, pauses to ask the client (in Korean, on their screen) when something comes up that wasn't in the briefing, and ends with a Korean summary and action items. Live at **[mysidecall.com](https://mysidecall.com)**.

> Meta Global AI Developer Hackathon · Oct 26 – Nov 4, 2026 · Theme: *Build for Your World* · Solo: Aaron Lee (Cresskill, NJ)

---

## What is new for the hackathon vs. what existed before

The hackathon rules ask us to be explicit. Everything in the **New** column was written during the hackathon window (from Oct 26, 2026) and is where Meta's models do the work.

| Area | Existed before (July 2026) | **New (hackathon, Oct 26 →)** |
|---|---|---|
| Call brain | OpenAI gpt-4.1 via Vapi | **Muse Spark 1.3** via our own custom-LLM endpoint `app/api/llm/chat/completions` (streaming, tool calls preserved) |
| Call plumbing | Vapi outbound calls, Twilio number, webhook for `ask_client_question`, dashboard with live transcript + "answer the AI" box | unchanged (marked *existing* in code comments) |
| After the call | English summary from Vapi; "Korean translation coming in v1.1" | **Korean brief by Muse Spark** — summary, verified facts, action items with dates, follow-up (`app/api/calls/[callId]/brief`) |
| Switching brains | one-off script with a hard-coded secret | `app/api/admin/setup-assistant` — flips the Vapi assistant between Muse Spark and gpt-4.1 with the same prompt and tools; secret from env |
| Documents | — | *(planned, day 3)* photograph a bill/letter → Muse Spark vision extracts what the call needs |
| Agent connector | — | *(planned, day 4)* MCP server: `place_call`, `get_call_status`, `answer_question`, `end_call`, `call_owner` — any agent (including Muse) can make a real phone call |
| Owner calls | — | *(planned, day 4)* `call_owner`: the agent phones its own owner — wake-up calls, check-ins, "your flight moved" |
| Recordings | Vapi transcript only | *(planned, day 5)* re-transcription with **Muse Voice Transcribe** for a cleaner archive |

Commits after Oct 26 are the hackathon work; `git log --since=2026-10-26` shows exactly what was added.

## How a call works now

```
Korean briefing ──▶ POST /api/calls ──▶ Vapi dials (Twilio)
                                            │ each turn: OpenAI-style request
                                            ▼
                               /api/llm/chat/completions  ──▶  Meta Model API
                               (strip Vapi fields, inject key,     muse-spark-1.3
                                pipe the SSE stream back)   ◀──  streamed tokens / tool calls
                                            │
                     tool call ask_client_question ──▶ /api/vapi-webhook ──▶ client's screen (Korean)
                     client's answer ───────────────▶ Vapi control API (system message) ──▶ next turn
                                            │
                        call ends ──▶ /api/calls/:id/brief ──▶ Muse Spark ──▶ Korean summary + to-dos
```

* `lib/meta.js` — the only place that knows the Meta base URL, key and model names.
* `app/api/llm/chat/completions/route.js` — Vapi "custom-llm" endpoint. If Meta is unreachable it still streams one short spoken sentence so the line never goes dead.
* `app/api/calls/[callId]/brief/route.js` — Korean post-call brief (JSON mode).
* `app/api/admin/setup-assistant/route.js` — `?apply=meta` / `?apply=openai`.

## Run it

```bash
cp .env.example .env.local   # fill in Vapi + Meta keys
npm install
npm run dev                  # http://localhost:3000/app  (ADMIN_PASSWORD gate)
```

Switch the Vapi assistant to Muse Spark once the app is deployed somewhere Vapi can reach:

```
GET https://<your-host>/api/admin/setup-assistant?secret=<ADMIN_SETUP_SECRET>&apply=meta
```

Smoke-test the brain endpoint without a phone:

```bash
curl -N -X POST http://localhost:3000/api/llm/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"system","content":"You are calling a restaurant to book a table."},{"role":"user","content":"Hello, Bella Napoli, how can I help?"}],"stream":true}'
```

## Environment variables

| Name | Purpose |
|---|---|
| `VAPI_PRIVATE_KEY`, `VAPI_PHONE_NUMBER_ID`, `VAPI_ASSISTANT_ID` | telephony (existing) |
| `ADMIN_PASSWORD` | dashboard gate (existing) |
| `MODEL_API_KEY` | **Meta Model API key** |
| `META_TEXT_MODEL` | default `muse-spark-1.3` |
| `LLM_PROXY_SECRET` | optional; Vapi sends it as `Authorization: Bearer` |
| `ADMIN_SETUP_SECRET` | for the brain-switch route |
| `PUBLIC_BASE_URL` | e.g. `https://mysidecall.com` (used when registering URLs with Vapi) |

No keys are committed. Emergency (911), medical and legal-judgment calls are refused by the system prompt and will stay refused.

## Stack

Next.js 14 (App Router, JS) · Tailwind · Vapi (telephony, STT/TTS) · **Meta Model API — Muse Spark 1.3** (call brain, Korean brief, vision) · Vercel

## Pages

| Path | Role |
|---|---|
| `/` | landing |
| `/app` | dashboard |
| `/app/new` | briefing form (Korean) |
| `/app/call/[id]` | live call: transcript, the AI's questions, your answers |
| `/app/summary/[id]` | Korean brief + English transcript + recording |

## License

MIT for the code in this repository. "My Side Call" name and logo belong to HARUDAOL LLC.
