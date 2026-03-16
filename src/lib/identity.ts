export function generateUserId(): string {
  return crypto.randomUUID();
}

export function generateRecoveryCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

export function isValidRecoveryCode(code: string): boolean {
  return /^[A-HJ-NP-Z2-9]{8}$/.test(code);
}
