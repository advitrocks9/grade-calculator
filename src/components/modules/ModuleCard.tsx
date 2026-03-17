"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Module, ModuleResult } from "@/lib/types";
import { useGradeStore } from "@/store/useGradeStore";
import { GradeDisplay } from "@/components/calculator/GradeDisplay";
import { Badge } from "@/components/shared/Badge";
import { AssessmentRow } from "./AssessmentRow";
import { TargetSolver } from "@/components/calculator/TargetSolver";

type ModuleCardProps = {
  module: Module;
  result: ModuleResult;
};

export function ModuleCard({ module, result }: ModuleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const grades = useGradeStore((s) => s.grades);
  const setGrade = useGradeStore((s) => s.setGrade);

  const borderColor =
    module.category === "maths" ? "var(--color-maths)" : "var(--color-computing)";
  const categoryColor =
    module.category === "maths" ? "var(--color-maths)" : "var(--color-computing)";

  const enteredCount = module.assessments.filter(
    (a) => a.weight > 0 && grades[a.id] != null,
  ).length;
  const gradableCount = module.assessments.filter((a) => a.weight > 0).length;

  if (module.isPassFail) {
    const passValue = grades[module.assessments[0].id];
    const isPassed = passValue != null && passValue > 0;

    return (
      <motion.div
        id={`module-${module.code}`}
        layout
        className="rounded-xl border border-border-primary bg-bg-secondary overflow-hidden"
        style={{ borderLeftWidth: 3, borderLeftColor: borderColor }}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-[family-name:var(--font-dm-mono)] text-xs text-text-muted">
                  {module.code}
                </span>
                <Badge label={`${module.ects} ECTS`} color={categoryColor} />
                <Badge
                  label="Pass/Fail"
                  className="bg-bg-tertiary text-text-muted"
                />
              </div>
              <h3 className="text-sm font-medium text-text-primary">
                {module.name}
              </h3>
            </div>
            <button
              onClick={() => {
                const newVal = isPassed ? null : 100;
                setGrade(module.assessments[0].id, newVal);
              }}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                isPassed
                  ? "bg-first/20 text-first"
                  : "bg-bg-tertiary text-text-muted hover:text-text-secondary"
              }`}
            >
              {isPassed ? "Passed" : "Not yet"}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      id={`module-${module.code}`}
      layout
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      className="rounded-xl border border-border-primary bg-bg-secondary overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-secondary"
      style={{ borderLeftWidth: 3, borderLeftColor: borderColor }}
      onClick={() => setExpanded(!expanded)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setExpanded(!expanded);
        }
      }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-[family-name:var(--font-dm-mono)] text-xs text-text-muted">
                {module.code}
              </span>
              <Badge label={`${module.ects} ECTS`} color={categoryColor} />
            </div>
            <h3 className="text-sm font-medium text-text-primary">
              {module.name}
            </h3>
          </div>
          <div className="shrink-0 text-right">
            <GradeDisplay value={result.currentGrade} size="sm" />
            <div className="text-xs text-text-muted mt-0.5">
              {enteredCount}/{gradableCount}
            </div>
          </div>
        </div>

        {result.enteredWeight > 0 && (
          <div className="mt-3 h-1 rounded-full bg-bg-tertiary overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: borderColor }}
              initial={{ width: 0 }}
              animate={{
                width: `${(result.enteredWeight / result.totalWeight) * 100}%`,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-t border-border-primary px-4 pb-4 pt-3">
              {result.enteredWeight > 0 && (
                <div className="mb-3 space-y-1 text-xs text-text-secondary">
                  <p>
                    Current grade based on{" "}
                    <span className="font-[family-name:var(--font-dm-mono)]">
                      {result.enteredWeight}%
                    </span>{" "}
                    of assessments:{" "}
                    <span className="font-[family-name:var(--font-dm-mono)] text-text-primary">
                      {result.currentGrade?.toFixed(1)}%
                    </span>
                  </p>
                  <p>
                    Range:{" "}
                    <span className="font-[family-name:var(--font-dm-mono)]">
                      {result.minPossible.toFixed(1)}%
                    </span>
                    {" – "}
                    <span className="font-[family-name:var(--font-dm-mono)]">
                      {result.maxPossible.toFixed(1)}%
                    </span>
                  </p>
                </div>
              )}

              <div className="space-y-0.5">
                {module.assessments.map((a) => (
                  <AssessmentRow key={a.id} assessment={a} />
                ))}
              </div>

              {!module.isPassFail && (
                <TargetSolver module={module} result={result} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
