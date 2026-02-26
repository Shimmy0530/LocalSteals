import { NextRequest, NextResponse } from "next/server";
import { desc, eq, and, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { deals } from "@/db/schema";
import { DEMO_DEALS } from "@/lib/demo-deals";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const demoMode = searchParams.get("demo") === "true";
  const showBigBox = searchParams.get("bigBox") === "true";
  const category = searchParams.get("category") || "all";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 30));
  const offset = (page - 1) * limit;

  if (demoMode) {
    let filtered = DEMO_DEALS;

    if (!showBigBox) {
      filtered = filtered.filter((d) => !d.isBigBox);
    }

    if (category !== "all") {
      filtered = filtered.filter((d) => d.category === category);
    }

    return NextResponse.json(filtered.slice(offset, offset + limit));
  }

  // Real data path
  const conditions: SQL[] = [];

  if (!showBigBox) {
    conditions.push(eq(deals.isBigBox, false));
  }

  if (category !== "all") {
    conditions.push(eq(deals.category, category));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const results = db
    .select()
    .from(deals)
    .where(whereClause)
    .orderBy(desc(deals.publishedAt))
    .limit(limit)
    .offset(offset)
    .all();

  return NextResponse.json(results);
}
