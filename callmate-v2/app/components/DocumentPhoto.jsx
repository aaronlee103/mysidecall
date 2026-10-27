"use client";
// Bill / letter photo → Muse Spark vision → explanation + call briefing.  [NEW — hackathon]
// Used inside the new-call form. Downscales the photo in the browser (≤1280px JPEG)
// so the request stays small, then calls /api/documents/read.
import { useRef, useState } from "react";
import { useLang } from "@/app/components/Lang";

async function downscale(file, max = 1280, quality = 0.82) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    c.getContext("2d").drawImage(img, 0, 0, w, h);
    return c.toDataURL("image/jpeg", quality);
  } finally { URL.revokeObjectURL(url); }
}

export default function DocumentPhoto({ lang, onResult }) {
  const { t, lang: uiLang } = useLang();
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [doc, setDoc] = useState(null);
  const [used, setUsed] = useState(false);

  const pick = () => inputRef.current?.click();

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErr(null); setDoc(null); setUsed(false); setBusy(true);
    try {
      const dataUrl = await downscale(file);
      setPreview(dataUrl);
      const r = await fetch("/api/documents/read", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl, lang }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "read failed");
      setDoc(d);
    } catch (ex) {
      setErr(t("doc.err") + (ex?.message ? ` (${ex.message})` : ""));
    } finally { setBusy(false); }
  };

  const reset = () => { setPreview(null); setDoc(null); setErr(null); setUsed(false); };
  const use = () => { if (doc) { onResult?.(doc); setUsed(true); } };
  const locale = uiLang === "ko" ? "ko-KR" : "en-US";

  return (
    <div className="rounded-xl border border-dashed border-brand-300 bg-brand-50/50 p-4">
      <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
      {!preview ? (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <div className="text-[14px] font-medium text-ink-100">{t("doc.title")}</div>
            <div className="text-[12px] text-ink-500 mt-0.5">{t("doc.sub")}</div>
          </div>
          <button type="button" onClick={pick} className="btn-secondary py-2 px-4 text-[13px] whitespace-nowrap">{t("doc.add")}</button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-3">
            <img src={preview} alt="" className="h-24 w-20 rounded-lg object-cover border border-line bg-paper" />
            <div className="flex-1 min-w-0">
              {busy && <div className="text-sm text-ink-500 flex items-center gap-2"><span className="h-3 w-3 animate-spin rounded-full border-2 border-line border-t-brand-500" />{t("doc.reading")}</div>}
              {err && <div className="text-[13px] text-red-800">{err}</div>}
              {doc && (
                <>
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                    <span>{doc.docType}</span>
                    {doc.sender && <span className="font-normal normal-case tracking-normal text-ink-500">· {doc.sender}</span>}
                    <span className="ml-auto font-mono font-normal normal-case tracking-normal text-[10px] text-ink-500">Muse Spark</span>
                  </div>
                  <p className="mt-1 text-[13px] text-ink-100 leading-relaxed">{doc.summary}</p>
                </>
              )}
              <div className="mt-2 flex gap-3 text-[12px]">
                <button type="button" onClick={pick} className="text-ink-500 hover:text-ink-100">{t("doc.change")}</button>
                <button type="button" onClick={reset} className="text-ink-500 hover:text-red-700">{t("doc.remove")}</button>
              </div>
            </div>
          </div>

          {doc && (
            <div className="rounded-lg border border-line bg-paper p-3 space-y-2.5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[12px]">
                {doc.amountDue && <Stat label={t("doc.amount")} value={doc.amountDue} />}
                {doc.dueDate && <Stat label={t("doc.due")} value={new Date(doc.dueDate + "T12:00:00").toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" })} />}
                {doc.accountRef && <Stat label={t("doc.ref")} value={doc.accountRef} mono />}
                {doc.phone && <Stat label={t("doc.phone")} value={doc.phone} mono />}
              </div>
              {doc.keyPoints?.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-ink-500 mb-1">{t("doc.points")}</div>
                  <ul className="space-y-0.5">{doc.keyPoints.map((k, i) => <li key={i} className="text-[12.5px] text-ink-200 flex gap-2"><span className="text-brand-500">•</span><span>{k}</span></li>)}</ul>
                </div>
              )}
              {doc.questionsToAsk?.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-ink-500 mb-1">{t("doc.questions")}</div>
                  <ul className="space-y-0.5">{doc.questionsToAsk.map((k, i) => <li key={i} className="text-[12.5px] text-ink-200 flex gap-2"><span className="text-brand-500">?</span><span>{k}</span></li>)}</ul>
                </div>
              )}
              <div className="pt-1 flex items-center gap-3">
                <button type="button" onClick={use} disabled={used} className="btn-primary py-2 px-4 text-[13px] disabled:opacity-60">{used ? "✓ " + t("doc.used") : t("doc.use")}</button>
                {used && <span className="text-[11px] text-ink-500">{t("doc.attached")}</span>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, mono }) {
  return (
    <div className="rounded-md bg-ink-950 px-2.5 py-1.5">
      <div className="text-[10px] text-ink-500">{label}</div>
      <div className={`text-[12.5px] text-ink-100 truncate ${mono ? "font-mono" : ""}`} title={value}>{value}</div>
    </div>
  );
}
