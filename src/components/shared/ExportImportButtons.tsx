"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useGradeStore } from "@/store/useGradeStore";
import { MODULES } from "@/config/modules";

const EASE = [0.23, 1, 0.32, 1] as const;

interface GradeExport {
  version: 1;
  app: "jmc-grade-calculator";
  exportedAt: string;
  grades: Record<string, number | null>;
}

const VALID_IDS = new Set(
  MODULES.flatMap((m) => m.assessments.map((a) => a.id)),
);

function validate(data: unknown): data is GradeExport {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  if (obj.app !== "jmc-grade-calculator" || obj.version !== 1) return false;
  if (typeof obj.grades !== "object" || obj.grades === null) return false;

  for (const [id, mark] of Object.entries(
    obj.grades as Record<string, unknown>,
  )) {
    if (!VALID_IDS.has(id)) continue;
    if (mark !== null && (typeof mark !== "number" || mark < 0 || mark > 100))
      return false;
  }
  return true;
}

interface PendingImport {
  name: string;
  grades: Record<string, number | null>;
  count: number;
}

export function ExportImportButtons() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<PendingImport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setPending(null);
        setError(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  function handleClose() {
    setOpen(false);
    setPending(null);
    setError(null);
  }

  function handleExport() {
    const grades = useGradeStore.getState().grades;
    const data: GradeExport = {
      version: 1,
      app: "jmc-grade-calculator",
      exportedAt: new Date().toISOString(),
      grades,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grades-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (!validate(data)) {
          setError("Invalid file format");
          return;
        }
        const filtered: Record<string, number | null> = {};
        for (const [id, mark] of Object.entries(data.grades)) {
          if (VALID_IDS.has(id)) filtered[id] = mark;
        }
        const count = Object.values(filtered).filter((v) => v != null).length;
        setPending({ name: file.name, grades: filtered, count });
      } catch {
        setError("Could not read file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function confirmImport() {
    if (!pending) return;
    useGradeStore.getState().clearAll();
    useGradeStore.getState().setBatchGrades(pending.grades);
    handleClose();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-md bg-bg-tertiary px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
      >
        Manage
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        onChange={handleFile}
        className="hidden"
      />

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
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

                <AnimatePresence mode="wait" initial={false}>
                  {!pending ? (
                    <motion.div
                      key="actions"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="p-6"
                    >
                      <h2 className="text-lg font-semibold text-text-primary">
                        Grade data
                      </h2>
                      <div className="mt-5 space-y-2">
                        <button
                          onClick={handleExport}
                          className="flex w-full items-start gap-3 rounded-xl border border-border-primary/40 bg-bg-primary/60 p-3.5 text-left transition-all hover:bg-bg-primary hover:border-border-secondary cursor-pointer"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mt-0.5 shrink-0 text-text-muted"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-text-primary">
                              Export
                            </p>
                            <p className="text-xs text-text-muted">
                              Download grades as JSON
                            </p>
                          </div>
                        </button>
                        <button
                          onClick={() => fileRef.current?.click()}
                          className="flex w-full items-start gap-3 rounded-xl border border-border-primary/40 bg-bg-primary/60 p-3.5 text-left transition-all hover:bg-bg-primary hover:border-border-secondary cursor-pointer"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mt-0.5 shrink-0 text-text-muted"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-text-primary">
                              Import
                            </p>
                            <p className="text-xs text-text-muted">
                              Replace grades from a file
                            </p>
                          </div>
                        </button>
                      </div>
                      {error && (
                        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-red-500/5 border border-red-500/10 px-3.5 py-2.5">
                          <svg
                            className="h-4 w-4 shrink-0 mt-0.5 text-red-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          <p className="text-sm text-red-400">{error}</p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="p-6"
                    >
                      <h2 className="text-lg font-semibold text-text-primary">
                        Import grades
                      </h2>
                      <div className="mt-5 rounded-xl border border-border-primary/40 bg-bg-primary/60 px-3.5 py-3">
                        <p className="text-sm font-medium text-text-primary">
                          {pending.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {pending.count} grade
                          {pending.count !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <p className="mt-3 text-sm text-text-muted">
                        This will replace all your current grades.
                      </p>
                      <div className="mt-5 flex items-center justify-end gap-3">
                        <button
                          onClick={() => setPending(null)}
                          className="rounded-xl border border-border-primary/50 bg-bg-tertiary px-4 py-2 text-xs text-text-secondary hover:text-text-primary hover:border-border-secondary transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={confirmImport}
                          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/15 hover:border-red-500/30 transition-all cursor-pointer"
                        >
                          Replace grades
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
