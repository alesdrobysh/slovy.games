"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useCallback, useEffect, useState } from "react";
import { AnalyticsContext } from "@/games/pobach/providers/AnalyticsContext";
import { initPostHog } from "@/games/pobach/infrastructure/analytics/posthog";
import { ConsentRepository } from "@/games/pobach/infrastructure/repositories/ConsentRepository";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);

  // 1. Check consent on mount
  useEffect(() => {
    const consented = ConsentRepository.hasConsented();
    setHasConsented(consented);

    if (consented && !isInitialized) {
      if (initPostHog()) {
        setIsInitialized(true);
      }
    }
  }, [isInitialized]);

  // 2. Action to give consent
  const giveConsent = useCallback(() => {
    ConsentRepository.saveConsent();
    setHasConsented(true);

    // Initialize immediately
    if (initPostHog()) {
      setIsInitialized(true);
    }
  }, []);

  const value = {
    isInitialized,
    hasConsented,
    giveConsent,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      <PHProvider client={posthog}>{children}</PHProvider>
    </AnalyticsContext.Provider>
  );
}
