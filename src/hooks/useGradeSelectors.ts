"use client";

import { useMemo } from "react";
import { useGradeStore } from "@/store/useGradeStore";
import { MODULES } from "@/config/modules";
import {
  calculateModuleGrade,
  calculateYearAverage,
  checkProgression,
} from "@/lib/calculations";
import type {
  ModuleResult,
  YearResult,
  ProgressionRequirement,
} from "@/lib/types";

export function useModuleResults(): ModuleResult[] {
  const grades = useGradeStore((s) => s.grades);
  return useMemo(
    () => MODULES.map((m) => calculateModuleGrade(m, grades)),
    [grades],
  );
}

export function useYearResult(): YearResult {
  const moduleResults = useModuleResults();
  return useMemo(() => calculateYearAverage(moduleResults), [moduleResults]);
}

export function useProgressionRequirements(): ProgressionRequirement[] {
  const grades = useGradeStore((s) => s.grades);
  const moduleResults = useModuleResults();
  return useMemo(
    () => checkProgression(moduleResults, grades),
    [moduleResults, grades],
  );
}
