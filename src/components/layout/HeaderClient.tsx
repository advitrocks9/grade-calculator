"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Header } from "./Header";
import { ExportImportButtons } from "@/components/shared/ExportImportButtons";
import { LoginModal } from "@/components/shared/LoginModal";
import { ProfileModal } from "@/components/shared/ProfileModal";
import { useGradeStore } from "@/store/useGradeStore";
import { useRetrySync } from "./ClientShell";

function UserMenu({
  onSignIn,
  onProfile,
}: {
  onSignIn: () => void;
  onProfile: () => void;
}) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!session?.user) {
    return (
      <button
        onClick={onSignIn}
        className="rounded-md bg-bg-tertiary px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
      >
        Sign in
      </button>
    );
  }

  const initials = (session.user.name ?? session.user.email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-tertiary text-xs font-medium text-text-primary transition-colors hover:bg-border-primary"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-50 w-56 rounded-lg border border-border-primary bg-bg-secondary p-2 shadow-lg">
          <div className="border-b border-border-primary px-3 py-2">
            <p className="text-sm font-medium text-text-primary">
              {session.user.name}
            </p>
            <p className="text-xs text-text-muted">{session.user.email}</p>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              onProfile();
            }}
            className="mt-1 w-full rounded-md px-3 py-1.5 text-left text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
          >
            Profile
          </button>
          <button
            onClick={() => signOut()}
            className="mt-0.5 w-full rounded-md px-3 py-1.5 text-left text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function SyncErrorBanner() {
  const syncStatus = useGradeStore((s) => s.syncStatus);
  const retrySync = useRetrySync();

  if (syncStatus !== "error") return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-red/10 px-3 py-1.5 text-xs text-red">
      <span>Sync failed</span>
      {retrySync && (
        <button
          onClick={retrySync}
          className="rounded-md bg-red/20 px-2 py-0.5 text-xs font-medium hover:bg-red/30 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function HeaderClient() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("login")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading URL params on mount, runs once
      setLoginOpen(true);
      const authError = params.get("error");
      if (authError) {
        setLoginError(
          authError === "AccessDenied"
            ? "This email isn't on the class list."
            : "Something went wrong. Please try again.",
        );
      }
      params.delete("login");
      params.delete("error");
      const clean = params.toString();
      window.history.replaceState(
        {},
        "",
        clean ? `?${clean}` : window.location.pathname,
      );
    }
  }, []);

  return (
    <>
      <Header
        exportImportSlot={<ExportImportButtons />}
        authSlot={
          <UserMenu
            onSignIn={() => setLoginOpen(true)}
            onProfile={() => setProfileOpen(true)}
          />
        }
      />
      <SyncErrorBanner />
      <LoginModal
        open={loginOpen}
        onClose={() => {
          setLoginOpen(false);
          setLoginError(null);
        }}
        initialError={loginError}
      />
      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
}
