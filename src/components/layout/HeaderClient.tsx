"use client";

import { useState } from "react";
import { Header } from "./Header";
import { SyncIndicator } from "@/components/shared/SyncIndicator";
import { RecoveryCodeModal } from "@/components/shared/RecoveryCodeModal";

export function HeaderClient() {
  const [showRecovery, setShowRecovery] = useState(false);

  return (
    <>
      <Header
        syncSlot={<SyncIndicator />}
        recoverySlot={
          <button
            onClick={() => setShowRecovery(true)}
            className="rounded-md bg-bg-tertiary px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            Recovery
          </button>
        }
      />
      {showRecovery && (
        <RecoveryCodeModal onClose={() => setShowRecovery(false)} />
      )}
    </>
  );
}
