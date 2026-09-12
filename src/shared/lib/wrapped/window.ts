const MSK_OFFSET_MS = 3 * 60 * 60 * 1000; // UTC+3, no DST

/** Reveal window, as `MM-DD` in Minsk time. Closes at the end of `close`. */
export const WRAPPED_WINDOW = { open: "12-20", close: "01-10" } as const;

/** The Minsk wall-clock date of `nowMs`, as UTC parts of a shifted Date. */
function mskParts(nowMs: number): { year: number; monthDay: string } {
	const d = new Date(nowMs + MSK_OFFSET_MS);
	const month = String(d.getUTCMonth() + 1).padStart(2, "0");
	const day = String(d.getUTCDate()).padStart(2, "0");
	return { year: d.getUTCFullYear(), monthDay: `${month}-${day}` };
}

/** True while the reveal window is open. The window wraps the year end, so
 *  a date qualifies when it is at or after `open`, or at or before `close`. */
export function isWrappedOpen(nowMs: number = Date.now()): boolean {
	const { monthDay } = mskParts(nowMs);
	return monthDay >= WRAPPED_WINDOW.open || monthDay <= WRAPPED_WINDOW.close;
}

/** Which year the recap covers: the current Minsk year, except during the
 *  January tail of the window, which still recaps the year just ended. */
export function wrappedYearFor(nowMs: number = Date.now()): number {
	const { year, monthDay } = mskParts(nowMs);
	return monthDay <= WRAPPED_WINDOW.close ? year - 1 : year;
}

/** Whether `/wrapped` should be reachable: inside the reveal window, or
 *  explicitly unlocked for preview with `?preview=1`. */
export function isWrappedVisible({
	nowMs = Date.now(),
	hasPreview,
}: {
	nowMs?: number;
	hasPreview: boolean;
}): boolean {
	return hasPreview || isWrappedOpen(nowMs);
}
