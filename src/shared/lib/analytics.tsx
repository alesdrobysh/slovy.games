"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useTheme } from "@/shared/hooks/useTheme";

const CONSENT_KEY = "cookie_consent";

export interface AnalyticsContextValue {
	isInitialized: boolean;
	hasConsented: boolean | null;
	giveConsent: () => void;
}

export const AnalyticsContext = createContext<AnalyticsContextValue | null>(
	null
);

export function useAnalytics(): AnalyticsContextValue {
	const ctx = useContext(AnalyticsContext);
	if (!ctx) throw new Error("useAnalytics must be used within PostHogProvider");
	return ctx;
}

function initPostHog(): boolean {
	const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
	if (!key) return false;
	// biome-ignore lint/suspicious/noExplicitAny: posthog internal property
	if ((posthog as any).__loaded) return true;
	posthog.init(key, {
		api_host: "/a",
		ui_host: "https://eu.i.posthog.com",
		person_profiles: "identified_only",
		persistence: "localStorage",
		autocapture: true,
		capture_pageview: true,
		capture_pageleave: true,
	});
	return true;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
	const { theme } = useTheme();
	const [isInitialized, setIsInitialized] = useState(false);
	const [hasConsented, setHasConsented] = useState<boolean | null>(null);

	useEffect(() => {
		const consented = localStorage.getItem(CONSENT_KEY) === "1";
		setHasConsented(consented);
		if (consented && initPostHog()) {
			setIsInitialized(true);
		}
	}, []);

	useEffect(() => {
		if (isInitialized) {
			posthog.register({ theme });
		}
	}, [theme, isInitialized]);

	const giveConsent = useCallback(() => {
		localStorage.setItem(CONSENT_KEY, "1");
		setHasConsented(true);
		if (initPostHog()) {
			setIsInitialized(true);
			posthog.capture("cookie_consent_given");
		}
	}, []);

	return (
		<AnalyticsContext.Provider
			value={{ isInitialized, hasConsented, giveConsent }}
		>
			<PHProvider client={posthog}>{children}</PHProvider>
		</AnalyticsContext.Provider>
	);
}
