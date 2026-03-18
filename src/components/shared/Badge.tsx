"use client";

import { motion } from "motion/react";

type BadgeProps = {
  label: string;
  color?: string;
  className?: string;
  animated?: boolean;
};

export function Badge({ label, color, className = "", animated }: BadgeProps) {
  const content = (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
      style={color ? { backgroundColor: `${color}20`, color } : undefined}
    >
      {label}
    </span>
  );

  if (animated) {
    return (
      <motion.span
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {content}
      </motion.span>
    );
  }

  return content;
}
