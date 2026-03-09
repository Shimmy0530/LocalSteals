/*
 * Copyright (c) 2025 Trash Panda Labs, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying prohibited.
 */

/** Shape of a deal returned from the API (mirrors DB schema). */
export interface Deal {
  id: number;
  externalId: string | null;
  title: string;
  description: string | null;
  url: string;
  imageUrl: string | null;
  price: number | null;
  originalPrice: number | null;
  store: string | null;
  source: string;
  category: string | null;
  isBigBox: boolean;
  isChicagoland: boolean;
  publishedAt: string | null;
  fetchedAt: string;
  expiresAt: string | null;
}

/** Shape of a keyword returned from the API. */
export interface Keyword {
  id: number;
  keyword: string;
  active: boolean;
  createdAt: string;
}