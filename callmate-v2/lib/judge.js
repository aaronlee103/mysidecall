// Judge / guest access without Facebook: a shared access code (JUDGE_CODE) mints a per-browser
// signed cookie, so each judge gets their own free-tier quota. Used while the Meta app is still
// in development mode (Facebook Login only works for app admins/testers until business verification). [NEW — hackathon]
export const JUDGE_COOKIE = "mysidecall_judge";

async function hmac(text) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(process.env.NEXTAUTH_SECRET || process.env.ADMIN_PASSWORD || "msc"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}
export async function mintJudgeCookie() {
  const id = Array.from(crypto.getRandomValues(new Uint8Array(6))).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${id}.${await hmac("judge:" + id)}`;
}
/** Returns the judge id if the cookie is valid, else null. */
export async function verifyJudgeCookie(value) {
  if (!value || !value.includes(".")) return null;
  const [id, sig] = value.split(".");
  if (!/^[0-9a-f]{12}$/.test(id)) return null;
  return (await hmac("judge:" + id)) === sig ? id : null;
}
export function codeOk(code) {
  const want = process.env.JUDGE_CODE;
  return Boolean(want) && typeof code === "string" && code.trim().toLowerCase() === want.trim().toLowerCase();
}
