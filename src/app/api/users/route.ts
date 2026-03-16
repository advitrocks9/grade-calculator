import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { hashRecoveryCode } from "@/lib/auth";
import { isValidRecoveryCode } from "@/lib/identity";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id, recovery_code } = body as { id: string; recovery_code: string };

  if (!id || typeof id !== "string" || !UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!recovery_code || typeof recovery_code !== "string" || !isValidRecoveryCode(recovery_code)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { error } = await supabase.from("users").upsert(
    { id, recovery_code: hashRecoveryCode(recovery_code) },
    { onConflict: "id" },
  );

  if (error) {
    console.error("User upsert failed:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
