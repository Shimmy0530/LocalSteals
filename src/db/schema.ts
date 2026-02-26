import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

/**
 * Deals scraped/fetched from various deal aggregator feeds.
 */
export const deals = sqliteTable("deals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  externalId: text("external_id").unique(),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  price: real("price"),
  originalPrice: real("original_price"),
  store: text("store"),
  source: text("source").notNull(), // e.g. "slickdeals"
  category: text("category"), // e.g. "retail", "auto-service"
  isBigBox: integer("is_big_box", { mode: "boolean" }).default(false),
  isChicagoland: integer("is_chicagoland", { mode: "boolean" }).default(false),
  publishedAt: text("published_at"),
  fetchedAt: text("fetched_at").notNull(),
  expiresAt: text("expires_at"),
});

/**
 * Keywords used to filter/match relevant deals.
 */
export const keywords = sqliteTable("keywords", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  keyword: text("keyword").notNull().unique(),
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull(),
});

/**
 * Firebase Cloud Messaging tokens for push notifications.
 */
export const fcmTokens = sqliteTable("fcm_tokens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  token: text("token").notNull().unique(),
  createdAt: text("created_at").notNull(),
});

/**
 * RSS/API feed sources to fetch deals from.
 */
export const feedSources = sqliteTable("feed_sources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  type: text("type").notNull(), // "rss" or "api"
  active: integer("active", { mode: "boolean" }).default(true),
  lastFetchedAt: text("last_fetched_at"),
});
