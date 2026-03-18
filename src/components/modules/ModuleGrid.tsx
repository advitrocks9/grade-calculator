"use client";

import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { MODULES } from "@/config/modules";
import { useModuleResults } from "@/hooks/useGradeSelectors";
import { ModuleCard } from "./ModuleCard";

export function ModuleGrid() {
  const results = useModuleResults();
  const hasAnimated = useRef(false);
  const shouldAnimate = !hasAnimated.current;

  useEffect(() => {
    hasAnimated.current = true;
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {MODULES.map((module, i) => {
        const result = results.find((r) => r.code === module.code)!;
        return (
          <motion.div
            key={module.code}
            initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: shouldAnimate ? i * 0.05 : 0,
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
