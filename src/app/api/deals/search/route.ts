import { NextRequest, NextResponse } from "next/server";
import { desc, eq, and, or, like, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { deals } from "@/db/schema";
import { DEMO_DEALS } from "@/lib/demo-deals";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get("q")?.trim() || "";
  const demoMode = searchParams.get("demo") === "true";
  const showBigBox = searchParams.get("bigBox") === "true";

  if (!query) {
    return NextResponse.json([]);
  }

  if (demoMode) {
    const q = query.toLowerCase();
    let filtered = DEMO_DEALS.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        (d.description?.toLowerCase().includes(q) ?? false) ||
        (d.store?.toLowerCase().includes(q) ?? false),
    );

    if (!showBigBox) {
      filtered = filtered.filter((d) => !d.isBigBox);
    }

    return NextResponse.json(filtered.slice(0, 50));
  }

  const pattern = `%${query}%`;

  const conditions: SQL[] = [
    or(
      like(deals.title, pattern),
      like(deals.description, pattern),
      like(deals.store, pattern),
    )!,
  ];

  if (!showBigBox) {
    conditions.push(eq(deals.isBigBox, false));
  }

  const results = db
    .select()
    .from(deals)
    .where(and(...conditions))
    .orderBy(desc(deals.publishedAt))
    .limit(50)
    .all();

  return NextResponse.json(results);
}
