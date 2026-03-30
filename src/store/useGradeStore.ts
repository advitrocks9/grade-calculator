"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GradeMap } from "@/lib/types";

type SyncStatus = "idle" | "syncing" | "synced" | "error";

interface GradeState {
  grades: GradeMap;
  syncStatus: SyncStatus;

  setGrade: (assessmentId: string, mark: number | null) => void;
  setBatchGrades: (grades: GradeMap) => void;
  setSyncStatus: (status: SyncStatus) => void;
  clearAll: () => void;
}

export const useGradeStore = create<GradeState>()(
  persist(
    (set) => ({
      grades: {},
      syncStatus: "idle",

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

      setSyncStatus: (syncStatus) => set({ syncStatus }),

      clearAll: () =>
        set({
          grades: {},
          syncStatus: "idle",
        }),
    }),
    {
      name: "jmc-grade-hub",
      skipHydration: true,
      partialize: (state) => ({
        grades: state.grades,
      }),
    },
  ),
);
