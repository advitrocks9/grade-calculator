export function parseGradeInput(input: string): number | null {
  const trimmed = input.trim();
  if (trimmed === "") return null;

  const fractionMatch = trimmed.match(
    /^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/,
  );
  if (fractionMatch) {
    const num = parseFloat(fractionMatch[1]);
    const den = parseFloat(fractionMatch[2]);
    if (den === 0) return null;
    const percent = (num / den) * 100;
    return Math.max(0, Math.min(100, percent));
  }

  const parsed = parseFloat(trimmed);
  if (isNaN(parsed)) return null;
  return Math.max(0, Math.min(100, parsed));
}
