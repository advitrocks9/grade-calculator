import { MODULES } from "@/config/modules";
import type { GradeMap } from "./types";

export function getUnenteredAssessments(grades: GradeMap) {
  return MODULES.flatMap((m) => m.assessments).filter(
    (a) => a.weight > 0 && grades[a.id] == null,
  );
}
