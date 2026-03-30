"use client";

import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";

const IMPERIAL_RE = /^[a-z]+(\.[a-z]+)+\d{2}@imperial\.ac\.uk$/;
const EASE = [0.23, 1, 0.32, 1] as const;

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  initialError?: string | null;
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function LoginModal({ open, onClose, initialError }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setEmail(""); // eslint-disable-line react-hooks/set-state-in-effect -- reset on open
      setLoading(false);
      setError(initialError ?? null);
      setSent(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, initialError]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const normalized = email.trim().toLowerCase();
    if (!IMPERIAL_RE.test(normalized)) {
      setError("Use your full Imperial email (longcode@imperial.ac.uk)");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("resend", {
        email: normalized,
        redirect: false,
      });
      setLoading(false);

      if (result?.error) {
        setError("This email isn't on the class list.");
        return;
      }

      setSent(true);
    } catch {
      setLoading(false);
      setError("Something went wrong. Try again.");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-border-primary/60 bg-bg-secondary shadow-[0_16px_70px_-12px_rgba(0,0,0,0.7)]"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-px bg-gradient-to-r from-transparent via-maths/30 to-transparent" />

            <AnimatePresence mode="wait" initial={false}>
              {!sent ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="p-6"
                >
                  <h2 className="text-lg font-semibold text-text-primary">
                    Sign in
                  </h2>
                  <p className="mt-1 text-sm text-text-muted">
                    We&apos;ll send a magic link to your email
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="login-email"
                        className="text-xs font-medium text-text-secondary"
                      >
                        Imperial email
                      </label>
                      <input
                        ref={inputRef}
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="longcode@imperial.ac.uk"
                        required
                        autoComplete="email"
                        className="w-full rounded-xl border border-border-primary bg-bg-primary/80 px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted/30 outline-none transition-all focus:border-maths/40 focus:ring-1 focus:ring-maths/20"
                      />
                    </div>

                    {error && (
                      <div className="flex items-start gap-2.5 rounded-xl bg-red-500/5 border border-red-500/10 px-3.5 py-2.5">
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

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-primary/50 bg-bg-tertiary py-2.5 text-sm font-medium text-text-primary transition-all hover:bg-bg-hover hover:border-border-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading && <Spinner />}
                      {loading ? "Sending..." : "Send magic link"}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col items-center px-6 py-8 text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-first/10 ring-1 ring-first/20">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-first"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-text-primary">
                    Check your email
                  </h2>
                  <p className="mt-1.5 text-sm text-text-muted">
                    We sent a link to{" "}
                    <span className="font-medium text-text-secondary">
                      {email}
                    </span>
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setError(null);
                    }}
                    className="mt-5 text-xs text-text-muted hover:text-text-secondary transition-colors"
                  >
                    Didn&apos;t get it? Try again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
