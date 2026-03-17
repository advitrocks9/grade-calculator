"use client";

import { useState } from "react";
import { useGradeStore } from "@/store/useGradeStore";
import { parseGradeInput } from "@/utils/parseGradeInput";

type GradeInputProps = {
  assessmentId: string;
  disabled?: boolean;
};

export function GradeInput({ assessmentId, disabled = false }: GradeInputProps) {
  const mark = useGradeStore((s) => s.grades[assessmentId]);
  const setGrade = useGradeStore((s) => s.setGrade);
  const [localValue, setLocalValue] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const [expressionHint, setExpressionHint] = useState<string | null>(null);

  const displayValue = isFocused ? localValue : (mark != null ? String(mark) : "");
  const parsedLocal = localValue ? parseFloat(localValue) : null;
  const isOutOfRange = isFocused && parsedLocal != null && !isNaN(parsedLocal) && (parsedLocal < 0 || parsedLocal > 100);

  const handleFocus = () => {
    setLocalValue(expressionHint ?? (mark != null ? String(mark) : ""));
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (localValue === "") {
      setGrade(assessmentId, null);
      setExpressionHint(null);
      return;
    }
    const parsed = parseGradeInput(localValue);
    if (parsed == null) {
      setLocalValue("");
      setExpressionHint(null);
      return;
    }
    const rounded = Math.round(parsed * 10) / 10;
    setGrade(assessmentId, rounded);
    setExpressionHint(localValue.includes("/") ? localValue.trim() : null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);

    if (val === "") {
      setGrade(assessmentId, null);
      return;
    }
    if (val.includes("/") || val.endsWith(".")) return;
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setGrade(assessmentId, num);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="—"
        className={`w-20 rounded-md border bg-bg-tertiary px-2 py-1 text-right font-[family-name:var(--font-dm-mono)] text-sm text-text-primary outline-none transition-colors
          placeholder:text-text-muted
          focus:border-border-secondary focus:ring-1 focus:ring-border-secondary
          disabled:cursor-not-allowed disabled:opacity-40
          ${isOutOfRange ? "border-red" : "border-border-primary"}`}
      />
      {!isFocused && expressionHint && mark != null && (
        <p className="absolute -bottom-4 right-0 text-[10px] text-text-muted font-[family-name:var(--font-dm-mono)] whitespace-nowrap">
          {expressionHint}
        </p>
      )}
    </div>
  );
}
