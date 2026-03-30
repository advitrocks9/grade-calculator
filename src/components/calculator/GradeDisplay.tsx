"use client";

import { motion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";
import { getClassification } from "@/lib/calculations";
import { CLASSIFICATION_COLORS } from "@/lib/ui";

type GradeDisplayProps = {
  value: number | null;
  size?: "sm" | "md" | "lg";
  showPercent?: boolean;
  className?: string;
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
        className={`font-mono font-medium text-text-muted ${sizeClasses[size]} ${className}`}
      >
        --
      </span>
    );
  }

  return (
    <span
      className={`font-mono font-medium ${sizeClasses[size]} ${className}`}
      style={{ color: CLASSIFICATION_COLORS[getClassification(value)], textShadow: `0 0 20px ${CLASSIFICATION_COLORS[getClassification(value)]}40` }}
    >
      <motion.span>{display}</motion.span>
      {showPercent && <span className="text-[0.6em] ml-0.5">%</span>}
    </span>
  );
}
