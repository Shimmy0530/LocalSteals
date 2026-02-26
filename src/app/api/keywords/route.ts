import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { keywords } from "@/db/schema";

export async function GET() {
  const results = db.select().from(keywords).all();
  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const keyword = typeof body.keyword === "string" ? body.keyword.trim().toLowerCase() : "";

  if (!keyword) {
    return NextResponse.json(
      { error: "keyword is required" },
      { status: 400 },
    );
  }

  const inserted = db
    .insert(keywords)
    .values({
      keyword,
      active: true,
      createdAt: new Date().toISOString(),
    })
    .onConflictDoNothing()
    .returning()
    .all();

  return NextResponse.json(inserted, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const id = body.id;

  if (typeof id !== "number") {
    return NextResponse.json(
      { error: "id is required and must be a number" },
      { status: 400 },
    );
  }

  db.delete(keywords).where(eq(keywords.id, id)).run();

  return NextResponse.json({ success: true });
}
