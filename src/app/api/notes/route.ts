import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { researchNotes } from "@/db/schema";
import { SOURCE } from "@/lib/research";

export const dynamic = "force-dynamic";
const COOKIE = "da_workspace";
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const headers = { "Cache-Control": "private, no-store" };

export async function GET(request: NextRequest) {
  const existing = request.cookies.get(COOKIE)?.value;
  const workspaceId = existing && uuidPattern.test(existing) ? existing : randomUUID();
  try {
    const notes = await db.select({ id: researchNotes.id, title: researchNotes.title, body: researchNotes.body, kind: researchNotes.kind, snapshotId: researchNotes.snapshotId, createdAt: researchNotes.createdAt })
      .from(researchNotes).where(eq(researchNotes.workspaceId, workspaceId))
      .orderBy(desc(researchNotes.createdAt), desc(researchNotes.id)).limit(100);
    const response = NextResponse.json({ notes }, { headers });
    const secure = request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
    if (workspaceId !== existing) response.cookies.set(COOKIE, workspaceId, {
      httpOnly: true, sameSite: secure ? "none" : "strict", path: "/", maxAge: 60 * 60 * 24 * 365,
      secure, partitioned: secure,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "The notebook is temporarily unavailable. Your research data has not been affected." }, { status: 503, headers });
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (request.headers.get("sec-fetch-site") === "cross-site") return NextResponse.json({ error: "Cross-site writes are not permitted." }, { status: 403 });
  if (origin) {
    try {
      const parsedOrigin = new URL(origin);
      const publicHost = request.headers.get("x-forwarded-host")?.split(",")[0].trim() || request.headers.get("host");
      if (!publicHost || !["http:", "https:"].includes(parsedOrigin.protocol) || parsedOrigin.host !== new URL(`${parsedOrigin.protocol}//${publicHost}`).host) return NextResponse.json({ error: "Cross-origin writes are not permitted." }, { status: 403 });
    } catch { return NextResponse.json({ error: "Invalid request origin." }, { status: 403 }); }
  }
  const workspaceId = request.cookies.get(COOKIE)?.value;
  if (!workspaceId || !uuidPattern.test(workspaceId)) return NextResponse.json({ error: "Please open the notebook first to establish your private browser workspace." }, { status: 401 });
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) return NextResponse.json({ error: "JSON is required." }, { status: 415 });
    const text = await request.text();
    if (Buffer.byteLength(text) > 18000) return NextResponse.json({ error: "This note is too large." }, { status: 413 });
    const input = JSON.parse(text);
    if (!input || typeof input !== "object" || typeof input.title !== "string" || typeof input.body !== "string" || typeof input.kind !== "string") return NextResponse.json({ error: "A title, note, and valid type are required." }, { status: 400 });
    const title = input.title.trim();
    const body = input.body.trim();
    if (!title || title.length > 120 || !body || body.length > 4000 || !["observation", "question", "methodology"].includes(input.kind)) return NextResponse.json({ error: "Use a title of 1–120 characters, a note of 1–4,000 characters, and a valid note type." }, { status: 400 });
    const [note] = await db.insert(researchNotes).values({ workspaceId, snapshotId: SOURCE.id, title, body, kind: input.kind })
      .returning({ id: researchNotes.id, title: researchNotes.title, body: researchNotes.body, kind: researchNotes.kind, snapshotId: researchNotes.snapshotId, createdAt: researchNotes.createdAt });
    return NextResponse.json({ note }, { status: 201, headers });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    return NextResponse.json({ error: "The note could not be saved. Please try again; no source data was changed." }, { status: 503 });
  }
}
