"use client";

import { useState } from "react";
import type { Module, ModuleResult } from "@/lib/types";
import { solveForTarget } from "@/lib/calculations";
import { useGradeStore } from "@/store/useGradeStore";

type TargetSolverProps = {
  module: Module;
  result: ModuleResult;
};

const PRESETS = [
  { label: "First", target: 70 },
  { label: "2:1", target: 60 },
  { label: "2:2", target: 50 },
  { label: "Pass", target: 40 },
];

export function TargetSolver({ module, result }: TargetSolverProps) {
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [customTarget, setCustomTarget] = useState("");
  const grades = useGradeStore((s) => s.grades);

  const enteredSum = module.assessments.reduce((sum, a) => {
    const mark = grades[a.id];
    if (mark != null && a.weight > 0) return sum + mark * a.weight;
    return sum;
  }, 0);

  const target =
    selectedTarget ?? (customTarget ? parseFloat(customTarget) : null);

  const requiredMark =
    target != null
      ? solveForTarget(
          target,
          enteredSum,
          result.enteredWeight,
          result.totalWeight,
        )
      : undefined;

  const remainingAssessments = module.assessments.filter(
    (a) => a.weight > 0 && grades[a.id] == null,
  );

  if (result.enteredWeight === result.totalWeight) return null;

  return (
    <div className="mt-4 border-t border-border-primary pt-3">
      <p className="text-xs font-medium text-text-secondary mb-2">
        What do I need?
      </p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            aria-label={`Target ${p.label} (${p.target}%)`}
            onClick={() => {
              setSelectedTarget(selectedTarget === p.target ? null : p.target);
              setCustomTarget("");
            }}
            className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedTarget === p.target
                ? "bg-text-primary text-bg-primary"
                : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
            }`}
          >
            {p.label} {p.target}
          </button>
        ))}
        <input
          type="number"
          placeholder="Custom"
          value={customTarget}
          onChange={(e) => {
            setCustomTarget(e.target.value);
            setSelectedTarget(null);
          }}
          className="w-16 rounded-md border border-border-subtle bg-bg-tertiary px-2 py-1 text-xs font-mono text-text-primary outline-none placeholder:text-text-muted
            [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>

      {target != null && requiredMark !== undefined && (
        <div className="text-xs">
          {requiredMark === null ? (
            <p className="text-red font-medium">
              Not achievable. Would need over 100% on remaining assessments (max
              possible: {result.maxPossible.toFixed(1)}%)
            </p>
          ) : requiredMark === 0 ? (
            <p className="text-first font-medium">
              Already secured - even 0% gives you ≥{target}%
            </p>
          ) : (
            <p className="text-text-secondary">
              You need{" "}
              <span className="font-mono text-text-primary font-medium">
                ≥{requiredMark.toFixed(1)}%
              </span>{" "}
              average on remaining{" "}
              {remainingAssessments.length === 1
                ? remainingAssessments[0].name
                : `${remainingAssessments.length} assessments`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
