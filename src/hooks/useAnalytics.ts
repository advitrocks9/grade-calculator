"use client";

import { useState, useEffect } from "react";
import type { AnalyticsResponse } from "@/lib/analytics-types";

type AnalyticsState = {
  data: AnalyticsResponse | null;
  isLoading: boolean;
  error: boolean;
};

export function useAnalytics(): AnalyticsState {
  const [state, setState] = useState<AnalyticsState>({
    data: null,
    isLoading: true,
    error: false,
  });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/analytics")
      .then((res) => {
        if (!res.ok) throw new Error("Analytics fetch failed");
        return res.json();
      })
      .then((data: AnalyticsResponse) => {
        if (!cancelled) setState({ data, isLoading: false, error: false });
      })
      .catch(() => {
        if (!cancelled) setState({ data: null, isLoading: false, error: true });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
