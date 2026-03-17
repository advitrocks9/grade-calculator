"use client";

import { useEffect, useState } from "react";
import { useGradeStore } from "@/store/useGradeStore";
import { useAutoSync } from "@/hooks/useAutoSync";
import type { GradeMap } from "@/lib/types";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const initUser = useGradeStore((s) => s.initUser);

  useAutoSync();

  useEffect(() => {
    const hydrate = async () => {
      initUser();

      const { userId, recoveryCode } = useGradeStore.getState();
      if (userId && recoveryCode) {
        try {
          const res = await fetch(`/api/users/${userId}/grades`, {
            headers: { Authorization: `Bearer ${recoveryCode}` },
          });
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
          // Supabase fetch failed — localStorage grades still available
        }
      }

      setHydrated(true);
    };

    hydrate();
  }, [initUser]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-text-muted border-t-text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
