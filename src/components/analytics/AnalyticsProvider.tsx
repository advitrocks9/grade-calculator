"use client";

import { createContext, useContext } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { AnalyticsResponse } from "@/lib/analytics-types";

type AnalyticsContextValue = {
  data: AnalyticsResponse | null;
  isLoading: boolean;
};

const AnalyticsContext = createContext<AnalyticsContextValue>({
  data: null,
  isLoading: true,
});

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useAnalytics();
  return (
    <AnalyticsContext value={{ data, isLoading }}>{children}</AnalyticsContext>
  );
}

export function useAnalyticsData(): AnalyticsContextValue {
  return useContext(AnalyticsContext);
}
