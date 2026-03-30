"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import type { Module, ModuleResult } from "@/lib/types";
import { useGradeStore } from "@/store/useGradeStore";
import { useDistributionsData } from "@/components/distributions/DistributionsProvider";
import { GradeDisplay } from "@/components/calculator/GradeDisplay";
import { Badge } from "@/components/shared/Badge";
import { AssessmentRow } from "./AssessmentRow";
import { TargetSolver } from "@/components/calculator/TargetSolver";

type ModuleCardProps = {
  module: Module;
  result: ModuleResult;
};

function useModuleNotes(moduleCode: string) {
  const key = `module-notes-${moduleCode}`;
  const [notes, setNotes] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) setNotes(stored); // eslint-disable-line react-hooks/set-state-in-effect -- sync read from localStorage on mount
  }, [key]);

  const updateNotes = useCallback(
    (value: string) => {
      setNotes(value);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (value) {
          localStorage.setItem(key, value);
        } else {
          localStorage.removeItem(key);
        }
      }, 300);
    },
    [key],
  );

  return [notes, updateNotes] as const;
}

export function ModuleCard({ module, result }: ModuleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useModuleNotes(module.code);
  const grades = useGradeStore((s) => s.grades);
  const setGrade = useGradeStore((s) => s.setGrade);
  const { data: session } = useSession();
  const { data: distributionsData } = useDistributionsData();
  const distributions = distributionsData?.distributions;
  const isLoggedIn = session?.user != null;

  const accentColor =
    module.category === "maths"
      ? "var(--color-maths)"
      : "var(--color-computing)";
  const glowColor =
    module.category === "maths"
      ? "rgba(129, 140, 248, 0.06)"
      : "rgba(52, 211, 153, 0.06)";

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
        className="rounded-lg border border-border-primary bg-bg-secondary overflow-hidden transition-shadow duration-200 hover:border-border-secondary"
        style={{
          borderLeftWidth: 3,
          borderLeftColor: accentColor,
          boxShadow: "var(--shadow-card)",
        }}
        whileHover={{
          boxShadow: `var(--shadow-card-hover), 0 0 20px ${glowColor}`,
        }}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-text-muted">
                  {module.code}
                </span>
                <Badge label={`${module.ects} ECTS`} color={accentColor} />
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
      aria-label={`${module.name}, ${expanded ? "collapse" : "expand"}`}
      className="rounded-lg border border-border-primary bg-bg-secondary overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-secondary transition-[border-color] duration-200 hover:border-border-secondary"
      style={{
        borderLeftWidth: 3,
        borderLeftColor: accentColor,
        boxShadow: "var(--shadow-card)",
      }}
      whileHover={{
        boxShadow: `var(--shadow-card-hover), 0 0 20px ${glowColor}`,
      }}
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
              <span className="font-mono text-xs text-text-muted">
                {module.code}
              </span>
              <Badge label={`${module.ects} ECTS`} color={accentColor} />
            </div>
            <h3 className="text-sm font-medium text-text-primary">
              {module.name}
            </h3>
          </div>
          <div className="shrink-0 flex items-center gap-1.5">
            <div className="text-right">
              <GradeDisplay value={result.currentGrade} size="sm" />
              <div className="text-xs text-text-muted mt-0.5">
                {enteredCount}/{gradableCount}
              </div>
            </div>
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-muted"
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <polyline points="6 9 12 15 18 9" />
            </motion.svg>
          </div>
        </div>

        {result.enteredWeight > 0 && (
          <div className="mt-3 h-1 rounded-full bg-bg-tertiary overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: accentColor }}
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
            <div className="border-t border-border-primary bg-bg-primary/80 px-4 pb-4 pt-3">
              {result.enteredWeight > 0 && (
                <div className="mb-3 space-y-1 text-xs text-text-secondary">
                  <p>
                    Current grade based on{" "}
                    <span className="font-mono">
                      {result.enteredWeight}%
                    </span>{" "}
                    of assessments:{" "}
                    <span className="font-mono text-text-primary">
                      {result.currentGrade?.toFixed(1)}%
                    </span>
                  </p>
                  <p>
                    Range:{" "}
                    <span className="font-mono">
                      {result.minPossible.toFixed(1)}%
                    </span>
                    {" - "}
                    <span className="font-mono">
                      {result.maxPossible.toFixed(1)}%
                    </span>
                  </p>
                </div>
              )}

              <div className="space-y-0.5">
                {module.assessments.map((a) => (
                  <AssessmentRow
                    key={a.id}
                    assessment={a}
                    distribution={distributions?.[a.id]}
                    userGrade={grades[a.id] ?? null}
                    showDistribution={isLoggedIn}
                  />
                ))}
              </div>

              {!module.isPassFail && (
                <TargetSolver module={module} result={result} />
              )}

              <div className="mt-3 border-t border-border-primary pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotes(!showNotes);
                  }}
                  className="text-[10px] text-text-muted hover:text-text-secondary transition-colors tracking-wide uppercase"
                >
                  {showNotes
                    ? "Hide notes"
                    : notes
                      ? "Show notes"
                      : "Add notes"}
                </button>
                {showNotes && (
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    placeholder="Personal notes (stored locally)"
                    className="mt-1.5 w-full resize-none rounded-md border border-border-subtle bg-bg-tertiary px-2.5 py-1.5 text-xs text-text-primary outline-none placeholder:text-text-muted focus:border-border-secondary transition-colors duration-200"
                    rows={3}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
