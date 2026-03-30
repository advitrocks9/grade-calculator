"use client";

import { motion } from "motion/react";
import type { DistributionBucket } from "@/lib/distribution-types";

type DistributionChartProps = {
  buckets: DistributionBucket[];
  userGrade: number | null;
  totalCount: number;
};

const BUCKET_LABELS = [
  "0-10",
  "10-20",
  "20-30",
  "30-40",
  "40-50",
  "50-60",
  "60-70",
  "70-80",
  "80-90",
  "90-100",
];

function getBucketColor(lower: number): string {
  if (lower < 40) return "var(--color-fail)";
  if (lower < 50) return "var(--color-third)";
  if (lower < 60) return "var(--color-two-two)";
  if (lower < 70) return "var(--color-two-one)";
  return "var(--color-first)";
}

function getBucketCount(buckets: DistributionBucket[], lower: number): number {
  return buckets.find((b) => b.lower === lower)?.count ?? 0;
}

export function DistributionChart({
  buckets,
  userGrade,
  totalCount,
}: DistributionChartProps) {
  const maxCount = Math.max(...buckets.map((b) => b.count), 1);
  const userBucketLower =
    userGrade != null ? Math.min(Math.floor(userGrade / 10) * 10, 90) : null;

  return (
    <div className="space-y-1">
      {BUCKET_LABELS.map((label, i) => {
        const lower = i * 10;
        const count = getBucketCount(buckets, lower);
        const widthPct = (count / maxCount) * 100;
        const isUserBucket = userBucketLower === lower;
        const color = getBucketColor(lower);

        return (
          <div key={label} className="flex items-center gap-2">
            <span className="text-xs font-[family-name:var(--font-dm-mono)] text-text-muted w-12 text-right shrink-0">
              {label}
            </span>
            <div className="flex-1 h-5 rounded bg-bg-tertiary overflow-hidden relative">
              <motion.div
                className="h-full rounded"
                style={{
                  backgroundColor: color,
                  opacity: isUserBucket ? 1 : 0.6,
                  border: isUserBucket
                    ? "1.5px solid var(--color-text-primary)"
                    : "none",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.03,
                  ease: "easeOut",
                }}
              />
              {isUserBucket && (
                <div className="absolute inset-y-0 right-1 flex items-center">
                  <span className="text-[10px] font-medium text-text-primary">
                    You
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs font-[family-name:var(--font-dm-mono)] text-text-muted w-6 text-right shrink-0">
              {count}
            </span>
          </div>
        );
      })}
      <p className="text-xs text-text-muted text-right pt-1">
        {totalCount} student{totalCount !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
