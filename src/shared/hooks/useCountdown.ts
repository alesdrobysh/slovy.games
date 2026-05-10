"use client";

import { useEffect, useState } from "react";

function msUntilNextMidnightUtc(): number {
	const now = new Date();
	const tomorrow = new Date(now);
	tomorrow.setUTCHours(24, 0, 0, 0);
	return tomorrow.getTime() - now.getTime();
}

function formatDuration(ms: number): string {
	const totalSeconds = Math.max(0, Math.floor(ms / 1000));
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function useCountdown(): string {
	const [timeLeft, setTimeLeft] = useState(() =>
		formatDuration(msUntilNextMidnightUtc()),
	);

	useEffect(() => {
		function update() {
			setTimeLeft(formatDuration(msUntilNextMidnightUtc()));
		}

		update();
		const interval = setInterval(update, 1000);
		return () => clearInterval(interval);
	}, []);

	return timeLeft;
}
