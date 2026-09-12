"use client";

import { useEffect, useState } from "react";

/** Animate 0 → `target` over `durationMs`, unless the viewer prefers
 *  reduced motion, in which case it returns the target immediately. */
export function useCountUp(target: number, durationMs = 700): number {
	const [value, setValue] = useState(target);

	useEffect(() => {
		const reduced =
			window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
		if (reduced || target <= 0) {
			setValue(target);
			return;
		}

		let frame = 0;
		const start = performance.now();
		const tick = (now: number) => {
			const progress = Math.min((now - start) / durationMs, 1);
			setValue(Math.round(target * progress));
			if (progress < 1) frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [target, durationMs]);

	return value;
}
