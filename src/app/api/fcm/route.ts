import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { fcmTokens } from "@/db/schema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = typeof body.token === "string" ? body.token.trim() : "";

  if (!token) {
    return NextResponse.json(
      { error: "token is required" },
      { status: 400 },
    );
  }

  db.insert(fcmTokens)
    .values({
      token,
      createdAt: new Date().toISOString(),
    })
    .onConflictDoNothing()
    .run();

  return NextResponse.json({ success: true }, { status: 201 });
}
