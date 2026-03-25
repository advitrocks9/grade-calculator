"use client";

import type { Module } from "@/lib/types";
import type { AggregateStats } from "@/lib/analytics-types";

type AnalyticsModuleRowProps = {
  module: Module;
  moduleAnalytics: AggregateStats;
  userGrade: number | null;
};

export function AnalyticsModuleRow({
  module,
  moduleAnalytics,
  userGrade,
}: AnalyticsModuleRowProps) {
  const delta = userGrade != null ? userGrade - moduleAnalytics.average : null;
  const accentColor =
    module.category === "maths" ? "var(--color-maths)" : "var(--color-computing)";

  return (
    <div
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-bg-tertiary"
      style={{ borderLeft: `3px solid ${accentColor}` }}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm text-text-primary truncate">
          {module.code} {module.name}
        </p>
      </div>
      <span className="shrink-0 text-xs text-text-muted font-[family-name:var(--font-dm-mono)]">
        Avg {moduleAnalytics.average.toFixed(1)}%
      </span>
      <span className="shrink-0 text-xs font-[family-name:var(--font-dm-mono)] text-text-primary">
        {userGrade != null ? `${userGrade.toFixed(1)}%` : "–"}
      </span>
      {delta != null && (
        <span
          className="shrink-0 text-xs font-[family-name:var(--font-dm-mono)]"
          style={{
            color: delta >= 0 ? "var(--color-first)" : "var(--color-fail)",
          }}
        >
          {delta >= 0 ? "+" : ""}
          {delta.toFixed(1)}
        </span>
      )}
    </div>
  );
}
