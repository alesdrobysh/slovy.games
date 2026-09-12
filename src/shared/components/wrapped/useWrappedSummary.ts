"use client";

import { useEffect, useState } from "react";
import { collectWrappedStats } from "@/shared/lib/wrapped/providers";
import { computeWrappedSummary } from "@/shared/lib/wrapped/summary";
import type { WrappedSummary } from "@/shared/types/wrapped";

/** Read every game's year stats once on mount. Returns `null` on the first
 *  render so the server and client markup match — localStorage is not
 *  available during SSR, the same approach `useHubState` takes. */
export function useWrappedSummary(year: number): WrappedSummary | null {
	const [summary, setSummary] = useState<WrappedSummary | null>(null);

	useEffect(() => {
		setSummary(computeWrappedSummary(collectWrappedStats(year), year));
	}, [year]);

	return summary;
}
