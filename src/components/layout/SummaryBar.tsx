"use client";

import { useYearResult } from "@/hooks/useGradeSelectors";
import { useGradeStore } from "@/store/useGradeStore";
import { MODULES } from "@/config/modules";
import { GradeDisplay } from "@/components/calculator/GradeDisplay";
import { Badge } from "@/components/shared/Badge";
import { ProgressBar } from "@/components/calculator/ProgressBar";
import { CLASSIFICATION_COLORS } from "@/lib/ui";
import { getUnenteredAssessments } from "@/lib/helpers";

export function SummaryBar() {
  const yearResult = useYearResult();
  const grades = useGradeStore((s) => s.grades);

  const totalAssessments = MODULES.flatMap((m) => m.assessments).filter(
    (a) => a.weight > 0,
  ).length;
  const enteredAssessments =
    totalAssessments - getUnenteredAssessments(grades).length;

  return (
    <div className="sticky top-14 z-40 border-b border-border-primary bg-bg-primary/90 backdrop-blur-md">
      <div className="mx-auto max-w-4xl px-4 py-3 space-y-2">
        <div className="flex items-end gap-3" aria-live="polite">
          <div>
            <p className="text-xs text-text-muted mb-0.5">Year Average</p>
            <GradeDisplay value={yearResult.average} size="lg" />
          </div>
          {yearResult.classification && (
            <Badge
              label={yearResult.classification}
              color={CLASSIFICATION_COLORS[yearResult.classification]}
              className="mb-3"
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-1">
            <span className="text-[10px] text-text-muted uppercase tracking-wider">Completed</span>
            <ProgressBar
            value={enteredAssessments}
            max={totalAssessments}
              className="w-full"
            />
          </div>
          <span className="text-xs text-text-muted whitespace-nowrap">
            <span className="font-mono">
              {enteredAssessments}/{totalAssessments}
            </span>{" "}
            assessments
          </span>
        </div>

        {yearResult.average != null && (
          <p className="text-xs text-text-secondary font-mono">
            Range: {yearResult.minPossible.toFixed(1)}% -{" "}
            {yearResult.maxPossible.toFixed(1)}%
          </p>
        )}
      </div>
    </div>
  );
}
