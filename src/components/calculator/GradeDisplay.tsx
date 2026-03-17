"use client";

import { motion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

type GradeDisplayProps = {
  value: number | null;
  size?: "sm" | "md" | "lg";
  showPercent?: boolean;
  className?: string;
};

const classificationColor = (value: number): string => {
  if (value >= 70) return "var(--color-first)";
  if (value >= 60) return "var(--color-two-one)";
  if (value >= 50) return "var(--color-two-two)";
  if (value >= 40) return "var(--color-third)";
  return "var(--color-fail)";
};

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export function GradeDisplay({
  value,
  size = "md",
  showPercent = true,
  className = "",
}: GradeDisplayProps) {
  const spring = useSpring(0, { stiffness: 200, damping: 30 });
  const display = useTransform(spring, (v) => v.toFixed(1));

  useEffect(() => {
    spring.set(value ?? 0);
  }, [value, spring]);

  if (value == null) {
    return (
      <span
        className={`font-[family-name:var(--font-dm-mono)] font-medium text-text-muted ${sizeClasses[size]} ${className}`}
      >
        --
      </span>
    );
  }

  return (
    <span
      className={`font-[family-name:var(--font-dm-mono)] font-medium ${sizeClasses[size]} ${className}`}
      style={{ color: classificationColor(value) }}
    >
      <motion.span>{display}</motion.span>
      {showPercent && <span className="text-[0.6em] ml-0.5">%</span>}
    </span>
  );
}
