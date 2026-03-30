"use client";

import { useState, useMemo, useCallback } from "react";
import { MODULES } from "@/config/modules";
import { useGradeStore } from "@/store/useGradeStore";
import { calculateModuleGrade, calculateYearAverage } from "@/lib/calculations";
import type { GradeMap } from "@/lib/types";
import { GradeDisplay } from "@/components/calculator/GradeDisplay";
import { Badge } from "@/components/shared/Badge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { AssessmentSlider } from "./AssessmentSlider";
import { CLASSIFICATION_COLORS } from "@/lib/ui";
import { getUnenteredAssessments } from "@/lib/helpers";

type ScenarioSimulatorProps = {
  onClose: () => void;
};

export function ScenarioSimulator({ onClose }: ScenarioSimulatorProps) {
  const grades = useGradeStore((s) => s.grades);
  const setBatchGrades = useGradeStore((s) => s.setBatchGrades);

  const unenteredAssessments = useMemo(
    () =>
      getUnenteredAssessments(grades).map((a) => ({
        assessment: a,
        category: MODULES.find((m) => m.code === a.moduleCode)!.category,
      })),
    [grades],
  );

  const [showConfirm, setShowConfirm] = useState(false);

  const [simGrades, setSimGrades] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const { assessment } of unenteredAssessments) {
      initial[assessment.id] = 50;
    }
    return initial;
  });

  const setSimGrade = useCallback((id: string, value: number) => {
    setSimGrades((prev) => ({ ...prev, [id]: value }));
  }, []);

  const combinedGrades: GradeMap = useMemo(
    () => ({ ...grades, ...simGrades }),
    [grades, simGrades],
  );

  const simResults = useMemo(
    () => MODULES.map((m) => calculateModuleGrade(m, combinedGrades)),
    [combinedGrades],
  );

  const simYear = useMemo(() => calculateYearAverage(simResults), [simResults]);

  const applyPreset = (value: number) => {
    const next: Record<string, number> = {};
    for (const { assessment } of unenteredAssessments) {
      next[assessment.id] = value;
    }
    setSimGrades(next);
  };

  const handleSave = () => {
    const toSave: GradeMap = {};
    for (const [id, mark] of Object.entries(simGrades)) {
      toSave[id] = mark;
    }
    setBatchGrades(toSave);
    onClose();
  };

  if (unenteredAssessments.length === 0) {
    return (
      <div className="rounded-xl border border-border-primary bg-bg-secondary p-6 text-center">
        <p className="text-sm text-text-secondary">
          All assessments have been entered. Nothing to simulate.
        </p>
        <button
          onClick={onClose}
          className="mt-3 rounded-md bg-bg-tertiary px-4 py-2 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border-primary bg-bg-secondary overflow-hidden">
      <div className="flex items-center justify-between border-b border-border-primary px-4 py-3">
        <h2 className="text-sm font-semibold text-text-primary">
          What-If Simulator
        </h2>
        <button
          onClick={onClose}
          className="text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          Close
        </button>
      </div>

      <div className="border-b border-border-primary px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-text-muted mb-0.5">
                Simulated Average
              </p>
              <GradeDisplay value={simYear.average} size="md" />
            </div>
            {simYear.classification && (
              <Badge
                label={simYear.classification}
                color={CLASSIFICATION_COLORS[simYear.classification]}
                className="mt-3"
              />
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => applyPreset(60)}
              className="rounded-md bg-bg-tertiary px-2 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              All 60%
            </button>
            <button
              onClick={() => applyPreset(70)}
              className="rounded-md bg-bg-tertiary px-2 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              All 70%
            </button>
            <button
              onClick={() => applyPreset(0)}
              className="rounded-md bg-bg-tertiary px-2 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              Reset to 0
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto px-4 py-2">
        {unenteredAssessments.map(({ assessment, category }) => (
          <AssessmentSlider
            key={assessment.id}
            assessment={assessment}
            category={category}
            value={simGrades[assessment.id] ?? 50}
            onChange={(v) => setSimGrade(assessment.id, v)}
          />
        ))}
      </div>

      <div className="border-t border-border-primary px-4 py-3">
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full rounded-md bg-text-primary py-2 text-xs font-medium text-bg-primary transition-colors hover:bg-text-secondary"
        >
          Save as my grades
        </button>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Overwrite grades?"
        message="This will overwrite your real grades with simulated values. Continue?"
        confirmLabel="Overwrite"
        onConfirm={() => {
          setShowConfirm(false);
          handleSave();
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
