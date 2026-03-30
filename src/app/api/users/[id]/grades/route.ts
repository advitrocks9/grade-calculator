import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { auth } from "@/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = decodeURIComponent(id);
  const session = await auth();

  if (!session?.user?.email || session.user.email !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("grades")
    .select("assessment_id, mark")
    .eq("user_id", userId);

  if (error) {
    console.error("Grades fetch failed:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }

  return NextResponse.json({ grades: data });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = decodeURIComponent(id);
  const session = await auth();

  if (!session?.user?.email || session.user.email !== userId) {
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
      isNaN(g.mark) ||
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
    user_id: userId,
    assessment_id: g.assessment_id,
    mark: g.mark,
  }));

  const { error } = await supabase.from("grades").upsert(rows, {
    onConflict: "user_id, assessment_id",
  });

  if (error) {
    console.error("Grades upsert failed:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
