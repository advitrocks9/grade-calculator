"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useGradeStore } from "@/store/useGradeStore";
import { useAutoSync } from "@/hooks/useAutoSync";
import type { GradeMap } from "@/lib/types";

const RetrySyncContext = createContext<(() => void) | null>(null);
export function useRetrySync() {
  return useContext(RetrySyncContext);
}

function StoreHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useGradeStore.persist.rehydrate();
    setHydrated(true); // eslint-disable-line react-hooks/set-state-in-effect -- required for Zustand hydration gate
  }, []);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-text-muted border-t-text-primary" />
      </div>
    );
  }

  return null;
}

function RemoteSync({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [loaded, setLoaded] = useState(false);

  const { retrySync } = useAutoSync();

  useEffect(() => {
    if (!session?.user?.email) {
      setLoaded(true); // eslint-disable-line react-hooks/set-state-in-effect -- gate for unauthenticated users
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(session.user.email!)}/grades`);
        if (res.ok) {
          const data = await res.json();
          const remoteGrades: GradeMap = {};
          for (const row of data.grades ?? []) {
            remoteGrades[row.assessment_id] = row.mark;
          }
          if (Object.keys(remoteGrades).length > 0) {
            useGradeStore.getState().setBatchGrades(remoteGrades);
          }
        }
      } catch {
        // remote fetch failed, local grades still available
      }
      setLoaded(true);
    })();
  }, [session?.user?.email]);

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-text-muted border-t-text-primary" />
      </div>
    );
  }

  return (
    <RetrySyncContext.Provider value={retrySync}>
      {children}
    </RetrySyncContext.Provider>
  );
}

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreHydration />
      <RemoteSync>{children}</RemoteSync>
    </SessionProvider>
  );
}
