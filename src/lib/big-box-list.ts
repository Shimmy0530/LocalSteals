/*
 * Copyright (c) 2025 Trash Panda Labs, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying prohibited.
 */

/**
 * Big-box / national retailer detection.
 *
 * Used by the deal classifier to flag deals from large national chains
 * so they can be deprioritised in favour of local small-business deals.
 */

export const BIG_BOX_RETAILERS = new Set<string>([
  "amazon",
  "walmart",
  "target",
  "best buy",
  "costco",
  "sam's club",
  "home depot",
  "lowe's",
  "lowes",
  "walgreens",
  "cvs",
  "kroger",
  "meijer",
  "kohl's",
  "kohls",
  "jcpenney",
  "macy's",
  "macys",
  "nordstrom",
  "staples",
  "office depot",
  "dick's sporting goods",
  "petco",
  "petsmart",
  "dollar general",
  "dollar tree",
  "family dollar",
  "rite aid",
  "albertsons",
  "safeway",
  "publix",
  "aldi",
  "lidl",
  "bj's wholesale",
  "menards",
  "ace hardware",
  "autozone",
  "o'reilly auto parts",
  "advance auto parts",
  "gamestop",
  "barnes & noble",
  "sephora",
  "ulta",
  "t.j. maxx",
  "tjmaxx",
  "marshalls",
  "homegoods",
  "ross",
  "burlington",
  "five below",
  "michaels",
  "hobby lobby",
  "bath & body works",
  "victoria's secret",
  "gap",
  "old navy",
  "banana republic",
  "foot locker",
  "nike",
  "adidas",
  "under armour",
  "newegg",
  "wayfair",
  "overstock",
  "ebay",
  "wish",
  "temu",
  "shein",
  "aliexpress",
]);

/**
 * Determine whether a store name refers to a big-box / national retailer.
 *
 * Checks exact match first, then checks whether any known retailer name
 * appears as a substring (handles variants like "Amazon.com" or
 * "Target - Online").
 */
export function isBigBox(storeName: string): boolean {
  if (!storeName) return false;

  const normalised = storeName.toLowerCase().trim();

  // Exact match
  if (BIG_BOX_RETAILERS.has(normalised)) return true;

  // Substring / contains match
  for (const retailer of BIG_BOX_RETAILERS) {
    if (normalised.includes(retailer)) return true;
  }

  return false;
}