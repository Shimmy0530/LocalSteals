/*
 * Copyright (c) 2025 Trash Panda Labs, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying prohibited.
 */

import { describe, it, expect } from "vitest";
import {
  fetchRssFeed,
  stripHtml,
  extractImageUrl,
  extractStore,
} from "@/services/rss-parser";

describe("rss-parser module", () => {
  // -----------------------------------------------------------
  // Module export checks
  // -----------------------------------------------------------
  it("exports fetchRssFeed as a function", () => {
    expect(typeof fetchRssFeed).toBe("function");
  });

  it("exports stripHtml as a function", () => {
    expect(typeof stripHtml).toBe("function");
  });

  it("exports extractImageUrl as a function", () => {
    expect(typeof extractImageUrl).toBe("function");
  });

  it("exports extractStore as a function", () => {
    expect(typeof extractStore).toBe("function");
  });
});

// -----------------------------------------------------------
// stripHtml
// -----------------------------------------------------------
describe("stripHtml", () => {
  it("strips HTML tags from a string", () => {
    expect(stripHtml("<p>Hello <b>world</b></p>")).toBe("Hello world");
  });

  it("handles empty strings", () => {
    expect(stripHtml("")).toBe("");
  });

  it("returns plain text unchanged", () => {
    expect(stripHtml("No tags here")).toBe("No tags here");
  });

  it("handles self-closing tags", () => {
    expect(stripHtml("Line one<br/>Line two")).toBe("Line oneLine two");
  });

  it("handles nested tags", () => {
    expect(stripHtml("<div><span>nested</span></div>")).toBe("nested");
  });
});

// -----------------------------------------------------------
// extractImageUrl
// -----------------------------------------------------------
describe("extractImageUrl", () => {
  it("extracts src from an img tag with double quotes", () => {
    const html = '<p>Text</p><img src="https://example.com/img.jpg" />';
    expect(extractImageUrl(html)).toBe("https://example.com/img.jpg");
  });

  it("extracts src from an img tag with single quotes", () => {
    const html = "<img src='https://example.com/photo.png' alt='photo' />";
    expect(extractImageUrl(html)).toBe("https://example.com/photo.png");
  });

  it("returns undefined when no img tag is present", () => {
    expect(extractImageUrl("<p>No image here</p>")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(extractImageUrl("")).toBeUndefined();
  });

  it("extracts the first image when multiple are present", () => {
    const html =
      '<img src="https://first.com/a.jpg" /><img src="https://second.com/b.jpg" />';
    expect(extractImageUrl(html)).toBe("https://first.com/a.jpg");
  });
});

// -----------------------------------------------------------
// extractStore
// -----------------------------------------------------------
describe("extractStore", () => {
  describe("colon pattern: 'StoreName: Deal title'", () => {
    it("extracts store from colon-prefixed title", () => {
      expect(extractStore("BestBuy: 50% off laptops", "")).toBe("BestBuy");
    });

    it("extracts store name with spaces", () => {
      expect(extractStore("Home Depot: Spring sale", "")).toBe("Home Depot");
    });

    it("does not extract very long prefixes (>30 chars)", () => {
      const longName = "A".repeat(35);
      expect(extractStore(`${longName}: Some deal`, "")).toBeUndefined();
    });
  });

  describe("at pattern: 'Deal Title at StoreName'", () => {
    it("extracts store from 'at StoreName' pattern", () => {
      expect(extractStore("Oil Change Special at Jiffy Lube", "")).toBe(
        "Jiffy Lube",
      );
    });

    it("extracts store when followed by dash", () => {
      expect(
        extractStore("Great deals at Target - this weekend only", ""),
      ).toBe("Target");
    });

    it("extracts store at end of title", () => {
      expect(extractStore("Big savings at Costco", "")).toBe("Costco");
    });
  });

  describe("content fallback", () => {
    it("extracts store from content when not found in title", () => {
      expect(
        extractStore(
          "Amazing deal today",
          "<p>Available at Downtown Shop.</p>",
        ),
      ).toBe("Downtown Shop");
    });
  });

  describe("edge cases", () => {
    it("returns undefined for empty title", () => {
      expect(extractStore("", "")).toBeUndefined();
    });

    it("returns undefined when no pattern matches", () => {
      expect(extractStore("Just a regular title", "")).toBeUndefined();
    });
  });
});