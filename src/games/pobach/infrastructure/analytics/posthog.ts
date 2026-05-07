import posthog from "posthog-js";

export const COOKIE_CONSENT_KEY = "pobach_cookie_consent";

const posthogConfig = {
  api_host: "/a",
  ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
  person_profiles: "identified_only" as const,
  persistence: "localStorage" as const,
  autocapture: true,
  capture_pageview: true,
  capture_pageleave: true,
};

export function initPostHog(): boolean {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return false;
  }
  // Prevent double initialization
  // biome-ignore lint/suspicious/noExplicitAny: posthog internal property not in type definitions
  if ((posthog as any).__loaded) {
    return true;
  }

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, posthogConfig);
  return true;
}
