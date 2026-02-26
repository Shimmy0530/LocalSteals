/**
 * RSS feed parser service.
 *
 * Fetches and normalises RSS feed items into a common RawDeal shape
 * ready for classification and database insertion.
 */

import Parser from "rss-parser";

// ---------------------------------------------------------------------------
// Parser instance (reused across calls)
// ---------------------------------------------------------------------------

const parser = new Parser({
  timeout: 10_000,
  headers: {
    "User-Agent": "LocalSteals/1.0",
  },
});

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface RawDeal {
  externalId: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  store?: string;
  publishedAt?: string;
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

/**
 * Fetch an RSS feed and return normalised RawDeal items.
 * Returns an empty array on failure so one bad feed never crashes the run.
 */
export async function fetchRssFeed(feedUrl: string): Promise<RawDeal[]> {
  try {
    const feed = await parser.parseURL(feedUrl);

    return (feed.items || []).map((item) => {
      const htmlContent = item.content || item["content:encoded"] || "";
      const description =
        stripHtml(item.contentSnippet || htmlContent || item.summary || "") ||
        "";

      return {
        externalId:
          item.guid || item.link || `${feedUrl}-${Date.now()}-${Math.random()}`,
        title: item.title || "Untitled Deal",
        description,
        url: item.link || feedUrl,
        imageUrl: extractImageUrl(htmlContent || item.summary || ""),
        store: extractStore(item.title || "", htmlContent),
        publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error(`[rss-parser] Failed to fetch feed: ${feedUrl}`, error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strip all HTML tags from a string.
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Extract the first image URL (src attribute) from HTML content.
 */
export function extractImageUrl(content: string): string | undefined {
  if (!content) return undefined;
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || undefined;
}

/**
 * Try to extract a store name from the deal title or content.
 *
 * Patterns handled:
 *  - "StoreName: Deal title here"
 *  - "Great deal at StoreName"
 *  - "... at StoreName - extra info"
 */
export function extractStore(title: string, content: string): string | undefined {
  if (!title) return undefined;

  // Pattern 1: "StoreName: ..."
  const colonMatch = title.match(/^([A-Za-z0-9\s.&''-]+?):\s/);
  if (colonMatch) {
    const candidate = colonMatch[1].trim();
    // Avoid matching very long prefixes (likely not a store name)
    if (candidate.length <= 30) return candidate;
  }

  // Pattern 2: "... at StoreName" (end of title or before dash/pipe)
  const atMatch = title.match(/\bat\s+([A-Za-z0-9\s.&''-]+?)(?:\s*[-|]|$)/i);
  if (atMatch) {
    const candidate = atMatch[1].trim();
    if (candidate.length <= 30) return candidate;
  }

  // Pattern 3: check content for "at StoreName" as well
  if (content) {
    const contentText = stripHtml(content);
    const contentAtMatch = contentText.match(
      /\bat\s+([A-Za-z0-9\s.&''-]+?)(?:\s*[-|.,]|$)/i,
    );
    if (contentAtMatch) {
      const candidate = contentAtMatch[1].trim();
      if (candidate.length <= 30) return candidate;
    }
  }

  return undefined;
}
