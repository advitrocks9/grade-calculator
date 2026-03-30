"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ClientShell } from "@/components/layout/ClientShell";
import { HeaderClient } from "@/components/layout/HeaderClient";
import { SummaryBar } from "@/components/layout/SummaryBar";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ModuleGrid } from "@/components/modules/ModuleGrid";
import { ProgressionPanel } from "@/components/progression/ProgressionPanel";
import { ScenarioSimulator } from "@/components/simulator/ScenarioSimulator";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { DistributionsProvider } from "@/components/distributions/DistributionsProvider";

function PageContent() {
  const [showSimulator, setShowSimulator] = useState(false);
  const [showProgression, setShowProgression] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <>
      <HeaderClient />
      <SummaryBar />
      <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <SectionHeader label="Modules" />
        <ModuleGrid />

        <SectionHeader
          label="What-If Simulator"
          onClick={() => setShowSimulator(!showSimulator)}
          expanded={showSimulator}
        />

        <AnimatePresence>
          {showSimulator && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <ScenarioSimulator onClose={() => setShowSimulator(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        <SectionHeader
          label="Class Analytics"
          onClick={() => setShowAnalytics(!showAnalytics)}
          expanded={showAnalytics}
        />

        <AnimatePresence>
          {showAnalytics && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <AnalyticsPanel />
            </motion.div>
          )}
        </AnimatePresence>

        <SectionHeader
          label="Progression"
          onClick={() => setShowProgression(!showProgression)}
          expanded={showProgression}
        />

        <AnimatePresence>
          {showProgression && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <ProgressionPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <ClientShell>
      <AnalyticsProvider>
        <DistributionsProvider>
          <PageContent />
        </DistributionsProvider>
      </AnalyticsProvider>
    </ClientShell>
  );
}
