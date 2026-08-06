import { GAME_EPOCHS, type GameId } from "@/shared/config";

const MSK_OFFSET_MS = 3 * 60 * 60 * 1000; // UTC+3, no DST
const DAY_MS = 86400000;

export function getMskDateString(): string {
	return new Date(Date.now() + MSK_OFFSET_MS).toISOString().slice(0, 10);
}

export function getMskYesterdayDateString(): string {
	return new Date(Date.now() + MSK_OFFSET_MS - DAY_MS)
		.toISOString()
		.slice(0, 10);
}

export function getMskDayIndex(epoch: Date | string): number {
	const epochMs =
		typeof epoch === "string" ? new Date(epoch).getTime() : epoch.getTime();
	return Math.floor((Date.now() + MSK_OFFSET_MS - epochMs) / DAY_MS);
}

export function msUntilNextMskMidnight(): number {
	const mskNow = new Date(Date.now() + MSK_OFFSET_MS);
	const nextMskMidnight = new Date(mskNow);
	nextMskMidnight.setUTCHours(24, 0, 0, 0);
	return nextMskMidnight.getTime() - mskNow.getTime();
}

/** A game's current puzzle day index, looked up by id — callers don't
 *  need to know or import that game's specific epoch constant. */
export function getGameDay(gameId: GameId): number {
	return getMskDayIndex(GAME_EPOCHS[gameId]);
}

/** The calendar date (UTC midnight) `dayIndex` days after `epoch`. */
export function dateForDayIndex(epoch: string, dayIndex: number): Date {
	return new Date(new Date(epoch).getTime() + dayIndex * DAY_MS);
}

/** The day index for a given `YYYY-MM-DD` date relative to `epoch`. */
export function dayIndexForDate(epoch: string, date: string): number {
	const target = new Date(`${date}T00:00:00Z`).getTime();
	return Math.floor((target - new Date(epoch).getTime()) / DAY_MS);
}
