"use client";

import { motion } from "motion/react";

type ProgressBarProps = {
  value: number;
  max?: number;
  color?: string;
  className?: string;
};

export function ProgressBar({
  value,
  max = 100,
  color = "var(--color-text-muted)",
  className = "",
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={`h-1 w-full overflow-hidden rounded-full bg-bg-tertiary ${className}`}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </div>
  );
}
