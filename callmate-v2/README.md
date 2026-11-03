# My Side Call — a phone for AI agents

**My Side Call makes real phone calls on behalf of people who would rather not make them in English — and, during this hackathon, on behalf of AI agents too.**

A Korean-speaking immigrant in New Jersey types what they need in Korean ("cancel my Comcast appointment, ask for a refund of the $40 fee"). My Side Call dials the number, talks to the human on the other end in English, pauses to ask the client (in their language, on their screen) when something comes up that wasn't in the briefing, and ends with a summary and action items in their language — Korean, Spanish, Japanese, Chinese or English. Live at **[mysidecall.com](https://mysidecall.com)**.

> Meta Global AI Developer Hackathon · Oct 26 – Nov 4, 2026 · Track: Indie Developer · Theme: *Build for Your World* · Solo: Aaron Lee (Cresskill, NJ)
>
> **Demo video:** _YouTube link goes here_ · **Try it:** [mysidecall.com](https://mysidecall.com) (Facebook Login, free beta: 3 calls / 10 min)

<p align="center"><img src="public/brand/demo.gif" width="800" alt="My Side Call demo"></p>

## Try it in 60 seconds (judges)

1. Open **[mysidecall.com](https://mysidecall.com)** → *Make a call* → sign in with Facebook (free beta: 3 calls / 10 min, no card).
2. Easiest first call: put **your own US mobile number** as the number to call and type, in any language, something like *"Ask if they have a table for two tomorrow at 7 pm; if not, ask what time is free."* Your phone rings; you hear the AI introduce itself and ask — answer it like a restaurant would and try naming a different time, and watch the question land on your screen in your language.
3. When you hang up, the summary page shows the brief, the recording and the Muse Voice transcript.
4. Agents: `/app/agents` → create a key → paste the MCP config into Claude Desktop or add it as a custom connector in the Meta Muse app, then ask the agent to make a call or to call you.

## The call that made this real

On Sunday Nov 1, 2026 a solar company's consultant was due at the author's house at 2 pm. He asked **Meta Muse**, in Korean, to call them back and cancel. Muse used the My Side Call connector (MCP), the AI waited through two minutes of hold music, pressed 1 for a voicemail queue, got a human agent, identified itself as an AI calling on behalf of Aaron Lee, gave the phone number on file, and got the appointment canceled with email confirmation. Muse then reported back in Korean: *"Canceled. The agent confirmed it herself. No need to pretend you're not home."* The demo video is that recording (address and phone number bleeped).

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
| Agent connector | — | **MCP server** at `POST /api/mcp` (Streamable HTTP, `Authorization: Bearer msc_…`): `place_call`, `get_call`, `answer_question`, `end_call`, `call_owner`, `list_calls`. Keys are stateless HMAC tokens bound to one owner (`lib/agentKeys.js`); tools in `lib/agentTools.js`; key page `/app/agents` |
| **Ask Muse** | — | **Muse Spark as the owner's agent with a phone** (`/app/muse`, `app/api/muse/chat`): "move my dentist appointment to 4 pm" → it places the call, polls, relays the AI's mid-call question, reports back. Same tools as the MCP server |
| Owner calls | — | `call_owner`: the agent phones its own owner — wake-up calls, reminders, results. Future times use Vapi `schedulePlan`, no cron needed; the owner-call prompt swaps in via `assistantOverrides.model.messages` (still Muse Spark through our proxy) |
| Recordings | Vapi transcript only; `recordingUrl` public | Recording proxy with Vapi auth (`/api/calls/:id/recording`) + **re-transcription with Muse Voice Transcribe** (`lib/museVoice.js`, `/api/calls/:id/transcribe`): WAV → PCM16 16 kHz → `wss://api.meta.ai/v1/asr/realtime` native protocol (JSON handshake, binary frames, `speechComplete`) |

| **Meta Muse app** | — | The MCP server registered as a **custom connector in the Meta Muse app** ("Build a custom connector for my MCP server at https://mysidecall.com/api/mcp…"). Muse places and follows real calls from a Korean chat — used in the field on Nov 1 (see above) |
| Brand & product design | — | Hand-drawn scribble mascot (layered SVG, blinking), Fredoka type, paper palette, button-first screens with almost no copy, 3D "say hi in any language" intro cube on first visit, EN/한국어 everywhere |
| Free beta & guardrails | — | 3 calls / 10 min per account from Vapi metadata (no DB), beta closes at 100 users, calls self-terminate at the quota (`lib/quota.js`); emergency / medical / legal requests blocked; first sentence of every call discloses AI + recording |
| Legal & contact | — | Rewritten Privacy / Terms (recording, AI disclosure, data deletion for the Meta app), `/contact`, hello@mysidecall.com |

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
* `app/api/mcp/route.js` — MCP server (any agent). `lib/agentTools.js` — the phone as six tools. `lib/agentKeys.js` — HMAC agent keys.
* `app/api/muse/chat/route.js` — Ask Muse: Muse Spark + tools loop (max 5 steps per turn).
* `lib/museVoice.js` + `app/api/calls/[callId]/transcribe/route.js` — Muse Voice Transcribe re-transcription.

### Connect an agent (MCP)

1. Sign in → `/app/agents` → save your phone number (for owner calls) → **Create agent key**.
2. Claude Desktop / claude.ai custom connector:
```json
{ "mcpServers": { "my-side-call": { "url": "https://mysidecall.com/api/mcp", "headers": { "Authorization": "Bearer msc_…" } } } }
```
3. Ask your agent: *"Call +1 201 555 0123 and move my dentist appointment tomorrow from 3 to 4 pm."* It calls `place_call`, polls `get_call`, answers the AI's mid-call question through you, and reads you the result. *"Wake me up at 7 am tomorrow"* → `call_owner` with `at`.
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

## Meta products used

| Product | Where |
|---|---|
| **Muse Spark 1.3** (Meta Model API) | the voice on every call (custom-LLM endpoint for Vapi), the post-call brief in 5 languages, bill/letter photo reading (vision), and the "Ask Muse" agent loop |
| **Muse Voice Transcribe** (Meta Model API, realtime ASR) | clean re-transcription of call recordings |
| **Meta Muse app** | custom MCP connector — Muse places and follows calls from chat |
| **Facebook Login** | sign-in; calls are scoped per user with no database |

## Stack

Next.js 14 (App Router, JS) · Tailwind · Vapi (telephony, STT/TTS; ElevenLabs voices) · **Meta Model API — Muse Spark 1.3 + Muse Voice Transcribe** · Auth.js (Facebook Login) · Vercel · Namecheap (DNS, mail)

## Pages

| Path | Role |
|---|---|
| `/` | landing (EN / 한국어) |
| `/login` | Facebook Login |
| `/app` | dashboard — my calls |
| `/app/new` | briefing form, "my language", bill/letter photo |
| `/app/call/[id]` | live call: transcript, the AI's questions, your answers |
| `/app/summary/[id]` | brief in your language + recording + Muse Voice clean transcript |
| `/app/muse` | Ask Muse — Muse Spark with a phone |
| `/app/agents` | agent key + MCP setup |
| `/privacy`, `/terms`, `/contact` | policies, contact |

## License

MIT for the code in this repository. "My Side Call" name and logo belong to HARUDAOL LLC.

## Free beta limits

- Each signed-in user gets **3 calls / 10 minutes total**, enforced server-side from Vapi call metadata (no database). A call ends itself when the remaining minutes run out (`maxDurationSeconds`).
- The beta closes to new users after **100 people** have placed a call; existing users keep their remaining quota.
- The owner account is unlimited. Tunable with `FREE_CALLS`, `FREE_SECONDS`, `FREE_USERS`.
- Planned pricing after the hackathon: prepaid minutes (e.g. 10 min for $5) via Stripe. Google/Apple sign-in to follow; Facebook Login is the only provider for now.
