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
      setEmail(""); // eslint-disable-line react-hooks/set-state-in-effect
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
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-border-primary/60 bg-bg-secondary shadow-modal"
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
                      className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl border border-border-primary/50 bg-bg-tertiary py-2.5 text-sm font-medium text-text-primary transition-all hover:bg-bg-hover hover:border-border-secondary disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="p-6"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.05, duration: 0.25, ease: EASE }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-maths/10"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-maths"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                    <div>
                      <h2 className="text-lg font-semibold text-text-primary">
                        Check your inbox
                      </h2>
                      <p className="text-sm text-text-muted">
                        Link sent to{" "}
                        <span className="text-text-secondary">{email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-border-primary/40 bg-bg-primary/60 px-3.5 py-3">
                    <p className="text-xs text-text-muted leading-relaxed">
                      Click the link in the email to sign in. Check spam if you
                      don&apos;t see it within a minute.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSent(false);
                      setError(null);
                    }}
                    className="cursor-pointer mt-4 w-full rounded-xl border border-border-primary/50 bg-bg-tertiary py-2.5 text-xs text-text-secondary hover:text-text-primary hover:border-border-secondary transition-all"
                  >
                    Send again
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
