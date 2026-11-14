"use client";

import { useEffect, useState } from "react";
import { formatToday } from "@/shared/lib/formatDate";
import { msUntilNextMskMidnight } from "@/shared/lib/timezone";

/** Keep static HTML independent of the build date and follow Minsk midnight. */
export function useTodayLabel(): string {
	const [label, setLabel] = useState("");

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout>;
		function update() {
			clearTimeout(timer);
			setLabel(formatToday());
			timer = setTimeout(update, msUntilNextMskMidnight());
		}

		update();
		document.addEventListener("visibilitychange", update);
		window.addEventListener("pageshow", update);
		return () => {
			clearTimeout(timer);
			document.removeEventListener("visibilitychange", update);
			window.removeEventListener("pageshow", update);
		};
	}, []);

	return label;
}
