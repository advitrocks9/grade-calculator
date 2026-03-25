import type { ModuleCode } from "./types";

export type AggregateStats = {
  average: number;
  studentCount: number;
};

export type AnalyticsResponse = {
  assessments: Record<string, AggregateStats>;
  modules: Partial<Record<ModuleCode, AggregateStats>>;
  yearAverage: AggregateStats | null;
  generatedAt: string;
};
