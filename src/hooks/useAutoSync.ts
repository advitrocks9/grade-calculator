"use client";

import { useEffect, useRef } from "react";
import { useGradeStore } from "@/store/useGradeStore";

export function useAutoSync() {
  const grades = useGradeStore((s) => s.grades);
  const userId = useGradeStore((s) => s.userId);
  const recoveryCode = useGradeStore((s) => s.recoveryCode);
  const setSyncStatus = useGradeStore((s) => s.setSyncStatus);
  const setLastSyncedAt = useGradeStore((s) => s.setLastSyncedAt);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);
  const userCreatedRef = useRef(false);

  useEffect(() => {
    if (!userId || !recoveryCode) return;

    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setSyncStatus("syncing");

      const authHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${recoveryCode}`,
      };

      try {
        if (!userCreatedRef.current) {
          const userRes = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: userId, recovery_code: recoveryCode }),
          });
          if (!userRes.ok) throw new Error("User creation failed");
          userCreatedRef.current = true;
        }

        const gradeEntries = Object.entries(grades)
          .filter(([, mark]) => mark != null)
          .map(([assessment_id, mark]) => ({ assessment_id, mark }));

        if (gradeEntries.length > 0) {
          const res = await fetch(`/api/users/${userId}/grades`, {
            method: "PUT",
            headers: authHeaders,
            body: JSON.stringify({ grades: gradeEntries }),
          });
          if (!res.ok) throw new Error("Sync failed");
        }

        setSyncStatus("synced");
        setLastSyncedAt(Date.now());
      } catch {
        setSyncStatus("error");
      }
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [grades, userId, recoveryCode, setSyncStatus, setLastSyncedAt]);
}
