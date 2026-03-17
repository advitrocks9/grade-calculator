"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GradeMap } from "@/lib/types";
import { generateUserId, generateRecoveryCode } from "@/lib/identity";

type SyncStatus = "idle" | "syncing" | "synced" | "error";

type GradeState = {
  userId: string | null;
  recoveryCode: string | null;
  grades: GradeMap;
  lastSyncedAt: number | null;
  syncStatus: SyncStatus;

  initUser: () => void;
  setGrade: (assessmentId: string, mark: number | null) => void;
  setBatchGrades: (grades: GradeMap) => void;
  recoverFromCode: (userId: string, recoveryCode: string, grades: GradeMap) => void;
  setSyncStatus: (status: SyncStatus) => void;
  setLastSyncedAt: (timestamp: number) => void;
  clearAll: () => void;
};

export const useGradeStore = create<GradeState>()(
  persist(
    (set, get) => ({
      userId: null,
      recoveryCode: null,
      grades: {},
      lastSyncedAt: null,
      syncStatus: "idle",

      initUser: () => {
        if (get().userId) return;
        const userId = generateUserId();
        const recoveryCode = generateRecoveryCode();
        set({ userId, recoveryCode });
      },

      setGrade: (assessmentId, mark) => {
        set((state) => ({
          grades: { ...state.grades, [assessmentId]: mark },
          syncStatus: "idle",
        }));
      },

      setBatchGrades: (grades) => {
        set((state) => ({
          grades: { ...state.grades, ...grades },
          syncStatus: "idle",
        }));
      },

      recoverFromCode: (userId, recoveryCode, grades) => {
        set({ userId, recoveryCode, grades, syncStatus: "idle" });
      },

      setSyncStatus: (syncStatus) => set({ syncStatus }),

      setLastSyncedAt: (timestamp) => set({ lastSyncedAt: timestamp }),

      clearAll: () =>
        set({
          userId: null,
          recoveryCode: null,
          grades: {},
          lastSyncedAt: null,
          syncStatus: "idle",
        }),
    }),
    {
      name: "jmc-grade-hub",
      partialize: (state) => ({
        userId: state.userId,
        recoveryCode: state.recoveryCode,
        grades: state.grades,
        lastSyncedAt: state.lastSyncedAt,
      }),
    },
  ),
);
