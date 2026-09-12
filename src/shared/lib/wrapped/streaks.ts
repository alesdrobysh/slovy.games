const DAY_MS = 86400000;

/** Longest run of consecutive calendar days in a set of `YYYY-MM-DD` dates.
 *  Input may be unsorted and may contain duplicates or junk. */
export function longestStreakFromDates(dates: string[]): number {
	const days = [
		...new Set(
			dates
				.map((d) => Date.parse(`${d}T00:00:00Z`))
				.filter((ms) => Number.isFinite(ms))
		),
	].sort((a, b) => a - b);

	if (days.length === 0) return 0;

	let longest = 1;
	let run = 1;
	for (let i = 1; i < days.length; i++) {
		run = days[i] - days[i - 1] === DAY_MS ? run + 1 : 1;
		if (run > longest) longest = run;
	}
	return longest;
}
