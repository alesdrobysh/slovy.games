"use client";

import { createContext, useContext } from "react";

export interface AnalyticsContextValue {
  isInitialized: boolean;
  hasConsented: boolean | null;
  giveConsent: () => void;
}

export const AnalyticsContext = createContext<AnalyticsContextValue | null>(
  null,
);

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
}
