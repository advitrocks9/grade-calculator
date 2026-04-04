"use client";

import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useAnalyticsData } from "@/components/analytics/AnalyticsProvider";
import { useDistributionsData } from "@/components/distributions/DistributionsProvider";
import { useModuleResults, useYearResult } from "@/hooks/useGradeSelectors";
import { useGradeStore } from "@/store/useGradeStore";
import { MODULES } from "@/config/modules";
import { AnalyticsModuleRow } from "./AnalyticsModuleRow";
import { SkeletonGroup } from "@/components/shared/SkeletonBar";
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
      <span className="text-xs text-text-muted font-mono w-12 shrink-0">
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
      <span className="text-xs font-mono text-text-primary w-14 text-right shrink-0">
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

export function AnalyticsPanel() {
  const { data: session } = useSession();
  const { data: analytics, isLoading } = useAnalyticsData();
  const { data: distributionsData } = useDistributionsData();
  const moduleResults = useModuleResults();
  const yearResult = useYearResult();
  const grades = useGradeStore((s) => s.grades);
  const isLoggedIn = session?.user != null;

  if (!isLoggedIn) {
    return (
      <div className="rounded-xl border border-border-primary bg-bg-secondary p-6 text-center">
        <p className="text-sm text-text-secondary mb-2">
          Sign in with your Imperial account to see class analytics and grade
          distributions.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-md bg-bg-tertiary px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <SkeletonGroup />;
  }

  if (!analytics?.yearAverage) {
    return (
      <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
        <p className="text-sm text-text-muted">
          Not enough data yet. Analytics appear once enough students have
          entered grades.
        </p>
      </div>
    );
  }

  const moduleResultMap = new Map(moduleResults.map((r) => [r.code, r]));
  const classAvg = analytics.yearAverage.average;
  const userAvg = yearResult.average;
  const delta = userAvg != null ? userAvg - classAvg : null;
  const distributions = distributionsData?.distributions ?? {};

  const modulesWithAnalytics = MODULES.filter(
    (m) => !m.isPassFail && analytics.modules[m.code],
  );

  return (
    <div className="space-y-3">
      <div
        className="rounded-xl border border-border-primary bg-bg-secondary p-4 space-y-2"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <ComparisonBar
          label="Class"
          value={classAvg}
          color="rgba(129, 140, 248, 0.35)"
        />
        <ComparisonBar
          label="You"
          value={userAvg ?? 0}
          color="rgba(129, 140, 248, 0.85)"
        />
        {delta != null && (
          <p className="text-xs font-mono text-right">
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
        <p className="text-xs text-text-muted font-mono pt-1">
          {analytics.yearAverage.studentCount} students &middot;{" "}
          {timeAgo(analytics.generatedAt)}
        </p>
      </div>

      {modulesWithAnalytics.length > 0 && (
        <div className="space-y-2">
          {modulesWithAnalytics.map((m) => {
            const result = moduleResultMap.get(m.code);
            const assessmentGrades: Record<string, number | null> = {};
            for (const a of m.assessments) {
              assessmentGrades[a.id] = grades[a.id] ?? null;
            }

            return (
              <AnalyticsModuleRow
                key={m.code}
                module={m}
                moduleAnalytics={analytics.modules[m.code as ModuleCode]!}
                assessmentAnalytics={analytics.assessments}
                distributions={distributions}
                userGrade={result?.currentGrade ?? null}
                assessmentGrades={assessmentGrades}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
