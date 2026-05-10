"use client";

import { useEffect, useState } from "react";

export function useAnimatedValue(target: number, duration = 900): number {
	const [value, setValue] = useState(0);

	useEffect(() => {
		let raf: number;
		const start = performance.now();

		const animate = (now: number) => {
			const t = Math.min((now - start) / duration, 1);
			setValue(Math.round(target * (1 - (1 - t) ** 3)));
			if (t < 1) raf = requestAnimationFrame(animate);
		};

		raf = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(raf);
	}, [target, duration]);

	return value;
}
