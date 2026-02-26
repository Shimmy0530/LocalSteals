# LocalSteals Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a personal-use PWA deal aggregator that pulls retail and car-service deals from RSS feeds and APIs, filters out big-box retailers, focuses on the Chicagoland area, and supports keyword push notifications.

**Architecture:** Next.js 16 App Router serving both the frontend UI and backend API routes. A scheduled cron job (node-cron via instrumentation.ts) fetches deals from RSS feeds and APIs every hour, stores them in a local SQLite database via Drizzle ORM, and triggers Firebase Cloud Messaging push notifications for keyword matches. Serwist provides PWA caching and service worker support, consolidated with FCM in a single service worker.

**Tech Stack:**
- Next.js 16 (App Router) — framework
- Drizzle ORM + better-sqlite3 — database
- @serwist/next — PWA / service worker
- Firebase (client) + firebase-admin (server) — push notifications
- rss-parser — RSS feed parsing
- node-cron — scheduled deal fetching
- Tailwind CSS 4 — styling (dark theme)

---

## Deal Sources

### RSS Feeds
| Source | URL | Notes |
|--------|-----|-------|
| Slickdeals Frontpage | `https://slickdeals.net/newsearch.php?mode=frontpage&searcharea=deals&searchtemps=1&rss=1` | Primary deal feed |
| DealNews Recent | `http://content.dealnews.com/dealnews/rss/last-twenty.xml` | Curated deals |
| Brad's Deals | `https://feeds.feedburner.com/BradsDe` | Human-curated |
| LadySavings Coupons | `https://ladysavings.com/feed` | Coupon deals |
| CouponSurfer | `https://couponsurfer.com/rss_feed.cfm` | Coupon RSS |
| Chicago Sun-Times Biz | `https://chicago.suntimes.com/rss/business` | Local business news/deals |
| Crain's Chicago Biz | `https://www.chicagobusiness.com/rss` | Chicago business |
| Daily Herald Business | `https://www.dailyherald.com/business/rss` | Suburban Chicago business |

### APIs (Future Enhancement — Task 12+)
| Source | Endpoint | Free Tier |
|--------|----------|-----------|
| Google Places API | `places.googleapis.com/v1/places:searchText` | $200/mo free |
| Yelp Fusion | `api.yelp.com/v3/businesses/search` | Free limited |
| Foursquare Places | `api.foursquare.com/v3/places` | Free basic |
| Openmart Local | `/local-business` | 1k free/mo |

---

## Big-Box Retailer Blacklist (Default)

```
Amazon, Walmart, Target, Best Buy, Costco, Sam's Club, Home Depot, Lowe's,
Walgreens, CVS, Kroger, Meijer, Kohl's, JCPenney, Macy's, Nordstrom,
Bed Bath & Beyond, Staples, Office Depot, Dick's Sporting Goods,
Petco, PetSmart, Dollar General, Dollar Tree, Family Dollar,
Rite Aid, Albertsons, Safeway, Publix, Aldi, Lidl, BJ's Wholesale,
Menards, Ace Hardware, AutoZone, O'Reilly Auto Parts, Advance Auto Parts,
GameStop, Barnes & Noble, Sephora, Ulta, T.J. Maxx, Marshalls,
HomeGoods, Ross, Burlington, Five Below, Michaels, Hobby Lobby,
Bath & Body Works, Victoria's Secret, Gap, Old Navy, Banana Republic,
Foot Locker, Nike, Adidas, Under Armour, Newegg, Wayfair, Overstock,
eBay, Wish, Temu, Shein, AliExpress
```

User can toggle visibility of these via a switch in the UI.

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json` (via npx)
- Create: `tsconfig.json` (via npx)
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `.gitignore`
- Create: `.env.local`

**Step 1: Initialize Next.js project**

```bash
cd /c/Users/nicka/AndroidStudioProjects/ShopSmallSteals
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack
```

Accept defaults. This creates the full Next.js scaffold with App Router and Tailwind.

**Step 2: Initialize git repo**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js 16 project with App Router and Tailwind"
```

**Step 3: Create .env.local with placeholder config**

```env
# Database
DATABASE_PATH=./data/localsteals.db

# Firebase (fill in from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=
FIREBASE_SERVICE_ACCOUNT_KEY=

# Cron schedule (every hour)
CRON_SCHEDULE=0 * * * *

# Deal fetch settings
CHICAGOLAND_KEYWORDS=chicago,chicagoland,cook county,dupage,lake county il,will county,kane county,mchenry county,evanston,naperville,aurora,joliet,schaumburg,oak park,skokie,des plaines,arlington heights,orland park,tinley park,bolingbrook,palatine,hoffman estates
```

**Step 4: Add .env.local to .gitignore (should already be there) and commit**

```bash
git add .env.local.example  # create a template version without secrets
git commit -m "chore: add environment config template"
```

---

## Task 2: Database Schema & Drizzle Setup

**Files:**
- Create: `src/db/schema.ts`
- Create: `src/db/index.ts`
- Create: `drizzle.config.ts`
- Create: `src/db/seed.ts`

**Step 1: Install dependencies**

```bash
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3
```

**Step 2: Create database schema**

Create `src/db/schema.ts`:

```typescript
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const deals = sqliteTable("deals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  externalId: text("external_id").unique(),         // guid from RSS or source ID
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  price: real("price"),
  originalPrice: real("original_price"),
  store: text("store"),
  source: text("source").notNull(),                  // "slickdeals", "dealnews", etc.
  category: text("category"),                        // "retail", "auto-service"
  isBigBox: integer("is_big_box", { mode: "boolean" }).default(false),
  isChicagoland: integer("is_chicagoland", { mode: "boolean" }).default(false),
  publishedAt: text("published_at"),
  fetchedAt: text("fetched_at").notNull(),
  expiresAt: text("expires_at"),
});

export const keywords = sqliteTable("keywords", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  keyword: text("keyword").notNull().unique(),
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull(),
});

export const fcmTokens = sqliteTable("fcm_tokens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  token: text("token").notNull().unique(),
  createdAt: text("created_at").notNull(),
});

export const feedSources = sqliteTable("feed_sources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  type: text("type").notNull(),                      // "rss", "api"
  active: integer("active", { mode: "boolean" }).default(true),
  lastFetchedAt: text("last_fetched_at"),
});
```

**Step 3: Create database connection**

Create `src/db/index.ts`:

```typescript
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const dbPath = process.env.DATABASE_PATH || "./data/localsteals.db";
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });
```

**Step 4: Create drizzle config**

Create `drizzle.config.ts`:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_PATH || "./data/localsteals.db",
  },
});
```

**Step 5: Generate and run migration**

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

**Step 6: Create seed script for default feed sources**

Create `src/db/seed.ts`:

```typescript
import { db } from "./index";
import { feedSources } from "./schema";

const defaultFeeds = [
  { name: "Slickdeals", url: "https://slickdeals.net/newsearch.php?mode=frontpage&searcharea=deals&searchtemps=1&rss=1", type: "rss" },
  { name: "DealNews", url: "http://content.dealnews.com/dealnews/rss/last-twenty.xml", type: "rss" },
  { name: "Brad's Deals", url: "https://feeds.feedburner.com/BradsDe", type: "rss" },
  { name: "LadySavings", url: "https://ladysavings.com/feed", type: "rss" },
  { name: "CouponSurfer", url: "https://couponsurfer.com/rss_feed.cfm", type: "rss" },
  { name: "Chicago Sun-Times Business", url: "https://chicago.suntimes.com/rss/business", type: "rss" },
  { name: "Crain's Chicago Business", url: "https://www.chicagobusiness.com/rss", type: "rss" },
  { name: "Daily Herald Business", url: "https://www.dailyherald.com/business/rss", type: "rss" },
];

async function seed() {
  for (const feed of defaultFeeds) {
    await db.insert(feedSources).values({
      ...feed,
      active: true,
      lastFetchedAt: null,
    }).onConflictDoNothing();
  }
  console.log("Seeded default feed sources");
}

seed();
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add database schema and Drizzle ORM setup with seed data"
```

---

## Task 3: Deal Fetcher Service

**Files:**
- Create: `src/services/deal-fetcher.ts`
- Create: `src/services/rss-parser.ts`
- Create: `src/services/deal-classifier.ts`
- Create: `src/lib/big-box-list.ts`

**Step 1: Install RSS parser**

```bash
npm install rss-parser
```

**Step 2: Create big-box retailer list**

Create `src/lib/big-box-list.ts`:

```typescript
export const BIG_BOX_RETAILERS = new Set([
  "amazon", "walmart", "target", "best buy", "costco", "sam's club",
  "home depot", "lowe's", "lowes", "walgreens", "cvs", "kroger", "meijer",
  "kohl's", "kohls", "jcpenney", "macy's", "macys", "nordstrom",
  "staples", "office depot", "dick's sporting goods",
  "petco", "petsmart", "dollar general", "dollar tree", "family dollar",
  "rite aid", "albertsons", "safeway", "publix", "aldi", "lidl",
  "bj's wholesale", "menards", "ace hardware", "autozone",
  "o'reilly auto parts", "advance auto parts", "gamestop",
  "barnes & noble", "sephora", "ulta", "t.j. maxx", "tjmaxx", "marshalls",
  "homegoods", "ross", "burlington", "five below", "michaels",
  "hobby lobby", "bath & body works", "victoria's secret",
  "gap", "old navy", "banana republic", "foot locker",
  "nike", "adidas", "under armour", "newegg", "wayfair", "overstock",
  "ebay", "wish", "temu", "shein", "aliexpress",
]);

export function isBigBox(storeName: string): boolean {
  if (!storeName) return false;
  const normalized = storeName.toLowerCase().trim();
  return BIG_BOX_RETAILERS.has(normalized) ||
    [...BIG_BOX_RETAILERS].some((retailer) => normalized.includes(retailer));
}
```

**Step 3: Create deal classifier**

Create `src/services/deal-classifier.ts`:

```typescript
import { isBigBox } from "@/lib/big-box-list";

const CHICAGOLAND_KEYWORDS = (process.env.CHICAGOLAND_KEYWORDS || "chicago,chicagoland").split(",").map(k => k.trim().toLowerCase());

const AUTO_SERVICE_KEYWORDS = [
  "oil change", "tire", "brake", "auto repair", "car wash", "car service",
  "mechanic", "transmission", "alignment", "muffler", "exhaust", "detailing",
  "auto body", "windshield", "battery replacement", "tune-up", "inspection",
];

const FOOD_KEYWORDS = [
  "restaurant", "pizza", "burger", "sushi", "dining", "brunch", "cafe",
  "coffee shop", "bakery", "food delivery", "doordash", "grubhub", "ubereats",
];

const EVENT_KEYWORDS = [
  "concert", "ticket", "festival", "show", "theater", "theatre", "museum",
  "exhibition", "sporting event", "comedy show",
];

export interface DealClassification {
  isBigBox: boolean;
  isChicagoland: boolean;
  category: "retail" | "auto-service" | "food" | "event" | "other";
}

export function classifyDeal(title: string, description: string, store: string): DealClassification {
  const text = `${title} ${description} ${store}`.toLowerCase();

  const chicagoland = CHICAGOLAND_KEYWORDS.some(k => text.includes(k));
  const bigBox = isBigBox(store);

  let category: DealClassification["category"] = "retail";
  if (AUTO_SERVICE_KEYWORDS.some(k => text.includes(k))) category = "auto-service";
  else if (FOOD_KEYWORDS.some(k => text.includes(k))) category = "food";
  else if (EVENT_KEYWORDS.some(k => text.includes(k))) category = "event";

  return { isBigBox: bigBox, isChicagoland: chicagoland, category };
}
```

**Step 4: Create RSS parser wrapper**

Create `src/services/rss-parser.ts`:

```typescript
import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "LocalSteals/1.0 (personal deal aggregator)",
  },
});

export interface RawDeal {
  externalId: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  store?: string;
  publishedAt?: string;
}

export async function fetchRssFeed(feedUrl: string): Promise<RawDeal[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    return feed.items.map((item) => ({
      externalId: item.guid || item.link || `${feedUrl}-${item.title}`,
      title: item.title || "Untitled Deal",
      description: stripHtml(item.contentSnippet || item.content || item.summary || ""),
      url: item.link || "",
      imageUrl: extractImageUrl(item.content || item.description || ""),
      store: extractStore(item.title || "", item.content || ""),
      publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
    }));
  } catch (error) {
    console.error(`Failed to fetch RSS feed ${feedUrl}:`, error);
    return [];
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function extractImageUrl(content: string): string | undefined {
  const match = content.match(/<img[^>]+src="([^"]+)"/);
  return match?.[1];
}

function extractStore(title: string, content: string): string {
  // Common patterns: "Deal Title at StoreName" or "StoreName: Deal Title"
  const atMatch = title.match(/\bat\s+([A-Z][A-Za-z\s&'.]+?)(?:\s*[-–—(]|\s*$)/);
  if (atMatch) return atMatch[1].trim();

  const colonMatch = title.match(/^([A-Z][A-Za-z\s&'.]+?):\s/);
  if (colonMatch) return colonMatch[1].trim();

  return "Unknown";
}
```

**Step 5: Create main deal fetcher service**

Create `src/services/deal-fetcher.ts`:

```typescript
import { db } from "@/db";
import { deals, feedSources, keywords } from "@/db/schema";
import { fetchRssFeed } from "./rss-parser";
import { classifyDeal } from "./deal-classifier";
import { eq } from "drizzle-orm";

export async function fetchAllDeals(): Promise<{ newDeals: number; matched: string[] }> {
  const activeSources = await db.select().from(feedSources).where(eq(feedSources.active, true));
  let newDealCount = 0;
  const matchedKeywords: string[] = [];

  for (const source of activeSources) {
    if (source.type === "rss") {
      const rawDeals = await fetchRssFeed(source.url);

      for (const raw of rawDeals) {
        // Skip duplicates
        const existing = await db.select({ id: deals.id })
          .from(deals)
          .where(eq(deals.externalId, raw.externalId))
          .limit(1);

        if (existing.length > 0) continue;

        const classification = classifyDeal(raw.title, raw.description, raw.store || "");

        // Skip food and event categories
        if (classification.category === "food" || classification.category === "event") continue;

        await db.insert(deals).values({
          externalId: raw.externalId,
          title: raw.title,
          description: raw.description,
          url: raw.url,
          imageUrl: raw.imageUrl,
          store: raw.store || "Unknown",
          source: source.name,
          category: classification.category,
          isBigBox: classification.isBigBox,
          isChicagoland: classification.isChicagoland,
          price: null,
          originalPrice: null,
          publishedAt: raw.publishedAt || new Date().toISOString(),
          fetchedAt: new Date().toISOString(),
          expiresAt: null,
        });

        newDealCount++;

        // Check keyword matches
        const activeKeywords = await db.select().from(keywords).where(eq(keywords.active, true));
        const dealText = `${raw.title} ${raw.description}`.toLowerCase();
        for (const kw of activeKeywords) {
          if (dealText.includes(kw.keyword.toLowerCase())) {
            matchedKeywords.push(`"${kw.keyword}" matched: ${raw.title}`);
          }
        }
      }

      // Update last fetched timestamp
      await db.update(feedSources)
        .set({ lastFetchedAt: new Date().toISOString() })
        .where(eq(feedSources.id, source.id));
    }
  }

  return { newDeals: newDealCount, matched: matchedKeywords };
}
```

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add deal fetcher, RSS parser, and classification services"
```

---

## Task 4: Cron Job via Instrumentation

**Files:**
- Create: `src/instrumentation.ts`

**Step 1: Install node-cron**

```bash
npm install node-cron
npm install -D @types/node-cron
```

**Step 2: Create instrumentation file**

Create `src/instrumentation.ts`:

```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const cron = await import("node-cron");
    const { fetchAllDeals } = await import("@/services/deal-fetcher");
    const { sendKeywordNotifications } = await import("@/services/notifications");

    const schedule = process.env.CRON_SCHEDULE || "0 * * * *";

    cron.default.schedule(schedule, async () => {
      console.log(`[LocalSteals] Fetching deals at ${new Date().toISOString()}`);
      try {
        const result = await fetchAllDeals();
        console.log(`[LocalSteals] Found ${result.newDeals} new deals`);

        if (result.matched.length > 0) {
          console.log(`[LocalSteals] Keyword matches: ${result.matched.join(", ")}`);
          await sendKeywordNotifications(result.matched);
        }
      } catch (error) {
        console.error("[LocalSteals] Deal fetch failed:", error);
      }
    });

    console.log(`[LocalSteals] Cron job scheduled: ${schedule}`);

    // Run once on startup
    setTimeout(async () => {
      console.log("[LocalSteals] Running initial deal fetch...");
      try {
        const result = await fetchAllDeals();
        console.log(`[LocalSteals] Initial fetch: ${result.newDeals} new deals`);
      } catch (error) {
        console.error("[LocalSteals] Initial fetch failed:", error);
      }
    }, 5000);
  }
}
```

**Step 3: Enable instrumentation in next.config.ts**

Add `instrumentationHook: true` to next.config.ts (if not default in Next.js 16).

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add cron-based deal fetching via instrumentation"
```

---

## Task 5: API Routes

**Files:**
- Create: `src/app/api/deals/route.ts`
- Create: `src/app/api/deals/search/route.ts`
- Create: `src/app/api/keywords/route.ts`
- Create: `src/app/api/fcm/route.ts`
- Create: `src/app/api/fetch-now/route.ts`

**Step 1: Deals listing API**

Create `src/app/api/deals/route.ts`:

```typescript
import { db } from "@/db";
import { deals } from "@/db/schema";
import { desc, eq, and, or, like } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const showBigBox = params.get("bigBox") === "true";
  const category = params.get("category"); // "retail", "auto-service", or "all"
  const page = parseInt(params.get("page") || "1");
  const limit = parseInt(params.get("limit") || "30");
  const offset = (page - 1) * limit;

  const conditions = [];

  if (!showBigBox) {
    conditions.push(eq(deals.isBigBox, false));
  }

  if (category && category !== "all") {
    conditions.push(eq(deals.category, category));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const results = await db.select()
    .from(deals)
    .where(where)
    .orderBy(desc(deals.publishedAt))
    .limit(limit)
    .offset(offset);

  return NextResponse.json(results);
}
```

**Step 2: Search API**

Create `src/app/api/deals/search/route.ts`:

```typescript
import { db } from "@/db";
import { deals } from "@/db/schema";
import { desc, like, and, eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get("q") || "";
  const showBigBox = params.get("bigBox") === "true";

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  const conditions = [
    or(
      like(deals.title, `%${query}%`),
      like(deals.description, `%${query}%`),
      like(deals.store, `%${query}%`)
    ),
  ];

  if (!showBigBox) {
    conditions.push(eq(deals.isBigBox, false));
  }

  const results = await db.select()
    .from(deals)
    .where(and(...conditions))
    .orderBy(desc(deals.publishedAt))
    .limit(50);

  return NextResponse.json(results);
}
```

**Step 3: Keywords CRUD API**

Create `src/app/api/keywords/route.ts`:

```typescript
import { db } from "@/db";
import { keywords } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const result = await db.select().from(keywords);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const { keyword } = await request.json();
  if (!keyword?.trim()) {
    return NextResponse.json({ error: "Keyword required" }, { status: 400 });
  }
  const result = await db.insert(keywords).values({
    keyword: keyword.trim().toLowerCase(),
    active: true,
    createdAt: new Date().toISOString(),
  }).onConflictDoNothing().returning();

  return NextResponse.json(result);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await db.delete(keywords).where(eq(keywords.id, id));
  return NextResponse.json({ success: true });
}
```

**Step 4: FCM token registration API**

Create `src/app/api/fcm/route.ts`:

```typescript
import { db } from "@/db";
import { fcmTokens } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }
  await db.insert(fcmTokens).values({
    token,
    createdAt: new Date().toISOString(),
  }).onConflictDoNothing();

  return NextResponse.json({ success: true });
}
```

**Step 5: Manual fetch trigger API**

Create `src/app/api/fetch-now/route.ts`:

```typescript
import { fetchAllDeals } from "@/services/deal-fetcher";
import { NextResponse } from "next/server";

export async function POST() {
  const result = await fetchAllDeals();
  return NextResponse.json(result);
}
```

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add API routes for deals, search, keywords, and FCM"
```

---

## Task 6: Firebase Cloud Messaging (Notifications Service)

**Files:**
- Create: `src/services/notifications.ts`
- Create: `src/lib/firebase-admin.ts`
- Create: `src/lib/firebase-client.ts`

**Step 1: Install Firebase packages**

```bash
npm install firebase firebase-admin
```

**Step 2: Create Firebase Admin SDK init**

Create `src/lib/firebase-admin.ts`:

```typescript
import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount)),
    });
  }
}

export default admin;
```

**Step 3: Create Firebase client init**

Create `src/lib/firebase-client.ts`:

```typescript
import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export { app, getMessaging, getToken, onMessage, isSupported };
```

**Step 4: Create notification sender service**

Create `src/services/notifications.ts`:

```typescript
import admin from "@/lib/firebase-admin";
import { db } from "@/db";
import { fcmTokens } from "@/db/schema";

export async function sendKeywordNotifications(matches: string[]): Promise<void> {
  if (!admin.apps.length) {
    console.warn("[LocalSteals] Firebase Admin not configured, skipping notifications");
    return;
  }

  const tokens = await db.select().from(fcmTokens);
  if (tokens.length === 0) return;

  const body = matches.length === 1
    ? matches[0]
    : `${matches.length} keyword matches found`;

  const message = {
    notification: {
      title: "LocalSteals - Keyword Match!",
      body,
    },
    tokens: tokens.map(t => t.token),
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`[LocalSteals] Sent ${response.successCount} notifications`);
  } catch (error) {
    console.error("[LocalSteals] Notification send failed:", error);
  }
}
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Firebase Cloud Messaging for push notifications"
```

---

## Task 7: PWA Setup with Serwist + FCM Service Worker

**Files:**
- Create: `src/app/sw.ts`
- Create: `src/app/manifest.ts`
- Modify: `next.config.ts`

**Step 1: Install Serwist**

```bash
npm install @serwist/next
npm install -D @serwist/sw @serwist/precaching @serwist/webpack-plugin
```

**Step 2: Create service worker with FCM integration**

Create `src/app/sw.ts`:

```typescript
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

// FCM push notification handler
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options: NotificationOptions = {
    body: data.notification?.body || "New deal found!",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: data.data,
  };

  event.waitUntil(
    self.registration.showNotification(
      data.notification?.title || "LocalSteals",
      options
    )
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      if (clients.length > 0) {
        clients[0].focus();
      } else {
        self.clients.openWindow("/");
      }
    })
  );
});

serwist.addEventListeners();
```

**Step 3: Create manifest**

Create `src/app/manifest.ts`:

```typescript
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LocalSteals",
    short_name: "LocalSteals",
    description: "Chicagoland local deals aggregator",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#10b981",
    icons: [
      { src: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
```

**Step 4: Update next.config.ts for Serwist**

```typescript
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

const nextConfig = {
  // existing config
};

export default withSerwist(nextConfig);
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add PWA support with Serwist and FCM service worker"
```

---

## Task 8: Frontend — Use `frontend-design` Skill

> **REQUIRED SUB-SKILL:** Use `frontend-design` skill for this entire task.

**Design brief for the frontend-design skill:**

- **App name:** LocalSteals
- **Style:** Dark mode deal hunter — dark backgrounds (#0a0a0a base), neon/emerald accent colors, sleek dashboard feel
- **Layout:** Mobile-first, infinite-scroll deal feed
- **Key UI components:**
  1. **Top bar**: App name "LocalSteals", search icon, settings gear icon
  2. **Filter bar**: Big-box toggle switch (default: hidden), category pills (All / Retail / Auto Service)
  3. **Deal cards**: Title, store name, price (if available), source badge, time ago, external link button
  4. **Search overlay**: Full-screen search with real-time results
  5. **Settings page**: Manage keyword alerts (add/remove), manage FCM token registration, manual "Fetch Now" button
  6. **Empty state**: Friendly message when no deals match filters
- **Interactions:** Pull-to-refresh feel, infinite scroll pagination, smooth toggle animations
- **Accessibility:** High contrast on dark backgrounds, proper focus states

**Files to create:**
- `src/app/layout.tsx` — root layout with dark theme, PWA meta
- `src/app/page.tsx` — main deal feed page
- `src/app/settings/page.tsx` — settings/keyword management
- `src/components/DealCard.tsx` — individual deal card
- `src/components/DealFeed.tsx` — infinite scroll deal list
- `src/components/FilterBar.tsx` — big-box toggle + category pills
- `src/components/SearchOverlay.tsx` — search UI
- `src/components/TopBar.tsx` — header/navigation
- `src/components/KeywordManager.tsx` — keyword alert CRUD
- `src/components/NotificationSetup.tsx` — FCM permission + token registration
- `src/hooks/useDeals.ts` — deal fetching hook with infinite scroll
- `src/hooks/useSearch.ts` — search debounce hook

---

## Task 9: PWA Icons & Assets

**Files:**
- Create: `public/icon-192x192.png`
- Create: `public/icon-512x512.png`
- Create: `public/favicon.ico`

Generate LocalSteals app icons — dark themed with an emerald/green accent. Can use a simple "LS" monogram or a deal tag icon.

**Step 1: Generate or source icons**

Use an icon generator or create simple SVG-to-PNG icons.

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add PWA icons and assets"
```

---

## Task 10: FCM Client-Side Registration

**Files:**
- Create: `src/components/NotificationSetup.tsx`

This component handles:
1. Checking if notifications are supported
2. Requesting notification permission from the browser
3. Getting the FCM token
4. Sending the token to our API for storage

**Step 1: Create the component** (specifics defined in Task 8 frontend work)

**Step 2: Wire it into the settings page**

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add client-side FCM token registration"
```

---

## Task 11: Testing & Polish

**Step 1: Install testing dependencies**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Step 2: Write tests for core services**

- Test: `src/services/__tests__/deal-classifier.test.ts` — verify big-box detection, category classification, Chicagoland detection
- Test: `src/services/__tests__/rss-parser.test.ts` — verify RSS parsing with mock data
- Test: `src/lib/__tests__/big-box-list.test.ts` — verify retailer matching

**Step 3: Run tests**

```bash
npx vitest run
```

**Step 4: Manual end-to-end testing**

```bash
npm run dev
```

1. Verify deal feed loads with deals from RSS sources
2. Toggle big-box filter on/off
3. Switch between category filters
4. Search for a specific term
5. Add a keyword alert in settings
6. Verify push notification permission prompt works
7. Test on phone by accessing `http://<local-ip>:3000`

**Step 5: Commit**

```bash
git add -A
git commit -m "test: add unit tests for deal classifier and RSS parser"
```

---

## Task 12 (Future): API-Based Deal Sources

Add Google Places API, Yelp Fusion, Foursquare Places, and Openmart Local integrations for richer local deal discovery. These APIs provide structured business data that can complement the RSS feeds.

**Deferred** — get the RSS-based MVP working first, then layer in APIs.

---

## Summary of Execution Order

| Task | Description | Dependencies |
|------|-------------|-------------|
| 1 | Project scaffolding | None |
| 2 | Database schema + Drizzle | Task 1 |
| 3 | Deal fetcher services | Task 2 |
| 4 | Cron job instrumentation | Task 3 |
| 5 | API routes | Task 2 |
| 6 | Firebase notifications | Task 2 |
| 7 | PWA + Serwist setup | Task 1 |
| 8 | Frontend UI (use frontend-design skill) | Tasks 5, 7 |
| 9 | PWA icons | Task 7 |
| 10 | FCM client registration | Tasks 6, 8 |
| 11 | Testing & polish | All above |
| 12 | API deal sources (future) | Task 3 |
