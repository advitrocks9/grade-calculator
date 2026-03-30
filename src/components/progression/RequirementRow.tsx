"use client";

import type { ProgressionRequirement } from "@/lib/types";

type RequirementRowProps = {
  requirement: ProgressionRequirement;
  onNavigate?: (moduleCode: string) => void;
};

const statusColors = {
  green: "bg-green",
  amber: "bg-amber",
  red: "bg-red",
};

const statusLabels = {
  green: "Passed",
  amber: "At risk",
  red: "Not met",
};

export function RequirementRow({
  requirement,
  onNavigate,
}: RequirementRowProps) {
  const isClickable = requirement.moduleCode && requirement.status !== "green";

  return (
    <button
      onClick={() => {
        if (isClickable && requirement.moduleCode) {
          onNavigate?.(requirement.moduleCode);
        }
      }}
      disabled={!isClickable}
      className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
        isClickable ? "hover:bg-bg-tertiary cursor-pointer" : "cursor-default"
      }`}
    >
      <div className="flex items-center gap-1.5 shrink-0 mt-1">
        <span
          className={`h-2 w-2 rounded-full ${statusColors[requirement.status]} ${
            requirement.status !== "green"
              ? "animate-[pulse-dot_2s_ease-in-out_infinite] will-change-auto"
              : ""
          }`}
        />
        <span className="text-[10px] text-text-muted">
          {statusLabels[requirement.status]}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-text-primary">{requirement.label}</p>
        <p className="text-xs text-text-muted mt-0.5">{requirement.detail}</p>
      </div>
    </button>
  );
}
