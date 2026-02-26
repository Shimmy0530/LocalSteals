/**
 * Deal classification service.
 *
 * Analyses a deal's title, description, and store name to determine:
 *  - whether it comes from a big-box retailer
 *  - whether it's Chicagoland-relevant
 *  - its content category (retail, auto-service, food, event, other)
 */

import { isBigBox } from "@/lib/big-box-list";

// ---------------------------------------------------------------------------
// Chicagoland keywords (configurable via env)
// ---------------------------------------------------------------------------

const CHICAGOLAND_KEYWORDS: string[] = (
  process.env.CHICAGOLAND_KEYWORDS || "chicago,chicagoland"
)
  .split(",")
  .map((k) => k.trim().toLowerCase())
  .filter(Boolean);

// ---------------------------------------------------------------------------
// Category keyword lists
// ---------------------------------------------------------------------------

const AUTO_SERVICE_KEYWORDS: string[] = [
  "oil change",
  "tire",
  "brake",
  "auto repair",
  "car wash",
  "car service",
  "mechanic",
  "transmission",
  "alignment",
  "muffler",
  "exhaust",
  "detailing",
  "auto body",
  "windshield",
  "battery replacement",
  "tune-up",
  "inspection",
];

const FOOD_KEYWORDS: string[] = [
  "restaurant",
  "pizza",
  "burger",
  "sushi",
  "dining",
  "brunch",
  "cafe",
  "coffee shop",
  "bakery",
  "food delivery",
  "doordash",
  "grubhub",
  "ubereats",
];

const EVENT_KEYWORDS: string[] = [
  "concert",
  "ticket",
  "festival",
  "show",
  "theater",
  "theatre",
  "museum",
  "exhibition",
  "sporting event",
  "comedy show",
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface DealClassification {
  isBigBox: boolean;
  isChicagoland: boolean;
  category: "retail" | "auto-service" | "food" | "event" | "other";
}

/**
 * Classify a deal based on its title, description, and store name.
 *
 * Category priority: auto-service > food > event > retail (default).
 */
export function classifyDeal(
  title: string,
  description: string,
  store: string,
): DealClassification {
  const combined = [title, description, store]
    .map((s) => (s || "").toLowerCase())
    .join(" ");

  const isChicagoland = CHICAGOLAND_KEYWORDS.some((kw) =>
    combined.includes(kw),
  );

  const bigBox = isBigBox(store || "");

  // Determine category with priority ordering
  let category: DealClassification["category"] = "retail";

  if (AUTO_SERVICE_KEYWORDS.some((kw) => combined.includes(kw))) {
    category = "auto-service";
  } else if (FOOD_KEYWORDS.some((kw) => combined.includes(kw))) {
    category = "food";
  } else if (EVENT_KEYWORDS.some((kw) => combined.includes(kw))) {
    category = "event";
  }

  return {
    isBigBox: bigBox,
    isChicagoland: isChicagoland,
    category,
  };
}
