import { NextResponse } from "next/server";
import { fetchAllDeals } from "@/services/deal-fetcher";

export async function POST() {
  const result = await fetchAllDeals();
  return NextResponse.json(result);
}
