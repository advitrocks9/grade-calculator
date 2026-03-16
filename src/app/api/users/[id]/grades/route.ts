import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { authenticateRequest } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const authorized = await authenticateRequest(request, id);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("grades")
    .select("assessment_id, mark")
    .eq("user_id", id);

  if (error) {
    console.error("Grades fetch failed:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ grades: data });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const authorized = await authenticateRequest(request, id);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { grades } = body as {
    grades: { assessment_id: string; mark: number }[];
  };

  if (!Array.isArray(grades) || grades.length === 0 || grades.length > 50) {
    return NextResponse.json(
      { error: "grades must be a non-empty array (max 50)" },
      { status: 400 },
    );
  }

  for (const g of grades) {
    if (
      typeof g.assessment_id !== "string" ||
      !g.assessment_id ||
      typeof g.mark !== "number" ||
      g.mark < 0 ||
      g.mark > 100
    ) {
      return NextResponse.json(
        { error: "Invalid grade entry" },
        { status: 400 },
      );
    }
  }

  const supabase = createServerClient();

  const rows = grades.map((g) => ({
    user_id: id,
    assessment_id: g.assessment_id,
    mark: g.mark,
  }));

  const { error } = await supabase.from("grades").upsert(rows, {
    onConflict: "user_id, assessment_id",
  });

  if (error) {
    console.error("Grades upsert failed:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
