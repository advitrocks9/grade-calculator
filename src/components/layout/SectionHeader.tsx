"use client";

import { motion } from "motion/react";

type SectionHeaderProps = {
  label: string;
  onClick?: () => void;
  expanded?: boolean;
};

export function SectionHeader({ label, onClick, expanded }: SectionHeaderProps) {
  return (
    <div
      className={`flex items-center gap-3 ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-expanded={onClick ? expanded : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <span className="text-xs font-medium uppercase tracking-wider text-text-muted whitespace-nowrap">
        {label}
      </span>
      <div className="h-px flex-1 bg-border-primary" />
      {onClick != null && (
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-text-muted"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      )}
    </div>
  );
}
