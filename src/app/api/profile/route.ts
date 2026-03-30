import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.email)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }

  return NextResponse.json({ profile: data });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, course, entry_year } = body as {
    name: string;
    course: string;
    entry_year: number;
  };

  if (!name || !course || !entry_year) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { error } = await supabase.from("profiles").upsert(
    {
      id: session.user.email,
      email: session.user.email,
      name,
      course,
      entry_year,
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("Profile upsert failed:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
