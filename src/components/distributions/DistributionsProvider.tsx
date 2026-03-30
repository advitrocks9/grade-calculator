"use client";

import { createContext, useContext } from "react";
import { useDistributions } from "@/hooks/useDistributions";
import type { DistributionsResponse } from "@/lib/distribution-types";

type DistributionsContextValue = {
  data: DistributionsResponse | null;
  isLoading: boolean;
};

const DistributionsContext = createContext<DistributionsContextValue>({
  data: null,
  isLoading: true,
});

export function DistributionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading } = useDistributions();
  return (
    <DistributionsContext value={{ data, isLoading }}>
      {children}
    </DistributionsContext>
  );
}

export function useDistributionsData(): DistributionsContextValue {
  return useContext(DistributionsContext);
}
