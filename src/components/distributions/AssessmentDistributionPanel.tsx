"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { AssessmentDistribution } from "@/lib/distribution-types";
import { DistributionChart } from "./DistributionChart";

type AssessmentDistributionPanelProps = {
  distribution: AssessmentDistribution | undefined;
  userGrade: number | null;
};

export function AssessmentDistributionPanel({
  distribution,
  userGrade,
}: AssessmentDistributionPanelProps) {
  const [expanded, setExpanded] = useState(true);

  if (!distribution || distribution.totalCount < 3) {
    return (
      <div className="py-2 px-3 rounded-md bg-bg-tertiary">
        <p className="text-xs text-text-muted">
          Waiting for more submissions before distribution data is available.
        </p>
      </div>
    );
  }

  const delta = userGrade != null ? userGrade - distribution.mean : null;
  const limitedData = distribution.totalCount < 10;

  return (
    <div className="rounded-md border border-border-subtle bg-bg-primary overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-3 py-2 text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="font-medium uppercase tracking-wider">
          Grade Distribution
        </span>
        <motion.svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2">
              {limitedData && (
                <p className="text-xs text-text-muted italic">
                  Based on limited data ({distribution.totalCount} students)
                </p>
              )}

              <DistributionChart
                buckets={distribution.buckets}
                userGrade={userGrade}
                totalCount={distribution.totalCount}
              />

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-text-secondary">
                <span>Mean: {distribution.mean.toFixed(1)}%</span>
                <span>Median: {distribution.median.toFixed(1)}%</span>
                {userGrade != null && delta != null && (
                  <span>
                    Your grade: {userGrade.toFixed(1)}%{" "}
                    <span
                      style={{
                        color:
                          delta >= 0
                            ? "var(--color-first)"
                            : "var(--color-fail)",
                      }}
                    >
                      ({delta >= 0 ? "+" : ""}
                      {delta.toFixed(1)} vs mean)
                    </span>
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
