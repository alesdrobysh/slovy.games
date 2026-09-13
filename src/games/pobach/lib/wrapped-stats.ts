import { getHistory } from "@/games/pobach/lib/storage";
import { POBACH_EPOCH_DATE } from "@/shared/config";
import { dateForDayIndex } from "@/shared/lib/timezone";
import { longestStreakFromDates } from "@/shared/lib/wrapped/streaks";
import type { GameYearStats, WrappedHighlight } from "@/shared/types/wrapped";

function mostFrequentGuess(
	guesses: Array<{ word: string; rank: number }>
): { word: string; count: number } | null {
	const counts = new Map<string, number>();
	for (const guess of guesses) {
		counts.set(guess.word, (counts.get(guess.word) ?? 0) + 1);
	}
	return (
		[...counts.entries()]
			.sort(([aWord, aCount], [bWord, bCount]) =>
				bCount === aCount ? aWord.localeCompare(bWord, "be") : bCount - aCount
			)
			.map(([word, count]) => ({ word, count }))[0] ?? null
	);
}

function emptyStats(year: number): GameYearStats {
	return {
		gameId: "pobach",
		year,
		daysPlayed: [],
		daysWon: [],
		longestStreakInYear: 0,
		highlights: [],
	};
}

/** Побач activity for one calendar year, derived from the dated history
 *  records — never from `stats`, which is an all-time aggregate. */
export function getWrappedStats(year: number): GameYearStats {
	let history: ReturnType<typeof getHistory>;
	try {
		history = getHistory();
	} catch {
		return emptyStats(year);
	}

	const prefix = `${year}-`;
	let inYear: Array<{ record: ReturnType<typeof getHistory>[0]; date: string }>;
	try {
		inYear = history
			.filter((r) => Number.isFinite(r.dayIndex))
			.map((r) => ({
				record: r,
				date: dateForDayIndex(POBACH_EPOCH_DATE, r.dayIndex)
					.toISOString()
					.slice(0, 10),
			}))
			.filter(({ date }) => date.startsWith(prefix))
			.sort((a, b) => a.date.localeCompare(b.date));
	} catch {
		return emptyStats(year);
	}

	if (inYear.length === 0) return emptyStats(year);

	const daysPlayed = [...new Set(inYear.map(({ date }) => date))];
	const daysWon = [
		...new Set(inYear.filter(({ record }) => record.won).map((e) => e.date)),
	];

	const won = inYear.filter(({ record }) => record.won);
	const highlights: WrappedHighlight[] = [];
	const playerGuesses = inYear.flatMap(({ record }) =>
		Array.isArray(record.guesses)
			? record.guesses.filter(
					(guess) =>
						typeof guess?.word === "string" &&
						guess.word.length > 0 &&
						Number.isFinite(guess.rank) &&
						!guess.isHint
				)
			: []
	);

	if (won.length > 0) {
		highlights.push({
			key: "bestAttempts",
			label: "Найменш спробаў",
			value: Math.min(...won.map(({ record }) => record.attempts)),
		});
	}

	highlights.push({
		key: "winRate",
		label: "Адгадана",
		value: `${Math.round((daysWon.length / daysPlayed.length) * 100)}%`,
	});

	const favorite = mostFrequentGuess(playerGuesses);
	if (favorite) {
		highlights.push({
			key: "favoriteGuess",
			label: "Любімая здагадка",
			value: `${favorite.word} ×${favorite.count}`,
		});
	}

	const closest = playerGuesses
		.filter((guess) => guess.rank > 1)
		.sort((a, b) => a.rank - b.rank || a.word.localeCompare(b.word, "be"))[0];
	if (closest) {
		highlights.push({
			key: "closestGuess",
			label: "Найлепшая здагадка",
			value: `${closest.word} · №${closest.rank}`,
		});
	}

	return {
		gameId: "pobach",
		year,
		daysPlayed,
		daysWon,
		longestStreakInYear: longestStreakFromDates(daysPlayed),
		highlights,
	};
}
