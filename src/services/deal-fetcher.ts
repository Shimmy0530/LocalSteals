/*
 * Copyright (c) 2025 Trash Panda Labs, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying prohibited.
 */

/**
 * Deal fetcher orchestrator.
 *
 * Iterates over all active RSS feed sources, fetches new deals,
 * classifies them, and inserts qualifying deals into the database.
 * Deals categorised as "food" or "event" are skipped.
 */

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { deals, keywords, feedSources } from "@/db/schema";
import { fetchRssFeed } from "@/services/rss-parser";
import { classifyDeal } from "@/services/deal-classifier";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function fetchAllDeals(): Promise<{
  newDeals: number;
  matched: string[];
}> {
  let newDeals = 0;
  const matched: string[] = [];

  // 1. Get all active feed sources
  const sources = db
    .select()
    .from(feedSources)
    .where(eq(feedSources.active, true))
    .all();

  // 2. Get all active keywords for matching
  const activeKeywords = db
    .select()
    .from(keywords)
    .where(eq(keywords.active, true))
    .all();

  // 3. Process each feed source
  for (const source of sources) {
    // Only process RSS feeds (skip API-type sources for now)
    if (source.type !== "rss") continue;

    try {
      const rawDeals = await fetchRssFeed(source.url);

      for (const raw of rawDeals) {
        // Skip deals we've already seen
        const existing = db
          .select({ id: deals.id })
          .from(deals)
          .where(eq(deals.externalId, raw.externalId))
          .get();

        if (existing) continue;

        // Classify the deal
        const classification = classifyDeal(
          raw.title,
          raw.description,
          raw.store || "",
        );

        // Skip food and event categories
        if (
          classification.category === "food" ||
          classification.category === "event"
        ) {
          continue;
        }

        // Insert the deal
        db.insert(deals)
          .values({
            externalId: raw.externalId,
            title: raw.title,
            description: raw.description,
            url: raw.url,
            imageUrl: raw.imageUrl || null,
            store: raw.store || null,
            source: source.name,
            category: classification.category,
            isBigBox: classification.isBigBox,
            isChicagoland: classification.isChicagoland,
            publishedAt: raw.publishedAt || null,
            fetchedAt: new Date().toISOString(),
          })
          .run();

        newDeals++;

        // Check against active keywords
        const dealText =
          `${raw.title} ${raw.description}`.toLowerCase();

        for (const kw of activeKeywords) {
          if (dealText.includes(kw.keyword.toLowerCase())) {
            matched.push(`"${kw.keyword}" matched: ${raw.title}`);
          }
        }
      }

      // Update lastFetchedAt for this source
      db.update(feedSources)
        .set({ lastFetchedAt: new Date().toISOString() })
        .where(eq(feedSources.id, source.id))
        .run();
    } catch (error) {
      console.error(
        `[deal-fetcher] Error processing source "${source.name}":`,
        error,
      );
      // Continue to the next source -- don't let one failure crash the run
    }
  }

  console.log(
    `[deal-fetcher] Finished: ${newDeals} new deals, ${matched.length} keyword matches`,
  );

  return { newDeals, matched };
}