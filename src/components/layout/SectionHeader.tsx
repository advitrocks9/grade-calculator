"use client";

import { motion } from "motion/react";

type SectionHeaderProps = {
  label: string;
  onClick?: () => void;
  expanded?: boolean;
};

export function SectionHeader({
  label,
  onClick,
  expanded,
}: SectionHeaderProps) {
  return (
    <div
      className={`flex items-center gap-3 ${onClick ? "cursor-pointer transition-colors duration-200" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-expanded={onClick ? expanded : undefined}
      aria-label={onClick ? `${label}, expand or collapse` : undefined}
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
      <span className={`text-xs font-medium uppercase tracking-wider text-text-muted whitespace-nowrap ${onClick ? "hover:text-text-secondary" : ""}`}>
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-border-primary via-border-primary to-transparent" />
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
