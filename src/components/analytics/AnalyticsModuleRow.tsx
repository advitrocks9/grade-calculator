"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Module } from "@/lib/types";
import type { AggregateStats } from "@/lib/analytics-types";
import type { AssessmentDistribution } from "@/lib/distribution-types";
import { DistributionChart } from "@/components/distributions/DistributionChart";

type AnalyticsModuleRowProps = {
  module: Module;
  moduleAnalytics: AggregateStats;
  assessmentAnalytics: Record<string, AggregateStats>;
  distributions: Record<string, AssessmentDistribution>;
  userGrade: number | null;
  assessmentGrades: Record<string, number | null>;
};

function AssessmentStat({
  name,
  classAvg,
  userMark,
  distribution,
}: {
  name: string;
  classAvg: number;
  userMark: number | null;
  distribution?: AssessmentDistribution;
}) {
  const [chartOpen, setChartOpen] = useState(false);
  const delta = userMark != null ? userMark - classAvg : null;

  return (
    <div>
      <div
        className={`flex items-center gap-3 py-1.5 px-2 rounded-md transition-colors ${distribution ? "hover:bg-bg-hover/50 cursor-pointer" : ""}`}
        onClick={() => distribution && setChartOpen(!chartOpen)}
      >
        <span className="flex-1 min-w-0 text-xs text-text-secondary truncate">
          {name}
        </span>
        <span className="shrink-0 text-xs font-mono text-text-muted w-14 text-right">
          {classAvg.toFixed(1)}%
        </span>
        <span className="shrink-0 text-xs font-mono text-text-primary w-14 text-right">
          {userMark != null ? `${userMark.toFixed(1)}%` : "-"}
        </span>
        {delta != null ? (
          <span
            className="shrink-0 text-xs font-mono w-12 text-right"
            style={{
              color: delta >= 0 ? "var(--color-first)" : "var(--color-fail)",
            }}
          >
            {delta >= 0 ? "+" : ""}
            {delta.toFixed(1)}
          </span>
        ) : (
          <span className="shrink-0 w-12" />
        )}
        {distribution && (
          <motion.svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-text-muted"
            animate={{ rotate: chartOpen ? 180 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        )}
      </div>

      <AnimatePresence>
        {chartOpen && distribution && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2 pt-1">
              <DistributionChart
                buckets={distribution.buckets}
                userGrade={userMark ?? null}
                totalCount={distribution.totalCount}
              />
              <div className="flex gap-4 text-xs font-mono text-text-muted mt-1">
                <span>Mean {distribution.mean.toFixed(1)}%</span>
                <span>Median {distribution.median.toFixed(1)}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AnalyticsModuleRow({
  module,
  moduleAnalytics,
  assessmentAnalytics,
  distributions,
  userGrade,
  assessmentGrades,
}: AnalyticsModuleRowProps) {
  const [expanded, setExpanded] = useState(false);
  const delta = userGrade != null ? userGrade - moduleAnalytics.average : null;
  const accentColor =
    module.category === "maths"
      ? "var(--color-maths)"
      : "var(--color-computing)";

  const gradedAssessments = module.assessments.filter(
    (a) => a.weight > 0 && assessmentAnalytics[a.id],
  );

  return (
    <div
      className="rounded-lg border border-border-primary bg-bg-primary/50 overflow-hidden"
      style={{ borderLeftWidth: 2, borderLeftColor: accentColor }}
    >
      <button
        className="w-full flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-bg-tertiary cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm text-text-primary truncate">
            {module.code}{" "}
            <span className="text-text-secondary">{module.name}</span>
          </p>
        </div>
        <span className="shrink-0 text-xs text-text-muted font-mono">
          {moduleAnalytics.average.toFixed(1)}%
        </span>
        <span className="shrink-0 text-xs font-mono text-text-primary">
          {userGrade != null ? `${userGrade.toFixed(1)}%` : "-"}
        </span>
        {delta != null && (
          <span
            className="shrink-0 text-xs font-mono"
            style={{
              color: delta >= 0 ? "var(--color-first)" : "var(--color-fail)",
            }}
          >
            {delta >= 0 ? "+" : ""}
            {delta.toFixed(1)}
          </span>
        )}
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-text-muted"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {expanded && gradedAssessments.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border-primary px-2 py-1.5">
              <div className="flex items-center gap-3 px-2 py-1 text-[10px] uppercase tracking-wider text-text-muted">
                <span className="flex-1">Assessment</span>
                <span className="w-14 text-right">Class</span>
                <span className="w-14 text-right">You</span>
                <span className="w-12 text-right">+/-</span>
                <span className="w-3" />
              </div>
              {gradedAssessments.map((a) => (
                <AssessmentStat
                  key={a.id}
                  name={a.name}
                  classAvg={assessmentAnalytics[a.id].average}
                  userMark={assessmentGrades[a.id] ?? null}
                  distribution={distributions[a.id]}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
