import { describe, it, expect } from "vitest";
import { isBigBox } from "@/lib/big-box-list";

describe("isBigBox", () => {
  // -----------------------------------------------------------
  // Exact matches
  // -----------------------------------------------------------
  it("returns true for exact matches", () => {
    expect(isBigBox("amazon")).toBe(true);
    expect(isBigBox("walmart")).toBe(true);
    expect(isBigBox("target")).toBe(true);
    expect(isBigBox("best buy")).toBe(true);
    expect(isBigBox("costco")).toBe(true);
  });

  // -----------------------------------------------------------
  // Partial / substring matches
  // -----------------------------------------------------------
  it("returns true for partial matches", () => {
    expect(isBigBox("Amazon.com")).toBe(true);
    expect(isBigBox("Walmart Supercenter")).toBe(true);
    expect(isBigBox("Target - Online")).toBe(true);
    expect(isBigBox("Shop at Best Buy today")).toBe(true);
  });

  // -----------------------------------------------------------
  // Non-big-box stores
  // -----------------------------------------------------------
  it("returns false for non-big-box stores", () => {
    expect(isBigBox("Joe's Hardware")).toBe(false);
    expect(isBigBox("Mike's Auto Shop")).toBe(false);
    expect(isBigBox("Downtown Bakery")).toBe(false);
    expect(isBigBox("Local Pizza Place")).toBe(false);
  });

  // -----------------------------------------------------------
  // Empty / falsy inputs
  // -----------------------------------------------------------
  it("returns false for empty string", () => {
    expect(isBigBox("")).toBe(false);
  });

  it("returns false for undefined / null (cast to string guard)", () => {
    // The function signature expects a string, but the guard handles falsy values
    expect(isBigBox(undefined as unknown as string)).toBe(false);
    expect(isBigBox(null as unknown as string)).toBe(false);
  });

  // -----------------------------------------------------------
  // Case insensitivity
  // -----------------------------------------------------------
  it("is case-insensitive", () => {
    expect(isBigBox("AMAZON")).toBe(true);
    expect(isBigBox("WaLmArT")).toBe(true);
    expect(isBigBox("TARGET")).toBe(true);
    expect(isBigBox("Best Buy")).toBe(true);
    expect(isBigBox("COSTCO")).toBe(true);
  });
});
