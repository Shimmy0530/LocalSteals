/*
 * Copyright (c) 2025 Trash Panda Labs, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying prohibited.
 */

import admin from "@/lib/firebase-admin";
import { db } from "@/db";
import { fcmTokens } from "@/db/schema";

export async function sendKeywordNotifications(
  matches: string[]
): Promise<void> {
  if (!admin.apps.length) {
    console.warn(
      "[LocalSteals] Firebase Admin not configured, skipping notifications"
    );
    return;
  }

  const tokens = await db.select().from(fcmTokens);
  if (tokens.length === 0) return;

  const body =
    matches.length === 1
      ? matches[0]
      : `${matches.length} keyword matches found`;

  const message = {
    notification: {
      title: "LocalSteals - Keyword Match!",
      body,
    },
    tokens: tokens.map((t) => t.token),
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`[LocalSteals] Sent ${response.successCount} notifications`);
  } catch (error) {
    console.error("[LocalSteals] Notification send failed:", error);
  }
}