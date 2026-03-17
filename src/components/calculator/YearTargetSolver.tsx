"use client";

import { useState } from "react";
import { solveForYearTarget } from "@/lib/calculations";
import { useGradeStore } from "@/store/useGradeStore";
import { useYearResult } from "@/hooks/useGradeSelectors";

const PRESETS = [
  { label: "First", target: 70 },
  { label: "2:1", target: 60 },
  { label: "2:2", target: 50 },
  { label: "Pass", target: 40 },
];

export function YearTargetSolver() {
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [customTarget, setCustomTarget] = useState("");
  const grades = useGradeStore((s) => s.grades);
  const yearResult = useYearResult();

  const target = selectedTarget ?? (customTarget ? parseFloat(customTarget) : null);

  const requiredMark =
    target != null ? solveForYearTarget(target, grades) : undefined;

  return (
    <div className="mt-3 border-t border-border-primary pt-3">
      <p className="text-xs font-medium text-text-secondary mb-2">
        What do I need across all remaining assessments?
      </p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setSelectedTarget(selectedTarget === p.target ? null : p.target);
              setCustomTarget("");
            }}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
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
          className="w-16 rounded-md border border-border-primary bg-bg-tertiary px-2 py-1 text-xs font-[family-name:var(--font-dm-mono)] text-text-primary outline-none placeholder:text-text-muted
            [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>

      {target != null && requiredMark !== undefined && (
        <div className="text-xs">
          {requiredMark === null ? (
            <p className="text-red line-through">
              Not achievable — maximum possible is {yearResult.maxPossible.toFixed(1)}%
            </p>
          ) : requiredMark === 0 ? (
            <p className="text-first">
              Already secured — even with 0% you&apos;ll get ≥{target}%
            </p>
          ) : (
            <p className="text-text-secondary">
              You need{" "}
              <span className="font-[family-name:var(--font-dm-mono)] text-text-primary font-medium">
                ≥{requiredMark.toFixed(1)}%
              </span>{" "}
              average on all remaining assessments
            </p>
          )}
        </div>
      )}
    </div>
  );
}
