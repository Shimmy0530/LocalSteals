/*
 * Copyright (c) 2025 Trash Panda Labs, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying prohibited.
 */

/**
 * Seed script for default RSS feed sources.
 * Run with: npx tsx src/db/seed.ts
 */
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import { feedSources } from "./schema";

const dbPath = process.env.DATABASE_PATH || "./data/localsteals.db";

// Ensure the data directory exists
const dir = dirname(dbPath);
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
const db = drizzle(sqlite);

const defaultFeeds = [
  {
    name: "Slickdeals",
    url: "https://slickdeals.net/newsearch.php?mode=frontpage&searcharea=deals&searchtemps=1&rss=1",
    type: "rss",
    active: true,
  },
  {
    name: "DealNews",
    url: "http://content.dealnews.com/dealnews/rss/last-twenty.xml",
    type: "rss",
    active: true,
  },
  {
    name: "Brad's Deals",
    url: "https://feeds.feedburner.com/BradsDe",
    type: "rss",
    active: true,
  },
  {
    name: "LadySavings",
    url: "https://ladysavings.com/feed",
    type: "rss",
    active: true,
  },
  {
    name: "CouponSurfer",
    url: "https://couponsurfer.com/rss_feed.cfm",
    type: "rss",
    active: true,
  },
  {
    name: "Chicago Sun-Times Business",
    url: "https://chicago.suntimes.com/rss/business",
    type: "rss",
    active: true,
  },
  {
    name: "Crain's Chicago Business",
    url: "https://www.chicagobusiness.com/rss",
    type: "rss",
    active: true,
  },
  {
    name: "Daily Herald Business",
    url: "https://www.dailyherald.com/business/rss",
    type: "rss",
    active: true,
  },
];

async function seed() {
  console.log("Seeding feed sources...");

  for (const feed of defaultFeeds) {
    await db
      .insert(feedSources)
      .values(feed)
      .onConflictDoNothing({ target: feedSources.url });
  }

  console.log(`Inserted ${defaultFeeds.length} default feed sources.`);
  sqlite.close();
  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  sqlite.close();
  process.exit(1);
});