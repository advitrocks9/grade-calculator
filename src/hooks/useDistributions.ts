"use client";

import { useState, useEffect } from "react";
import type { DistributionsResponse } from "@/lib/distribution-types";

type DistributionsState = {
  data: DistributionsResponse | null;
  isLoading: boolean;
  error: boolean;
};

export function useDistributions(): DistributionsState {
  const [state, setState] = useState<DistributionsState>({
    data: null,
    isLoading: true,
    error: false,
  });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/distributions")
      .then((res) => {
        if (!res.ok) throw new Error("Distributions fetch failed");
        return res.json();
      })
      .then((data: DistributionsResponse) => {
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
