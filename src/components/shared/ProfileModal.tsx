"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";

const EASE = [0.23, 1, 0.32, 1] as const;

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
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

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open || !session?.user?.email) return;
    setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect -- gate before async fetch
    setSaved(false);

    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setName(data.profile.name ?? session.user?.name ?? "");
        } else {
          setName(session.user?.name ?? "");
        }
        setLoading(false);
      })
      .catch(() => {
        setName(session.user?.name ?? "");
        setLoading(false);
      });
  }, [open, session]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        course: "JMC",
        entry_year: session?.user?.entryYear ?? 2025,
      }),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 800);
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
            <div className="p-6">
              <h2 className="text-lg font-semibold text-text-primary">
                Profile
              </h2>

              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-text-muted border-t-text-primary" />
                </div>
              ) : (
                <form onSubmit={handleSave} className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="profile-name"
                      className="text-xs font-medium text-text-secondary"
                    >
                      Name
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-border-primary bg-bg-primary/80 px-3.5 py-2.5 text-sm text-text-primary outline-none transition-all focus:border-maths/40 focus:ring-1 focus:ring-maths/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving || saved}
                    className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl border border-border-primary/50 bg-bg-tertiary py-2.5 text-sm font-medium text-text-primary transition-all hover:bg-bg-hover hover:border-border-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving && <Spinner />}
                    {saving ? "Saving..." : saved ? "Saved" : "Save profile"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
