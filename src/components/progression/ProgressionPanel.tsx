"use client";

import { useProgressionRequirements } from "@/hooks/useGradeSelectors";
import { RequirementRow } from "./RequirementRow";

export function ProgressionPanel() {
  const requirements = useProgressionRequirements();

  const handleNavigate = (moduleCode: string) => {
    const el = document.getElementById(`module-${moduleCode}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
      <div className="h-px bg-gradient-to-r from-transparent via-first/15 to-transparent mb-1" />
      <h2 className="text-sm font-semibold text-text-primary mb-4">
        Progression Requirements
      </h2>
      <div className="space-y-0.5">
        {requirements.map((req) => (
          <RequirementRow
            key={req.id}
            requirement={req}
            onNavigate={handleNavigate}
          />
        ))}
      </div>
    </div>
  );
}
