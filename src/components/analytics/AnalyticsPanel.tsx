"use client";

import { motion } from "motion/react";
import { useAnalyticsData } from "@/components/analytics/AnalyticsProvider";
import { useModuleResults, useYearResult } from "@/hooks/useGradeSelectors";
import { MODULES } from "@/config/modules";
import { AnalyticsModuleRow } from "./AnalyticsModuleRow";
import type { ModuleCode } from "@/lib/types";

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function ComparisonBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const pct = Math.min(Math.max(value, 0), 100);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-text-muted font-[family-name:var(--font-dm-mono)] w-12 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-2 rounded-full bg-bg-tertiary overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs font-[family-name:var(--font-dm-mono)] text-text-primary w-14 text-right shrink-0">
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

export function AnalyticsPanel() {
  const { data: analytics, isLoading } = useAnalyticsData();
  const moduleResults = useModuleResults();
  const yearResult = useYearResult();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
        <p className="text-sm text-text-muted">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics?.yearAverage) {
    return (
      <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
        <p className="text-sm text-text-muted">
          Not enough data yet. Analytics appear once enough students have entered grades.
        </p>
      </div>
    );
  }

  const moduleResultMap = new Map(moduleResults.map((r) => [r.code, r]));
  const classAvg = analytics.yearAverage.average;
  const userAvg = yearResult.average;
  const delta = userAvg != null ? userAvg - classAvg : null;

  const modulesWithAnalytics = MODULES.filter(
    (m) => !m.isPassFail && analytics.modules[m.code],
  );

  return (
    <div
      className="rounded-xl border border-border-primary bg-bg-secondary p-4 space-y-4"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-text-primary">Year Average</h3>
        <ComparisonBar
          label="Class"
          value={classAvg}
          color="var(--color-text-muted)"
        />
        <ComparisonBar
          label="You"
          value={userAvg ?? 0}
          color="var(--color-first)"
        />
        {delta != null && (
          <p className="text-xs font-[family-name:var(--font-dm-mono)] text-right">
            <span
              style={{
                color: delta >= 0 ? "var(--color-first)" : "var(--color-fail)",
              }}
            >
              {delta >= 0 ? "+" : ""}
              {delta.toFixed(1)}
            </span>
            <span className="text-text-muted"> vs class</span>
          </p>
        )}
      </div>

      {modulesWithAnalytics.length > 0 && (
        <div className="space-y-0.5">
          {modulesWithAnalytics.map((m) => {
            const result = moduleResultMap.get(m.code);
            return (
              <AnalyticsModuleRow
                key={m.code}
                module={m}
                moduleAnalytics={analytics.modules[m.code as ModuleCode]!}
                userGrade={result?.currentGrade ?? null}
              />
            );
          })}
        </div>
      )}

      <p className="text-xs text-text-muted font-[family-name:var(--font-dm-mono)]">
        {analytics.yearAverage.studentCount} students · {timeAgo(analytics.generatedAt)}
      </p>
    </div>
  );
}
