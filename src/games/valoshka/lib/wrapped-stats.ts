import { RANKS } from "@/games/valoshka/lib/scoring";
import { loadProgress, loadStats } from "@/games/valoshka/lib/storage";
import { pluralize } from "@/shared/lib/pluralize";
import { agree, formatDayMonth } from "@/shared/lib/wrapped/format";
import { longestStreakFromDates } from "@/shared/lib/wrapped/streaks";
import type { GameYearStats, WrappedHighlight } from "@/shared/types/wrapped";

const TOP_RANK_IDX = RANKS.length - 1;
const LONGEST_WORDS_SHOWN = 3;

/** Words found on each played day, from the per-day progress records. */
function foundWordsByDay(days: string[]): string[][] {
	return days.map((date) => {
		const foundWords = loadProgress(date)?.foundWords;
		if (!Array.isArray(foundWords)) return [];
		return [
			...new Set(
				foundWords.filter(
					(word): word is string => typeof word === "string" && word.length > 0
				)
			),
		];
	});
}

function mostFrequentWord(
	byDay: string[][]
): { word: string; days: number } | null {
	const counts = new Map<string, number>();
	for (const words of byDay) {
		for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);
	}
	return (
		[...counts.entries()]
			.sort(([aWord, aCount], [bWord, bCount]) =>
				bCount === aCount ? aWord.localeCompare(bWord, "be") : bCount - aCount
			)
			.map(([word, days]) => ({ word, days }))[0] ?? null
	);
}

function emptyStats(year: number): GameYearStats {
	return {
		gameId: "valoshka",
		year,
		daysPlayed: [],
		daysWon: [],
		longestStreakInYear: 0,
		headline: { value: 0, caption: "" },
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
				Number.isFinite(e.best?.rankIdx) &&
				e.best?.rankIdx >= 0 &&
				Number.isFinite(e.best?.foundCount)
		);

	const daysWon = inYearBests
		.filter(({ best }) => best.rankIdx >= TOP_RANK_IDX)
		.map(({ date }) => date);

	const wordsFound = inYearBests.reduce(
		(sum, { best }) => sum + best.foundCount,
		0
	);

	const highlights: WrappedHighlight[] = [];
	const byDay = foundWordsByDay(daysPlayed);

	const collection = [...new Set(byDay.flat())];
	if (collection.length > 0) {
		highlights.push({
			key: "collection",
			label: "Асабістая калекцыя",
			value: collection.length,
			caption: "унікальныя словы, найдаўжэйшыя:",
			words: collection
				.sort((a, b) => b.length - a.length || a.localeCompare(b, "be"))
				.slice(0, LONGEST_WORDS_SHOWN),
		});
	}

	// Earliest day wins a tie: `inYearBests` is in date order and the
	// reduce only replaces on a strictly larger count.
	const bestDay = inYearBests.reduce<(typeof inYearBests)[number] | null>(
		(top, e) => (top && top.best.foundCount >= e.best.foundCount ? top : e),
		null
	);
	if (bestDay && bestDay.best.foundCount > 0) {
		const count = bestDay.best.foundCount;
		highlights.push({
			key: "bestDay",
			label: "Самы ўраджайны дзень",
			value: `${count} ${pluralize(count, "слова")}`,
			caption: formatDayMonth(bestDay.date),
		});
	}

	const favorite = mostFrequentWord(byDay);
	if (favorite) {
		highlights.push({
			key: "favoriteWord",
			label: "Частая знаходка",
			value: favorite.word,
			caption: `${favorite.days} ${pluralize(favorite.days, "дзень")}`,
		});
	}

	if (inYearBests.length > 0) {
		const topIdx = Math.min(
			Math.max(...inYearBests.map(({ best }) => best.rankIdx)),
			TOP_RANK_IDX
		);
		const times = inYearBests.filter(
			({ best }) => Math.min(best.rankIdx, TOP_RANK_IDX) === topIdx
		).length;
		highlights.push({
			key: "bestRank",
			label: "Найвышэйшы ранг",
			value: RANKS[topIdx].name,
			caption: `${times} ${pluralize(times, "раз")} за год`,
		});
	}

	return {
		gameId: "valoshka",
		year,
		daysPlayed,
		daysWon,
		longestStreakInYear: longestStreakFromDates(daysPlayed),
		headline: {
			value: wordsFound,
			caption: `${pluralize(wordsFound, "слова")} ${agree(wordsFound, "знойдзена", "знойдзены", "знойдзена")}`,
		},
		highlights,
	};
}
