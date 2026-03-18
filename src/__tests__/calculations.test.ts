import { describe, it, expect } from "vitest";
import {
  calculateModuleGrade,
  calculateYearAverage,
  solveForTarget,
  solveForYearTarget,
  checkProgression,
  getClassification,
} from "@/lib/calculations";
import { MODULES, WEIGHTED_MODULES } from "@/config/modules";
import type { GradeMap, ModuleResult } from "@/lib/types";

const findModule = (code: string) =>
  MODULES.find((m) => m.code === code)!;

describe("getClassification", () => {
  it("returns correct classification at boundaries", () => {
    expect(getClassification(70)).toBe("First");
    expect(getClassification(85)).toBe("First");
    expect(getClassification(69.9)).toBe("2:1");
    expect(getClassification(60)).toBe("2:1");
    expect(getClassification(59.9)).toBe("2:2");
    expect(getClassification(50)).toBe("2:2");
    expect(getClassification(49.9)).toBe("Third");
    expect(getClassification(40)).toBe("Third");
    expect(getClassification(39.9)).toBe("Fail");
    expect(getClassification(0)).toBe("Fail");
  });
});

describe("calculateModuleGrade", () => {
  it("returns null currentGrade when no grades entered", () => {
    const mod = findModule("MATH40004");
    const result = calculateModuleGrade(mod, {});
    expect(result.currentGrade).toBeNull();
    expect(result.minPossible).toBe(0);
    expect(result.maxPossible).toBe(100);
    expect(result.enteredWeight).toBe(0);
    expect(result.totalWeight).toBe(100);
  });

  it("computes weighted grade for partial entry", () => {
    const mod = findModule("MATH40004");
    const grades: GradeMap = {
      math40004_autumn_test: 80,
      math40004_spring_test: 60,
    };
    const result = calculateModuleGrade(mod, grades);
    expect(result.currentGrade).toBeCloseTo(70);
    expect(result.enteredWeight).toBe(30);
    expect(result.minPossible).toBeCloseTo(21);
    expect(result.maxPossible).toBeCloseTo(91);
  });

  it("computes correct grade when all assessments entered", () => {
    const mod = findModule("MATH40004");
    const grades: GradeMap = {
      math40004_autumn_test: 80,
      math40004_spring_test: 60,
      math40004_summer_exam: 70,
    };
    const result = calculateModuleGrade(mod, grades);
    expect(result.currentGrade).toBeCloseTo(70);
    expect(result.minPossible).toBeCloseTo(70);
    expect(result.maxPossible).toBeCloseTo(70);
  });

  it("ignores zero-weight assessments (COMP40009 architecture coursework)", () => {
    const mod = findModule("COMP40009");
    const grades: GradeMap = {
      comp40009_architecture_coursework: 100,
    };
    const result = calculateModuleGrade(mod, grades);
    expect(result.currentGrade).toBeNull();
    expect(result.enteredWeight).toBe(0);
  });

  it("handles MATH40002 with 5 assessments", () => {
    const mod = findModule("MATH40002");
    expect(mod.assessments.length).toBe(5);
    expect(mod.assessments.reduce((s, a) => s + a.weight, 0)).toBe(100);
  });

  it("handles MATH40012 with 9 assessments", () => {
    const mod = findModule("MATH40012");
    expect(mod.assessments.length).toBe(9);
    expect(mod.assessments.reduce((s, a) => s + a.weight, 0)).toBe(100);
  });

  it("handles COMP40009 with total weight 100 (excluding arch)", () => {
    const mod = findModule("COMP40009");
    expect(mod.assessments.length).toBe(9);
    expect(mod.assessments.reduce((s, a) => s + a.weight, 0)).toBe(100);
  });
});

describe("calculateYearAverage", () => {
  it("returns null when no grades entered", () => {
    const results: ModuleResult[] = WEIGHTED_MODULES.map((m) => ({
      code: m.code,
      currentGrade: null,
      minPossible: 0,
      maxPossible: 100,
      enteredWeight: 0,
      totalWeight: 100,
    }));
    const year = calculateYearAverage(results);
    expect(year.average).toBeNull();
    expect(year.classification).toBeNull();
    expect(year.minPossible).toBe(0);
    expect(year.maxPossible).toBe(100);
  });

  it("computes ECTS-weighted average", () => {
    const results: ModuleResult[] = WEIGHTED_MODULES.map((m) => ({
      code: m.code,
      currentGrade: 70,
      minPossible: 70,
      maxPossible: 70,
      enteredWeight: 100,
      totalWeight: 100,
    }));
    const year = calculateYearAverage(results);
    expect(year.average).toBeCloseTo(70);
    expect(year.classification).toBe("First");
  });

  it("weights modules by ECTS correctly", () => {
    const results: ModuleResult[] = WEIGHTED_MODULES.map((m) => ({
      code: m.code,
      currentGrade: m.code === "COMP40009" ? 80 : 60,
      minPossible: m.code === "COMP40009" ? 80 : 60,
      maxPossible: m.code === "COMP40009" ? 80 : 60,
      enteredWeight: 100,
      totalWeight: 100,
    }));
    const year = calculateYearAverage(results);
    expect(year.average).toBeCloseTo(3700 / 55);
    expect(year.classification).toBe("2:1");
  });

  it("scales module ECTS by attempted proportion", () => {
    const results: ModuleResult[] = WEIGHTED_MODULES.map((m) => {
      if (m.code === "MATH40004") {
        return { code: m.code, currentGrade: 80, minPossible: 0.8, maxPossible: 100, enteredWeight: 1, totalWeight: 100 };
      }
      if (m.code === "COMP40009") {
        return { code: m.code, currentGrade: 60, minPossible: 60, maxPossible: 60, enteredWeight: 100, totalWeight: 100 };
      }
      return { code: m.code, currentGrade: null, minPossible: 0, maxPossible: 100, enteredWeight: 0, totalWeight: 100 };
    });
    const year = calculateYearAverage(results);
    expect(year.average).toBeCloseTo(1208 / 20.1);
  });

  it("verifies total ECTS is 55", () => {
    const totalEcts = WEIGHTED_MODULES.reduce((s, m) => s + m.ects, 0);
    expect(totalEcts).toBe(55);
  });
});

describe("solveForTarget", () => {
  it("returns required mark for a target", () => {
    const result = solveForTarget(70, 80 * 30, 30, 100);
    expect(result).toBeCloseTo(4600 / 70);
  });

  it("returns null when target is impossible", () => {
    const result = solveForTarget(70, 10 * 90, 90, 100);
    expect(result).toBeNull();
  });

  it("returns 0 when target already secured", () => {
    const result = solveForTarget(40, 80 * 90, 90, 100);
    expect(result).toBe(0);
  });

  it("returns null when no remaining weight", () => {
    const result = solveForTarget(70, 7000, 100, 100);
    expect(result).toBeNull();
  });
});

describe("solveForYearTarget", () => {
  it("returns required average for a First when no grades entered", () => {
    const result = solveForYearTarget(70, {});
    expect(result).toBeCloseTo(70);
  });

  it("returns 0 when target already secured", () => {
    const grades: GradeMap = {};
    for (const mod of MODULES) {
      for (const a of mod.assessments) {
        if (a.weight > 0) grades[a.id] = 90;
      }
    }
    const result = solveForYearTarget(40, grades);
    expect(result).toBeNull();
  });

  it("returns null when target is impossible", () => {
    const grades: GradeMap = {};
    for (const mod of MODULES) {
      for (const a of mod.assessments) {
        if (a.weight > 0) grades[a.id] = 10;
      }
    }
    const result = solveForYearTarget(70, grades);
    expect(result).toBeNull();
  });

  it("computes correct required mark with partial grades", () => {
    const grades: GradeMap = {
      math40004_autumn_test: 80,
    };
    const result = solveForYearTarget(70, grades);
    expect(result).not.toBeNull();
    expect(result!).toBeGreaterThan(0);
    expect(result!).toBeLessThanOrEqual(100);
  });

  it("returns 0 when already guaranteed with partial grades", () => {
    const grades: GradeMap = {};
    for (const a of findModule("COMP40009").assessments) {
      if (a.weight > 0) grades[a.id] = 90;
    }
    for (const a of findModule("MATH40002").assessments) {
      if (a.weight > 0) grades[a.id] = 90;
    }
    for (const a of findModule("MATH40004").assessments) {
      if (a.weight > 0) grades[a.id] = 90;
    }
    const result = solveForYearTarget(40, grades);
    expect(result).toBe(0);
  });
});

describe("checkProgression", () => {
  it("returns all green when all modules at 70", () => {
    const grades: GradeMap = {};
    for (const mod of MODULES) {
      for (const a of mod.assessments) {
        grades[a.id] = a.id === "math40009_pass" ? 100 : 70;
      }
    }
    const results = MODULES.map((m) => calculateModuleGrade(m, grades));
    const reqs = checkProgression(results, grades);
    expect(reqs.length).toBe(10);
    for (const req of reqs) {
      expect(req.status).toBe("green");
    }
  });

  it("returns red for a failing module", () => {
    const grades: GradeMap = {};
    for (const mod of MODULES) {
      for (const a of mod.assessments) {
        grades[a.id] = mod.code === "MATH40004" ? 20 : 70;
      }
    }
    const results = MODULES.map((m) => calculateModuleGrade(m, grades));
    const reqs = checkProgression(results, grades);
    const mathReq = reqs.find((r) => r.id === "module_pass_MATH40004");
    expect(mathReq?.status).toBe("red");
  });

  it("returns amber when outcome uncertain", () => {
    const grades: GradeMap = {
      math40004_autumn_test: 30,
      math40004_spring_test: 30,
    };
    const results = MODULES.map((m) => calculateModuleGrade(m, grades));
    const reqs = checkProgression(results, grades);
    const mathReq = reqs.find((r) => r.id === "module_pass_MATH40004");
    expect(mathReq?.status).toBe("amber");
  });

  it("checks programming tests requirement", () => {
    const grades: GradeMap = {
      comp40009_haskell_interim: 70,
      comp40009_haskell_final: 70,
      comp40009_kotlin_interim: 70,
      comp40009_kotlin_final: 70,
      comp40009_c_main_test: 70,
    };
    const results = MODULES.map((m) => calculateModuleGrade(m, grades));
    const reqs = checkProgression(results, grades);
    const progReq = reqs.find((r) => r.id === "prog_tests_50");
    expect(progReq?.status).toBe("green");
  });
});
