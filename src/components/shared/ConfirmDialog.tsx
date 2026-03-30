"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

const EASE = [0.23, 1, 0.32, 1] as const;

type ConfirmDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-border-primary/60 bg-bg-secondary shadow-modal"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-px bg-gradient-to-r from-transparent via-maths/30 to-transparent" />
            <div className="p-6">
              <h2 className="text-lg font-semibold text-text-primary">
                {title}
              </h2>
              <p className="mt-2 text-sm text-text-muted">{message}</p>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={onCancel}
                  className="rounded-xl border border-border-primary/50 bg-bg-tertiary px-4 py-2 text-xs text-text-secondary hover:text-text-primary hover:border-border-secondary transition-all cursor-pointer"
                >
                  {cancelLabel}
                </button>
                <button
                  ref={confirmRef}
                  onClick={onConfirm}
                  className="rounded-xl border border-border-primary/50 bg-bg-tertiary px-4 py-2 text-xs font-medium text-text-primary hover:bg-bg-hover hover:border-border-secondary transition-all cursor-pointer"
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
