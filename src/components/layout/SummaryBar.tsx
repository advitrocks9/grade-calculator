"use client";

import { useState } from "react";
import { useYearResult } from "@/hooks/useGradeSelectors";
import { useGradeStore } from "@/store/useGradeStore";
import { MODULES } from "@/config/modules";
import { GradeDisplay } from "@/components/calculator/GradeDisplay";
import { Badge } from "@/components/shared/Badge";
import { ProgressBar } from "@/components/calculator/ProgressBar";
import { YearTargetSolver } from "@/components/calculator/YearTargetSolver";
import { CLASSIFICATION_COLORS } from "@/lib/ui";

export function SummaryBar() {
  const yearResult = useYearResult();
  const grades = useGradeStore((s) => s.grades);
  const [showTargetSolver, setShowTargetSolver] = useState(false);

  const totalAssessments = MODULES.flatMap((m) => m.assessments).filter(
    (a) => a.weight > 0,
  ).length;
  const enteredAssessments = MODULES.flatMap((m) => m.assessments).filter(
    (a) => a.weight > 0 && grades[a.id] != null,
  ).length;

  const hasRemaining = enteredAssessments < totalAssessments;

  return (
    <div className="sticky top-14 z-40 border-b border-border-primary bg-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto max-w-3xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-text-muted mb-0.5">Year Average</p>
              <GradeDisplay value={yearResult.average} size="lg" />
            </div>
            {yearResult.classification && (
              <Badge
                label={yearResult.classification}
                color={CLASSIFICATION_COLORS[yearResult.classification]}
                className="mt-4"
              />
            )}
          </div>

          <div className="text-right text-xs text-text-muted space-y-1">
            <p>
              <span className="font-[family-name:var(--font-dm-mono)]">
                {enteredAssessments}/{totalAssessments}
              </span>{" "}
              assessments
            </p>
            {yearResult.average != null && (
              <p className="font-[family-name:var(--font-dm-mono)]">
                {yearResult.minPossible.toFixed(1)}% – {yearResult.maxPossible.toFixed(1)}%
              </p>
            )}
          </div>
        </div>
        <ProgressBar
          value={enteredAssessments}
          max={totalAssessments}
          className="mt-2"
        />
        {hasRemaining && (
          <button
            onClick={() => setShowTargetSolver((prev) => !prev)}
            className="mt-2 text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            {showTargetSolver ? "Hide" : "What do I need?"}
          </button>
        )}
        {showTargetSolver && hasRemaining && <YearTargetSolver />}
      </div>
    </div>
  );
}
