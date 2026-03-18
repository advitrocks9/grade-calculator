"use client";

import type { Assessment, ModuleCategory } from "@/lib/types";

type AssessmentSliderProps = {
  assessment: Assessment;
  category: ModuleCategory;
  value: number;
  onChange: (value: number) => void;
};

export function AssessmentSlider({
  assessment,
  category,
  value,
  onChange,
}: AssessmentSliderProps) {
  const trackColor =
    category === "maths" ? "var(--color-maths)" : "var(--color-computing)";

  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-[family-name:var(--font-dm-mono)] text-text-muted">
            {assessment.moduleCode}
          </span>
          <span className="text-text-secondary truncate">
            {assessment.name}
          </span>
          <span className="font-[family-name:var(--font-dm-mono)] text-text-muted">
            ({assessment.weight}%)
          </span>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 sm:w-32"
        style={{
          "--slider-color": trackColor,
          background: `linear-gradient(to right, ${trackColor} ${value}%, var(--color-bg-tertiary) ${value}%)`,
        } as React.CSSProperties}
      />
      <span className="w-8 text-right font-[family-name:var(--font-dm-mono)] text-xs text-text-primary">
        {value}
      </span>
    </div>
  );
}
