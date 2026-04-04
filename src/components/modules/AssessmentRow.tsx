"use client";

import type { Assessment } from "@/lib/types";
import { GradeInput } from "./GradeInput";

type AssessmentRowProps = {
  assessment: Assessment;
};

export function AssessmentRow({ assessment }: AssessmentRowProps) {
  const isZeroWeight = assessment.weight === 0;

  return (
    <div className="flex items-center justify-between gap-3 py-2 rounded-md px-1 -mx-1 hover:bg-bg-hover/50 transition-colors duration-150">
      <div className="flex-1 min-w-0">
        <span className="text-sm text-text-primary truncate block">
          {assessment.name}
        </span>
      </div>
      <span className="shrink-0 text-xs font-mono text-text-muted w-10 text-right">
        {assessment.weight}%
      </span>
      {isZeroWeight ? (
        <span className="w-16 text-right text-xs text-text-muted italic">
          not graded
        </span>
      ) : (
        <GradeInput assessmentId={assessment.id} />
      )}
    </div>
  );
}
