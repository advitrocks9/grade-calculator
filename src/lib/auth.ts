import { createHash } from "node:crypto";
import { createServerClient } from "./supabase";
import { isValidRecoveryCode } from "./identity";

export function hashRecoveryCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export async function authenticateRequest(
  request: Request,
  userId: string,
): Promise<boolean> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  const code = authHeader.slice(7);
  if (!isValidRecoveryCode(code)) return false;

  const supabase = createServerClient();
  const { data } = await supabase
    .from("users")
    .select("recovery_code")
    .eq("id", userId)
    .single();

  if (!data) return false;
  return data.recovery_code === hashRecoveryCode(code);
}
