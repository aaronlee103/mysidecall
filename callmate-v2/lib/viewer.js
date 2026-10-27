// Who is calling this API route? Facebook session (Auth.js) or the owner's admin cookie.
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function getViewer() {
  const session = await getServerSession(authOptions).catch(() => null);
  if (session?.user?.id) {
    return { id: session.user.id, name: session.user.name || "", image: session.user.image || null, isAdmin: false };
  }
  const pw = process.env.ADMIN_PASSWORD;
  if (pw) {
    const c = cookies().get("mysidecall_admin")?.value;
    if (c && c === (await sha256(pw))) return { id: "admin", name: "Admin", image: null, isAdmin: true };
  }
  return null;
}

export function ownsCall(viewer, call) {
  if (!viewer) return false;
  if (viewer.isAdmin) return true;
  const owner = call?.metadata?.userId || call?.assistantOverrides?.metadata?.userId;
  return Boolean(owner) && owner === viewer.id;
}
