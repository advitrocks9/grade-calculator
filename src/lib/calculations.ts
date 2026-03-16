import type {
  Module,
  GradeMap,
  ModuleResult,
  YearResult,
  Classification,
  ProgressionStatus,
  ProgressionRequirement,
} from "./types";
import { MODULES, TOTAL_WEIGHTED_ECTS, WEIGHTED_MODULES } from "@/config/modules";

export function getClassification(mark: number): Classification {
  if (mark >= 70) return "First";
  if (mark >= 60) return "2:1";
  if (mark >= 50) return "2:2";
  if (mark >= 40) return "Third";
  return "Fail";
}

export function calculateModuleGrade(
  module: Module,
  grades: GradeMap,
): ModuleResult {
  const totalWeight = module.assessments.reduce(
    (sum, a) => sum + a.weight,
    0,
  );

  let enteredWeightedSum = 0;
  let enteredWeight = 0;

  for (const assessment of module.assessments) {
    if (assessment.weight === 0) continue;
    const mark = grades[assessment.id];
    if (mark != null) {
      enteredWeightedSum += mark * assessment.weight;
      enteredWeight += assessment.weight;
    }
  }

  const remainingWeight = totalWeight - enteredWeight;
  const currentGrade =
    enteredWeight > 0 ? enteredWeightedSum / enteredWeight : null;
  const minPossible = enteredWeightedSum / totalWeight;
  const maxPossible = (enteredWeightedSum + remainingWeight * 100) / totalWeight;

  return {
    code: module.code,
    currentGrade,
    minPossible,
    maxPossible,
    enteredWeight,
    totalWeight,
  };
}

export function calculateYearAverage(
  moduleResults: ModuleResult[],
): YearResult {
  const weightedModules = WEIGHTED_MODULES;
  const resultsMap = new Map(moduleResults.map((r) => [r.code, r]));

  let hasAnyGrade = false;
  let weightedSum = 0;
  let enteredEcts = 0;
  let minSum = 0;
  let maxSum = 0;

  for (const mod of weightedModules) {
    const result = resultsMap.get(mod.code);
    if (!result) continue;

    if (result.currentGrade != null) {
      hasAnyGrade = true;
      weightedSum += result.currentGrade * mod.ects;
      enteredEcts += mod.ects;
    }

    minSum += result.minPossible * mod.ects;
    maxSum += result.maxPossible * mod.ects;
  }

  const average = hasAnyGrade ? weightedSum / enteredEcts : null;
  const minPossible = minSum / TOTAL_WEIGHTED_ECTS;
  const maxPossible = maxSum / TOTAL_WEIGHTED_ECTS;

  return {
    average,
    minPossible,
    maxPossible,
    classification: average != null ? getClassification(average) : null,
  };
}

export function solveForTarget(
  target: number,
  enteredSum: number,
  enteredWeight: number,
  totalWeight: number,
): number | null {
  const remainingWeight = totalWeight - enteredWeight;
  if (remainingWeight <= 0) return null;

  const required =
    (target * totalWeight - enteredSum) / remainingWeight;

  if (required > 100) return null;
  if (required <= 0) return 0;
  return required;
}

export function solveForYearTarget(
  target: number,
  grades: GradeMap,
): number | null {
  let totalEnteredContribution = 0;
  let totalRemainingCapacity = 0;

  for (const mod of WEIGHTED_MODULES) {
    const totalWeight = mod.assessments.reduce((s, a) => s + a.weight, 0);
    let enteredSum = 0;
    let enteredWeight = 0;

    for (const a of mod.assessments) {
      if (a.weight === 0) continue;
      const mark = grades[a.id];
      if (mark != null) {
        enteredSum += mark * a.weight;
        enteredWeight += a.weight;
      }
    }

    const remainingWeight = totalWeight - enteredWeight;
    totalEnteredContribution += (enteredSum * mod.ects) / totalWeight;
    totalRemainingCapacity += (remainingWeight * mod.ects) / totalWeight;
  }

  if (totalRemainingCapacity <= 0) return null;

  const required =
    (target * TOTAL_WEIGHTED_ECTS - totalEnteredContribution) / totalRemainingCapacity;

  if (required > 100) return null;
  if (required <= 0) return 0;
  return required;
}

const PROGRAMMING_TEST_IDS = [
  "comp40009_haskell_interim",
  "comp40009_haskell_final",
  "comp40009_kotlin_interim",
  "comp40009_kotlin_final",
  "comp40009_c_main_test",
] as const;

const PROGRAMMING_TEST_TOTAL_WEIGHT = 82;

function getProgressionStatus(
  minPossible: number,
  maxPossible: number,
  threshold: number,
): ProgressionStatus {
  if (minPossible >= threshold) return "green";
  if (maxPossible < threshold) return "red";
  return "amber";
}

export function checkProgression(
  moduleResults: ModuleResult[],
  grades: GradeMap,
): ProgressionRequirement[] {
  const resultsMap = new Map(moduleResults.map((r) => [r.code, r]));
  const requirements: ProgressionRequirement[] = [];

  const yearResult = calculateYearAverage(moduleResults);
  requirements.push({
    id: "year_avg_40",
    label: "Year average ≥ 40%",
    status: getProgressionStatus(yearResult.minPossible, yearResult.maxPossible, 40),
    detail:
      yearResult.average != null
        ? `Current: ${yearResult.average.toFixed(1)}% (min: ${yearResult.minPossible.toFixed(1)}%, max: ${yearResult.maxPossible.toFixed(1)}%)`
        : "No grades entered",
  });

  const ium = grades["math40009_pass"];
  requirements.push({
    id: "math40009_pass",
    label: "MATH40009 Introduction to University Mathematics: pass",
    status: ium === 100 ? "green" : ium === 0 ? "red" : "amber",
    detail: ium === 100 ? "Passed" : ium === 0 ? "Not yet passed" : "Not entered",
    moduleCode: "MATH40009",
  });

  for (const mod of WEIGHTED_MODULES) {
    const result = resultsMap.get(mod.code);
    if (!result) continue;

    requirements.push({
      id: `module_pass_${mod.code}`,
      label: `${mod.code} ${mod.name} ≥ 40%`,
      status: getProgressionStatus(result.minPossible, result.maxPossible, 40),
      detail:
        result.currentGrade != null
          ? `Current: ${result.currentGrade.toFixed(1)}% (min: ${result.minPossible.toFixed(1)}%, max: ${result.maxPossible.toFixed(1)}%)`
          : "No grades entered",
      moduleCode: mod.code,
    });
  }

  let progEnteredSum = 0;
  let progEnteredWeight = 0;
  for (const id of PROGRAMMING_TEST_IDS) {
    const mark = grades[id];
    const weight = {
      comp40009_haskell_interim: 5,
      comp40009_haskell_final: 25,
      comp40009_kotlin_interim: 5,
      comp40009_kotlin_final: 35,
      comp40009_c_main_test: 12,
    }[id];
    if (mark != null) {
      progEnteredSum += mark * weight;
      progEnteredWeight += weight;
    }
  }

  const progRemainingWeight = PROGRAMMING_TEST_TOTAL_WEIGHT - progEnteredWeight;
  const progMin = progEnteredSum / PROGRAMMING_TEST_TOTAL_WEIGHT;
  const progMax =
    (progEnteredSum + progRemainingWeight * 100) / PROGRAMMING_TEST_TOTAL_WEIGHT;
  const progCurrent =
    progEnteredWeight > 0 ? progEnteredSum / progEnteredWeight : null;

  requirements.push({
    id: "prog_tests_50",
    label: "COMP40009 programming tests weighted avg ≥ 50%",
    status: getProgressionStatus(progMin, progMax, 50),
    detail:
      progCurrent != null
        ? `Current: ${progCurrent.toFixed(1)}% (min: ${progMin.toFixed(1)}%, max: ${progMax.toFixed(1)}%)`
        : "No grades entered",
    moduleCode: "COMP40009",
  });

  const group = grades["comp40009_c_group_project"];
  const groupMin = group ?? 0;
  const groupMax = group ?? 100;
  requirements.push({
    id: "comp40009_group_project_40",
    label: "COMP40009 C Group Project ≥ 40%",
    status: getProgressionStatus(groupMin, groupMax, 40),
    detail: group != null ? `Current: ${group.toFixed(1)}%` : "No grade entered",
    moduleCode: "COMP40009",
  });

  return requirements;
}
