"use client";

import { useGradeStore } from "@/store/useGradeStore";

export function SyncIndicator() {
  const syncStatus = useGradeStore((s) => s.syncStatus);

  if (syncStatus === "idle") return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-text-muted">
      {syncStatus === "syncing" && (
        <>
          <div className="h-3 w-3 animate-spin rounded-full border border-text-muted border-t-text-primary" />
          <span>Saving…</span>
        </>
      )}
      {syncStatus === "synced" && (
        <>
          <div className="h-2 w-2 rounded-full bg-first" />
          <span>Saved</span>
        </>
      )}
      {syncStatus === "error" && (
        <>
          <div className="h-2 w-2 rounded-full bg-red" />
          <span>Sync error</span>
        </>
      )}
    </div>
  );
}
