const MSK_OFFSET_MS = 3 * 60 * 60 * 1000; // UTC+3, no DST

export function getMskDateString(): string {
	return new Date(Date.now() + MSK_OFFSET_MS).toISOString().slice(0, 10);
}

export function getMskYesterdayDateString(): string {
	return new Date(Date.now() + MSK_OFFSET_MS - 86400000)
		.toISOString()
		.slice(0, 10);
}

export function getMskDayIndex(epoch: Date | string): number {
	const epochMs =
		typeof epoch === "string" ? new Date(epoch).getTime() : epoch.getTime();
	return Math.floor((Date.now() + MSK_OFFSET_MS - epochMs) / 86400000);
}

export function msUntilNextMskMidnight(): number {
	const mskNow = new Date(Date.now() + MSK_OFFSET_MS);
	const nextMskMidnight = new Date(mskNow);
	nextMskMidnight.setUTCHours(24, 0, 0, 0);
	return nextMskMidnight.getTime() - mskNow.getTime();
}
