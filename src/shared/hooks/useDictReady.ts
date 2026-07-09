"use client";

import { useEffect, useState } from "react";
import { dictReady } from "@/shared/lib/pluralize";

/** Re-renders the calling component once the pluralization dictionary has
 *  loaded, so `pluralize()` calls made during render self-correct if they
 *  first ran before the dictionary was ready (e.g. on a slow connection). */
export function useDictReady(): boolean {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		let cancelled = false;
		dictReady.then(() => {
			if (!cancelled) setReady(true);
		});
		return () => {
			cancelled = true;
		};
	}, []);

	return ready;
}
