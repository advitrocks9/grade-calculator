"use client";

import { motion } from "motion/react";
import { MODULES } from "@/config/modules";
import { useModuleResults } from "@/hooks/useGradeSelectors";
import { ModuleCard } from "./ModuleCard";

export function ModuleGrid() {
  const results = useModuleResults();
  const resultsMap = new Map(results.map((r) => [r.code, r]));

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {MODULES.map((module, i) => {
        const result = resultsMap.get(module.code)!;
        return (
          <motion.div
            key={module.code}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.04,
              duration: 0.3,
              ease: "easeOut",
            }}
          >
            <ModuleCard module={module} result={result} />
          </motion.div>
        );
      })}
    </div>
  );
}
