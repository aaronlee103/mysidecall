# My Side Call — a phone for AI agents

**My Side Call makes real phone calls on behalf of people who would rather not make them in English — and, during this hackathon, on behalf of AI agents too.**

A Korean-speaking immigrant in New Jersey types what they need in Korean ("cancel my Comcast appointment, ask for a refund of the $40 fee"). My Side Call dials the number, talks to the human on the other end in English, pauses to ask the client (in their language, on their screen) when something comes up that wasn't in the briefing, and ends with a summary and action items in their language — Korean, Spanish, Japanese, Chinese or English. Live at **[mysidecall.com](https://mysidecall.com)**.

> Meta Global AI Developer Hackathon · Oct 26 – Nov 4, 2026 · Theme: *Build for Your World* · Solo: Aaron Lee (Cresskill, NJ)

---

## What is new for the hackathon vs. what existed before

The hackathon rules ask us to be explicit. Everything in the **New** column was written during the hackathon window (from Oct 26, 2026) and is where Meta's models do the work.

| Area | Existed before (July 2026) | **New (hackathon, Oct 26 →)** |
|---|---|---|
| Call brain | OpenAI gpt-4.1 via Vapi | **Muse Spark 1.3** via our own custom-LLM endpoint `app/api/llm/chat/completions` (streaming, tool calls preserved) |
| Call plumbing | Vapi outbound calls, Twilio number, webhook for `ask_client_question`, dashboard with live transcript + "answer the AI" box | unchanged (marked *existing* in code comments) |
| After the call | English summary from Vapi; "Korean translation coming in v1.1" | **Brief by Muse Spark in the client's language** (ko/en/es/ja/zh) — summary, verified facts, action items with dates, follow-up; switchable per call (`app/api/calls/[callId]/brief`) |
| Client language | Korean only, hard-coded | **"My language" per call** (`metadata.lang`) → mid-call questions from the AI arrive in that language (injected in the LLM proxy), brief follows it; UI English by default with 한국어 toggle (`lib/i18n.js`, `app/components/Lang.jsx`) |
| Switching brains | one-off script with a hard-coded secret | `app/api/admin/setup-assistant` — flips the Vapi assistant between Muse Spark and gpt-4.1 with the same prompt and tools; secret from env |
| Documents | — | **Photo of a bill / letter → Muse Spark vision** explains it in the client's language, pulls the number to call, drafts the briefing and rides along on the call as `attachment_summaries` (`app/api/documents/read`, `app/components/DocumentPhoto.jsx`) |
| Sign-in & privacy | shared owner password | **Facebook Login** (Auth.js) — each user sees only their own calls, matched by Vapi call metadata, no database (`lib/auth.js`, `lib/viewer.js`, `middleware.js`, `/login`, `/privacy`) |
| Landing & brand | dark template | New landing (cream/terracotta, EN/한국어), logo mark, app icons; the same design now runs through the app (`app/landing/*`, `public/brand/*`, `tailwind.config.js`) |
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
                     tool call ask_client_question ──▶ /api/vapi-webhook ──▶ client's screen (client's language)
                     client's answer ───────────────▶ Vapi control API (system message) ──▶ next turn
                                            │
                        call ends ──▶ /api/calls/:id/brief ──▶ Muse Spark ──▶ summary + to-dos in the client's language
   photo of a bill ──▶ /api/documents/read ──▶ Muse Spark (vision) ──▶ explanation + number to call + draft briefing
```

* `lib/meta.js` — the only place that knows the Meta base URL, key and model names.
* `app/api/llm/chat/completions/route.js` — Vapi "custom-llm" endpoint. If Meta is unreachable it still streams one short spoken sentence so the line never goes dead.
* `app/api/calls/[callId]/brief/route.js` — post-call brief in the client's language (JSON mode, `?lang=` override).
* `app/api/documents/read/route.js` — bill/letter photo → Muse Spark vision → explanation, phone number, draft briefing.
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
| `ADMIN_PASSWORD` | owner fallback sign-in (existing) |
| `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` | Facebook Login (Auth.js) |
| `MODEL_API_KEY` | **Meta Model API key** |
| `META_TEXT_MODEL` | default `muse-spark-1.3` |
| `LLM_PROXY_SECRET` | optional; Vapi sends it as `Authorization: Bearer` |
| `ADMIN_SETUP_SECRET` | for the brain-switch route |
| `PUBLIC_BASE_URL` | e.g. `https://mysidecall.com` (used when registering URLs with Vapi) |
| `META_REASONING` | optional; `reasoning_effort` sent to Muse Spark (default `minimal` — see note below) |

No keys are committed. Emergency (911), medical and legal-judgment calls are refused by the system prompt and will stay refused.

**Field note on Muse Spark for voice:** left at its default, Muse Spark reasons before it speaks and can spend the whole `max_tokens` budget on reasoning (we saw ~1,500 reasoning tokens and no words on a live call). `reasoning_effort: "minimal"` (`"none"` is rejected with 400) brings first-token latency to ~1.5 s, which is what a phone call needs. We send it from the proxy and from every server-side call.

## Stack

Next.js 14 (App Router, JS) · Tailwind · Vapi (telephony, STT/TTS) · **Meta Model API — Muse Spark 1.3** (call brain, multilingual brief, document vision) · Auth.js (Facebook Login) · Vercel

## Pages

| Path | Role |
|---|---|
| `/` | landing (EN / 한국어) |
| `/login` | Facebook Login |
| `/app` | dashboard — my calls |
| `/app/new` | briefing form, "my language", bill/letter photo |
| `/app/call/[id]` | live call: transcript, the AI's questions, your answers |
| `/app/summary/[id]` | brief in your language + English transcript + recording |
| `/privacy`, `/terms` | policies |

## License

MIT for the code in this repository. "My Side Call" name and logo belong to HARUDAOL LLC.
