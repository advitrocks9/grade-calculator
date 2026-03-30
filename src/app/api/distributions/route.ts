import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import type { AssessmentDistribution } from "@/lib/distribution-types";

export const revalidate = 300;

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc("get_assessment_distributions");

  if (error) {
    console.error("Distribution RPC failed:", error.message);
    return NextResponse.json({
      distributions: {},
      generatedAt: new Date().toISOString(),
    });
  }

  const distributions: Record<string, AssessmentDistribution> = {};

  for (const row of data ?? []) {
    if (!distributions[row.assessment_id]) {
      distributions[row.assessment_id] = {
        buckets: [],
        totalCount: Number(row.total_count),
        mean: Number(row.avg_mark),
        median: Number(row.median_mark),
      };
    }
    distributions[row.assessment_id].buckets.push({
      lower: row.bucket_lower,
      upper: row.bucket_upper,
      count: Number(row.student_count),
    });
  }

  return NextResponse.json({
    distributions,
    generatedAt: new Date().toISOString(),
  });
}
