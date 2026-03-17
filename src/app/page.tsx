"use client";

import { useState } from "react";
import { ClientShell } from "@/components/layout/ClientShell";
import { HeaderClient } from "@/components/layout/HeaderClient";
import { SummaryBar } from "@/components/layout/SummaryBar";
import { ModuleGrid } from "@/components/modules/ModuleGrid";
import { ProgressionPanel } from "@/components/progression/ProgressionPanel";
import { ScenarioSimulator } from "@/components/simulator/ScenarioSimulator";
import { Footer } from "@/components/layout/Footer";

function PageContent() {
  const [showSimulator, setShowSimulator] = useState(false);

  return (
    <>
      <HeaderClient />
      <SummaryBar />
      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        <ModuleGrid />

        <div className="flex justify-center">
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className="rounded-md bg-bg-secondary border border-border-primary px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            {showSimulator ? "Hide Simulator" : "What-If Simulator"}
          </button>
        </div>

        {showSimulator && (
          <ScenarioSimulator onClose={() => setShowSimulator(false)} />
        )}

        <ProgressionPanel />
      </main>
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <ClientShell>
      <PageContent />
    </ClientShell>
  );
}
