import { describe, it, expect } from "vitest";
import { classifyDeal } from "@/services/deal-classifier";

describe("classifyDeal", () => {
  // -----------------------------------------------------------
  // Category classification
  // -----------------------------------------------------------
  describe("category detection", () => {
    it('classifies auto-service deals as "auto-service"', () => {
      const result = classifyDeal("Oil Change Special at Jiffy Lube", "", "");
      expect(result.category).toBe("auto-service");
    });

    it('classifies tire-related deals as "auto-service"', () => {
      const result = classifyDeal("Tire rotation and balance deal", "", "");
      expect(result.category).toBe("auto-service");
    });

    it('classifies food deals as "food"', () => {
      const result = classifyDeal(
        "Pizza deal at local restaurant",
        "",
        "",
      );
      expect(result.category).toBe("food");
    });

    it('classifies event deals as "event"', () => {
      const result = classifyDeal("Concert tickets half off", "", "");
      expect(result.category).toBe("event");
    });

    it('classifies generic retail as "retail" (default)', () => {
      const result = classifyDeal("50% off Electronics", "", "");
      expect(result.category).toBe("retail");
    });

    it("gives auto-service priority over food keywords", () => {
      const result = classifyDeal(
        "Oil change and free pizza at the mechanic",
        "",
        "",
      );
      expect(result.category).toBe("auto-service");
    });
  });

  // -----------------------------------------------------------
  // Big-box detection
  // -----------------------------------------------------------
  describe("big-box detection", () => {
    it("detects big-box stores", () => {
      const result = classifyDeal("Great sale", "", "Amazon");
      expect(result.isBigBox).toBe(true);
    });

    it("detects Walmart as big-box", () => {
      const result = classifyDeal("Clearance event", "", "Walmart");
      expect(result.isBigBox).toBe(true);
    });

    it("does not flag small businesses as big-box", () => {
      const result = classifyDeal("Grand opening sale", "", "Joe's Hardware");
      expect(result.isBigBox).toBe(false);
    });
  });

  // -----------------------------------------------------------
  // Chicagoland detection
  // -----------------------------------------------------------
  describe("Chicagoland detection", () => {
    it("detects Chicagoland by keyword in title", () => {
      const result = classifyDeal(
        "Best deals in Chicago this weekend",
        "",
        "",
      );
      expect(result.isChicagoland).toBe(true);
    });

    it("detects Chicagoland by keyword in description", () => {
      const result = classifyDeal(
        "Weekend sale",
        "Available in the chicagoland area",
        "",
      );
      expect(result.isChicagoland).toBe(true);
    });

    it("does not flag non-Chicagoland deals", () => {
      const result = classifyDeal("Great deal in New York", "", "");
      expect(result.isChicagoland).toBe(false);
    });
  });

  // -----------------------------------------------------------
  // Edge cases / empty inputs
  // -----------------------------------------------------------
  describe("edge cases", () => {
    it("handles empty inputs gracefully", () => {
      const result = classifyDeal("", "", "");
      expect(result).toEqual({
        isBigBox: false,
        isChicagoland: false,
        category: "retail",
      });
    });

    it("handles undefined-like values cast to strings", () => {
      const result = classifyDeal(
        undefined as unknown as string,
        undefined as unknown as string,
        undefined as unknown as string,
      );
      expect(result.isBigBox).toBe(false);
      expect(result.category).toBe("retail");
    });
  });
});
