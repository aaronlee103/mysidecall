// Photo of a bill / letter / notice → Muse Spark vision → briefing in the client's language.   [NEW — hackathon]
//
// POST /api/documents/read  { image: "data:image/jpeg;base64,...", lang: "ko" }
//   → { docType, sender, summary, keyPoints[], amountDue, dueDate, accountRef, phone,
//       suggestedBriefing, questionsToAsk[], confidence }
//
// The client photographs the paper they don't understand; Muse Spark reads it and
// explains it in their language, pulls out the phone number to call, and drafts the
// call briefing. The new-call form fills itself from this, and the one-paragraph
// summary rides along on the call as the `attachment_summaries` variable so the AI
// caller knows what the letter says.

import { NextResponse } from "next/server";
import { sparkVision } from "@/lib/meta";
import { getViewer } from "@/lib/viewer";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LANGS = {
  en: { name: "English", style: "plain, friendly English" },
  ko: { name: "Korean", style: "natural Korean (존댓말, 간결하게)" },
  es: { name: "Spanish", style: "natural, neutral Spanish (usted)" },
  ja: { name: "Japanese", style: "natural polite Japanese (です・ます)" },
  zh: { name: "Chinese", style: "natural Simplified Chinese" },
};

const systemFor = (lang) => {
  const L = LANGS[lang] || LANGS.en;
  return `You are the document desk of My Side Call, a service where an AI makes English phone calls for clients in the United States who prefer another language.
The client photographed a paper document (a bill, a letter from an agency or insurer, a notice, a form). Read it carefully and explain it to the client in ${L.style}. Never invent anything that is not on the page. If a field is not visible, use null.

Return ONLY a JSON object with these keys:
- "docType": short English label, e.g. "utility bill", "medical bill", "insurance letter", "DMV notice", "school letter", "unknown".
- "sender": the organization that sent it (as written), or null.
- "summary": 2–4 sentences in ${L.name}: what this is, what it asks the client to do, and by when.
- "keyPoints": array of short ${L.name} strings — amounts, dates, account/case numbers, deadlines, what happens if ignored. Keep numbers, names and English proper nouns exactly as printed.
- "amountDue": string as printed (e.g. "$142.50") or null.
- "dueDate": ISO-8601 date (YYYY-MM-DD) or null.
- "accountRef": account / case / reference number as printed, or null.
- "phone": the best phone number on the page to call about this (customer service), digits as printed, or null.
- "suggestedBriefing": 2–5 sentences in ${L.name}, written in the client's voice ("I" = the client), telling our AI caller what to accomplish on the phone about this document — e.g. confirm the balance, ask why, set up a payment plan, reschedule, ask what documents to bring. Include the account/reference number so the AI can identify the client.
- "questionsToAsk": array of 2–4 short ${L.name} strings — things the client should get answered on the call.
- "confidence": 0–1, how legible the document was.`;
};

export async function POST(req) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "sign in required" }, { status: 401 });

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid JSON" }, { status: 400 }); }
  const { image, lang: rawLang } = body || {};
  const lang = LANGS[rawLang] ? rawLang : "en";
  if (typeof image !== "string" || !image.startsWith("data:image/")) {
    return NextResponse.json({ error: "image must be a data:image/* URL" }, { status: 400 });
  }
  if (image.length > 6_000_000) return NextResponse.json({ error: "image too large (max ~4 MB)" }, { status: 413 });

  const started = Date.now();
  try {
    const { content, usage } = await sparkVision({
      imageUrl: image,
      system: systemFor(lang),
      prompt: "Read this document and fill the JSON.",
      json: true,
      maxTokens: 1400,
      reasoning: "low",
    });
    const out = {
      lang,
      docType: content.docType || "unknown",
      sender: content.sender || null,
      summary: String(content.summary || "").trim(),
      keyPoints: Array.isArray(content.keyPoints) ? content.keyPoints.map(String).slice(0, 10) : [],
      amountDue: content.amountDue || null,
      dueDate: content.dueDate || null,
      accountRef: content.accountRef || null,
      phone: content.phone ? String(content.phone).replace(/[^\d+()\- ]/g, "").trim() || null : null,
      suggestedBriefing: String(content.suggestedBriefing || "").trim(),
      questionsToAsk: Array.isArray(content.questionsToAsk) ? content.questionsToAsk.map(String).slice(0, 6) : [],
      confidence: typeof content.confidence === "number" ? content.confidence : null,
      model: "muse-spark-1.3",
      usage: usage || null,
    };
    console.log(`[documents/read] user=${viewer.id} lang=${lang} type=${out.docType} ms=${Date.now() - started}`);
    return NextResponse.json(out);
  } catch (err) {
    console.error("[documents/read] failed:", err);
    return NextResponse.json({ error: err.message || "could not read the document" }, { status: 500 });
  }
}
