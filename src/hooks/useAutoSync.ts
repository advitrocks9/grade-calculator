"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useGradeStore } from "@/store/useGradeStore";

export function useAutoSync() {
  const { data: session } = useSession();
  const grades = useGradeStore((s) => s.grades);
  const setSyncStatus = useGradeStore((s) => s.setSyncStatus);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);
  const suppressRef = useRef(false);

  const doSync = useCallback(async () => {
    const email = session?.user?.email;
    if (!email) return;

    const currentGrades = useGradeStore.getState().grades;
    setSyncStatus("syncing");

    try {
      const gradeEntries = Object.entries(currentGrades)
        .filter(([, mark]) => mark != null)
        .map(([assessment_id, mark]) => ({ assessment_id, mark }));

      const res = await fetch(`/api/users/${encodeURIComponent(email)}/grades`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grades: gradeEntries }),
      });
      if (!res.ok) throw new Error("Sync failed");

      setSyncStatus("synced");
    } catch {
      setSyncStatus("error");
    }
  }, [session?.user?.email, setSyncStatus]);

  useEffect(() => {
    if (!session?.user?.email) return;

    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }

    if (suppressRef.current) {
      suppressRef.current = false;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(doSync, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [grades, session?.user?.email, doSync]);

  return { retrySync: doSync, suppressRef };
}
