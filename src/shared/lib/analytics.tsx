"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHP } from "posthog-js/react";
import { useEffect, useState } from "react";
import { useTheme } from "@/shared/hooks/useTheme";

function getPostHogKey(): string {
	if (typeof window === "undefined") return "";
	return process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
}

function PostHogInit({ children }: { children: React.ReactNode }) {
	const { theme } = useTheme();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const key = getPostHogKey();
		if (!key) {
			setReady(true);
			return;
		}

		posthog.init(key, {
			api_host: "/a",
			ui_host: "https://eu.i.posthog.com",
			person_profiles: "identified_only",
			persistence: "localStorage",
			loaded: () => {
				posthog.register({ theme });
			},
		});

		setReady(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [theme]);

	useEffect(() => {
		if (ready) {
			posthog.register({ theme });
		}
	}, [theme, ready]);

	if (!ready) return children;

	return <PHP client={posthog}>{children}</PHP>;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
	return <PostHogInit>{children}</PostHogInit>;
}
