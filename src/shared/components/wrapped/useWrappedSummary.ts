"use client";

import { useEffect, useState } from "react";
import { dictReady } from "@/shared/lib/pluralize";
import {
	collectWrappedStats,
	type WrappedProviderContext,
} from "@/shared/lib/wrapped/providers";
import { computeWrappedSummary } from "@/shared/lib/wrapped/summary";
import type { WrappedSummary } from "@/shared/types/wrapped";

/** Read every game's year stats once on mount. Returns `null` on the first
 *  render so the server and client markup match — localStorage is not
 *  available during SSR, the same approach `useHubState` takes. Providers
 *  write pluralized captions, so this waits for the dictionary first. */
export function useWrappedSummary(
	year: number,
	context: WrappedProviderContext
): WrappedSummary | null {
	const [summary, setSummary] = useState<WrappedSummary | null>(null);

	useEffect(() => {
		let cancelled = false;
		dictReady.then(() => {
			if (cancelled) return;
			setSummary(
				computeWrappedSummary(collectWrappedStats(year, context), year)
			);
		});
		return () => {
			cancelled = true;
		};
	}, [year, context]);

	return summary;
}
