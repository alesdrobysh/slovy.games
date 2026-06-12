"use client";

import { useEffect, useState } from "react";
import { msUntilNextMskMidnight } from "@/shared/lib/timezone";

function formatDuration(ms: number): string {
	const totalSeconds = Math.max(0, Math.floor(ms / 1000));
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function useCountdown(): string {
	const [timeLeft, setTimeLeft] = useState("--:--:--");

	useEffect(() => {
		function update() {
			setTimeLeft(formatDuration(msUntilNextMskMidnight()));
		}

		update();
		const interval = setInterval(update, 1000);
		return () => clearInterval(interval);
	}, []);

	return timeLeft;
}
