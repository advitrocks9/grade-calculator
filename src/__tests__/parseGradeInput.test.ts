import { describe, it, expect } from "vitest";
import { parseGradeInput } from "@/utils/parseGradeInput";

describe("parseGradeInput", () => {
  it("parses plain numbers", () => {
    expect(parseGradeInput("75")).toBe(75);
    expect(parseGradeInput("0")).toBe(0);
    expect(parseGradeInput("100")).toBe(100);
    expect(parseGradeInput("85.5")).toBe(85.5);
  });

  it("clamps plain numbers to [0, 100]", () => {
    expect(parseGradeInput("150")).toBe(100);
    expect(parseGradeInput("-10")).toBe(0);
  });

  it("parses fractions", () => {
    expect(parseGradeInput("52/60")).toBeCloseTo(86.667, 2);
    expect(parseGradeInput("30/30")).toBeCloseTo(100);
    expect(parseGradeInput("0/50")).toBe(0);
    expect(parseGradeInput("15/20")).toBe(75);
  });

  it("clamps fraction results to [0, 100]", () => {
    expect(parseGradeInput("120/100")).toBe(100);
  });

  it("returns null for division by zero", () => {
    expect(parseGradeInput("50/0")).toBeNull();
  });

  it("returns null for empty/whitespace input", () => {
    expect(parseGradeInput("")).toBeNull();
    expect(parseGradeInput("  ")).toBeNull();
  });

  it("returns null for non-numeric input", () => {
    expect(parseGradeInput("abc")).toBeNull();
    expect(parseGradeInput("hello")).toBeNull();
  });

  it("handles whitespace around fractions", () => {
    expect(parseGradeInput(" 52 / 60 ")).toBeCloseTo(86.667, 2);
  });

  it("handles decimal fractions", () => {
    expect(parseGradeInput("7.5/10")).toBe(75);
  });
});
