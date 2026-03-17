"use client";

import { useState } from "react";
import { useGradeStore } from "@/store/useGradeStore";
import { isValidRecoveryCode } from "@/lib/identity";

type RecoveryCodeModalProps = {
  onClose: () => void;
};

export function RecoveryCodeModal({ onClose }: RecoveryCodeModalProps) {
  const recoveryCode = useGradeStore((s) => s.recoveryCode);
  const recoverFromCode = useGradeStore((s) => s.recoverFromCode);
  const [restoreCode, setRestoreCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    if (!recoveryCode) return;
    try {
      await navigator.clipboard.writeText(recoveryCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  const handleRestore = async () => {
    const code = restoreCode.trim().toUpperCase();
    if (!isValidRecoveryCode(code)) {
      setError("Invalid recovery code format");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/recover/${code}`);
      if (!res.ok) {
        setError("Recovery code not found");
        return;
      }

      const data = await res.json();
      const grades: Record<string, number> = {};
      for (const g of data.grades) {
        grades[g.assessment_id] = g.mark;
      }
      recoverFromCode(data.user.id, code, grades);
      onClose();
    } catch {
      setError("Failed to restore. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm rounded-xl border border-border-primary bg-bg-secondary p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Recovery Code
        </h2>

        <div className="mb-6">
          <p className="text-xs text-text-muted mb-2">
            Save this code to recover your grades on another device:
          </p>
          <div className="flex items-center gap-2">
            <span className="flex-1 rounded-md bg-bg-tertiary px-3 py-2 font-[family-name:var(--font-dm-mono)] text-sm tracking-wider text-text-primary">
              {recoveryCode ?? "—"}
            </span>
            <button
              onClick={handleCopy}
              className="rounded-md bg-bg-tertiary px-3 py-2 text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="border-t border-border-primary pt-4">
          <p className="text-xs text-text-muted mb-2">
            Or restore from a recovery code:
          </p>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={restoreCode}
              onChange={(e) => setRestoreCode(e.target.value)}
              placeholder="Enter code"
              maxLength={8}
              className="flex-1 rounded-md border border-border-primary bg-bg-tertiary px-3 py-2 font-[family-name:var(--font-dm-mono)] text-sm uppercase tracking-wider text-text-primary outline-none placeholder:text-text-muted"
            />
            <button
              onClick={handleRestore}
              disabled={loading || !restoreCode.trim()}
              className="rounded-md bg-text-primary px-3 py-2 text-xs font-medium text-bg-primary transition-colors hover:bg-text-secondary disabled:opacity-40"
            >
              {loading ? "…" : "Restore"}
            </button>
          </div>
          {error && <p className="text-xs text-red">{error}</p>}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-md bg-bg-tertiary py-2 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
