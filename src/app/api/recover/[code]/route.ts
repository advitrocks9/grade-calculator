import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { isValidRecoveryCode } from "@/lib/identity";
import { hashRecoveryCode } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  if (!isValidRecoveryCode(code)) {
    return NextResponse.json(
      { error: "Invalid recovery code format" },
      { status: 400 },
    );
  }

  const supabase = createServerClient();

  const { data: users, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("recovery_code", hashRecoveryCode(code))
    .limit(1);

  if (userError || !users || users.length === 0) {
    return NextResponse.json(
      { error: "Recovery code not found" },
      { status: 404 },
    );
  }

  const user = users[0];

  const { data: grades, error: gradesError } = await supabase
    .from("grades")
    .select("assessment_id, mark")
    .eq("user_id", user.id);

  if (gradesError) {
    console.error("Recovery grades fetch failed:", gradesError.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ user, grades });
}
