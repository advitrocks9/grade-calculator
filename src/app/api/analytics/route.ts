import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { WEIGHTED_MODULES } from "@/config/modules";
import type { ModuleCode } from "@/lib/types";
import type { AggregateStats, AnalyticsResponse } from "@/lib/analytics-types";

export const revalidate = 300;

type RpcRow = {
  assessment_id: string;
  avg_mark: number;
  student_count: number;
};

export async function GET() {
  const supabase = createServerClient();

  const { data, error } = await supabase.rpc("get_assessment_analytics");

  if (error) {
    console.error("Analytics RPC failed:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }

  const rows = (data ?? []) as RpcRow[];

  const assessments: Record<string, AggregateStats> = {};
  for (const row of rows) {
    assessments[row.assessment_id] = {
      average: Number(row.avg_mark),
      studentCount: Number(row.student_count),
    };
  }

  const modules: Partial<Record<ModuleCode, AggregateStats>> = {};
  let yearWeightedSum = 0;
  let yearEcts = 0;
  let maxStudentCount = 0;

  for (const mod of WEIGHTED_MODULES) {
    let weightedSum = 0;
    let totalWeight = 0;
    let moduleMaxCount = 0;

    for (const assessment of mod.assessments) {
      if (assessment.weight === 0) continue;
      const stats = assessments[assessment.id];
      if (stats) {
        weightedSum += stats.average * assessment.weight;
        totalWeight += assessment.weight;
        moduleMaxCount = Math.max(moduleMaxCount, stats.studentCount);
      }
    }

    if (totalWeight > 0) {
      const moduleAvg = weightedSum / totalWeight;
      modules[mod.code] = {
        average: Math.round(moduleAvg * 10) / 10,
        studentCount: moduleMaxCount,
      };
      yearWeightedSum += moduleAvg * mod.ects;
      yearEcts += mod.ects;
      maxStudentCount = Math.max(maxStudentCount, moduleMaxCount);
    }
  }

  const yearAverage =
    yearEcts > 0
      ? {
          average: Math.round((yearWeightedSum / yearEcts) * 10) / 10,
          studentCount: maxStudentCount,
        }
      : null;

  const response: AnalyticsResponse = {
    assessments,
    modules,
    yearAverage,
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
