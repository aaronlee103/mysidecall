// Who is signed in: Facebook session, the owner cookie, or nobody.  [NEW — hackathon]
import { NextResponse } from "next/server";
import { getViewer } from "@/lib/viewer";
export const dynamic = "force-dynamic";
export async function GET() {
  const v = await getViewer();
  return NextResponse.json({ viewer: v ? { id: v.id, name: v.name, image: v.image, isAdmin: v.isAdmin } : null });
}
