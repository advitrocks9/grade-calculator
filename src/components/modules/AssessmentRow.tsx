"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Assessment } from "@/lib/types";
import type { AssessmentDistribution } from "@/lib/distribution-types";
import { GradeInput } from "./GradeInput";
import { AssessmentDistributionPanel } from "@/components/distributions/AssessmentDistributionPanel";

type AssessmentRowProps = {
  assessment: Assessment;
  distribution?: AssessmentDistribution;
  userGrade?: number | null;
  showDistribution?: boolean;
};

export function AssessmentRow({
  assessment,
  distribution,
  userGrade,
  showDistribution = false,
}: AssessmentRowProps) {
  const [distOpen, setDistOpen] = useState(false);
  const isZeroWeight = assessment.weight === 0;
  const hasDistribution = showDistribution && distribution;

  return (
    <div>
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
        {hasDistribution && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDistOpen(!distOpen);
            }}
            className="shrink-0 p-1 rounded text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
            title="Grade distribution"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="12" width="4" height="9" rx="1" />
              <rect x="10" y="7" width="4" height="14" rx="1" />
              <rect x="17" y="3" width="4" height="18" rx="1" />
            </svg>
          </button>
        )}
      </div>

      <AnimatePresence>
        {distOpen && hasDistribution && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-2">
              <AssessmentDistributionPanel
                distribution={distribution}
                userGrade={userGrade ?? null}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
