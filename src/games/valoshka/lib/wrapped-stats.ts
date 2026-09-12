import { RANKS } from "@/games/valoshka/lib/scoring";
import { loadStats } from "@/games/valoshka/lib/storage";
import { longestStreakFromDates } from "@/shared/lib/wrapped/streaks";
import type { GameYearStats, WrappedHighlight } from "@/shared/types/wrapped";

const TOP_RANK_IDX = RANKS.length - 1;

function emptyStats(year: number): GameYearStats {
	return {
		gameId: "valoshka",
		year,
		daysPlayed: [],
		daysWon: [],
		longestStreakInYear: 0,
		highlights: [],
	};
}

/** Валошка activity for one calendar year. `totalWordsFound` and
 *  `longestStreak` in storage are all-time, so both are recomputed from
 *  `perDateBest` and `datesPlayed` instead. */
export function getWrappedStats(year: number): GameYearStats {
	let stats: ReturnType<typeof loadStats>;
	try {
		stats = loadStats();
	} catch {
		return emptyStats(year);
	}

	const prefix = `${year}-`;
	// localStorage is user-writable: a non-string entry would make
	// `startsWith` throw, so narrow to real date strings before using them.
	const daysPlayed = [
		...new Set(
			(stats.datesPlayed ?? []).filter(
				(d): d is string => typeof d === "string" && d.startsWith(prefix)
			)
		),
	].sort();

	if (daysPlayed.length === 0) return emptyStats(year);

	const bests = stats.perDateBest ?? {};
	const inYearBests = daysPlayed
		.map((date) => ({ date, best: bests[date] }))
		// Same reason: a malformed per-date entry must be skipped, not trusted
		// into `Math.max` or a sum, where it would poison every highlight.
		.filter(
			(
				e
			): e is { date: string; best: { rankIdx: number; foundCount: number } } =>
				Number.isFinite(e.best?.rankIdx) && Number.isFinite(e.best?.foundCount)
		);

	const daysWon = inYearBests
		.filter(({ best }) => best.rankIdx >= TOP_RANK_IDX)
		.map(({ date }) => date);

	const highlights: WrappedHighlight[] = [];

	if (inYearBests.length > 0) {
		highlights.push({
			key: "wordsFound",
			label: "Знойдзена слоў",
			value: inYearBests.reduce((sum, { best }) => sum + best.foundCount, 0),
		});
		highlights.push({
			key: "bestRank",
			label: "Найвышэйшы ранг",
			value:
				RANKS[
					Math.min(
						Math.max(...inYearBests.map(({ best }) => best.rankIdx)),
						TOP_RANK_IDX
					)
				].name,
		});
		highlights.push({
			key: "vasiliokDays",
			label: "Дзён да Валошкі",
			value: daysWon.length,
		});
	}

	return {
		gameId: "valoshka",
		year,
		daysPlayed,
		daysWon,
		longestStreakInYear: longestStreakFromDates(daysPlayed),
		highlights,
	};
}
