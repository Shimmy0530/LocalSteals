/*
 * Copyright (c) 2025 Trash Panda Labs, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying prohibited.
 */

import { NextResponse } from "next/server";
import { fetchAllDeals } from "@/services/deal-fetcher";

export async function POST() {
  const result = await fetchAllDeals();
  return NextResponse.json(result);
}