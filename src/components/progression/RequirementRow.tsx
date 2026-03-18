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

export function RequirementRow({ requirement, onNavigate }: RequirementRowProps) {
  const isClickable =
    requirement.moduleCode && requirement.status !== "green";

  return (
    <button
      onClick={() => {
        if (isClickable && requirement.moduleCode) {
          onNavigate?.(requirement.moduleCode);
        }
      }}
      disabled={!isClickable}
      className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
        isClickable
          ? "hover:bg-bg-tertiary cursor-pointer"
          : "cursor-default"
      }`}
    >
      <span
        className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${statusColors[requirement.status]} ${
          requirement.status !== "green"
            ? "animate-[pulse-dot_2s_ease-in-out_infinite]"
            : ""
        }`}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-text-primary">{requirement.label}</p>
        <p className="text-xs text-text-muted mt-0.5">{requirement.detail}</p>
      </div>
    </button>
  );
}
