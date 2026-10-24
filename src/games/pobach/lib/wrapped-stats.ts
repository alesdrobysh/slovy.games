import { getHistory } from "@/games/pobach/lib/storage";
import type { HistoryRecord } from "@/games/pobach/types";
import { POBACH_EPOCH_DATE } from "@/shared/config";
import { pluralize } from "@/shared/lib/pluralize";
import { dateForDayIndex } from "@/shared/lib/timezone";
import { agree } from "@/shared/lib/wrapped/format";
import { longestStreakFromDates } from "@/shared/lib/wrapped/streaks";
import type { GameYearStats, WrappedHighlight } from "@/shared/types/wrapped";

/** The word guessed in the most games, counting each game once. */
function mostFrequentGuess(
	records: HistoryRecord[]
): { word: string; games: number } | null {
	const counts = new Map<string, number>();
	for (const record of records) {
		const words = new Set(
			(Array.isArray(record.guesses) ? record.guesses : [])
				.filter(
					(guess) =>
						typeof guess?.word === "string" &&
						guess.word.length > 0 &&
						!guess.isHint
				)
				.map((guess) => guess.word)
		);
		for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);
	}
	return (
		[...counts.entries()]
			.sort(([aWord, aCount], [bWord, bCount]) =>
				bCount === aCount ? aWord.localeCompare(bWord, "be") : bCount - aCount
			)
			.map(([word, games]) => ({ word, games }))[0] ?? null
	);
}

interface Win {
	word: string;
	attempts: number;
	hints: number;
}

/** A won record's secret word is its rank-1 guess. */
function toWin(record: HistoryRecord): Win | null {
	const guesses = Array.isArray(record.guesses) ? record.guesses : [];
	const word = guesses.find((g) => g?.rank === 1)?.word;
	if (typeof word !== "string" || !Number.isFinite(record.attempts)) {
		return null;
	}
	return {
		word,
		attempts: record.attempts,
		hints: guesses.filter((g) => g?.isHint).length,
	};
}

function attemptsCaption({ attempts, hints }: Win): string {
	const tries = `${attempts} ${pluralize(attempts, "спроба")}`;
	return hints === 0
		? `${tries}, без падказак`
		: `${tries}, ${hints} ${pluralize(hints, "падказка")}`;
}

function emptyStats(year: number): GameYearStats {
	return {
		gameId: "pobach",
		year,
		daysPlayed: [],
		daysWon: [],
		longestStreakInYear: 0,
		headline: { value: 0, caption: "" },
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
	let inYear: Array<{ record: HistoryRecord; date: string }>;
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

	// Ordered best-first: fewest attempts, then fewest hints, then earliest.
	const wins = inYear
		.filter(({ record }) => record.won)
		.map(({ record }) => toWin(record))
		.filter((win): win is Win => win !== null)
		.sort((a, b) => a.attempts - b.attempts || a.hints - b.hints);

	const highlights: WrappedHighlight[] = [];

	const best = wins[0];
	if (best) {
		highlights.push({
			key: "bestWin",
			label: "Найлепшая перамога",
			value: best.word,
			caption: attemptsCaption(best),
		});
	}

	const favorite = mostFrequentGuess(inYear.map(({ record }) => record));
	if (favorite) {
		highlights.push({
			key: "favoriteGuess",
			label: "Любімая здагадка",
			value: favorite.word,
			caption: `у ${favorite.games} ${pluralize(favorite.games, "гульня", "locative")}`,
		});
	}

	// With a single win the hardest one is the best one; skip the repeat.
	const hardest = wins.length > 1 ? wins[wins.length - 1] : null;
	if (hardest) {
		highlights.push({
			key: "hardestWin",
			label: "Самая ўпартая перамога",
			value: hardest.word,
			caption: `${hardest.attempts} ${pluralize(hardest.attempts, "спроба")}`,
		});
	}

	highlights.push({
		key: "winRate",
		label: "Працэнт перамог",
		value: `${Math.round((daysWon.length / daysPlayed.length) * 100)}%`,
		caption: `${daysWon.length} з ${daysPlayed.length} ${pluralize(daysPlayed.length, "гульня", "genitive")}`,
	});

	return {
		gameId: "pobach",
		year,
		daysPlayed,
		daysWon,
		longestStreakInYear: longestStreakFromDates(daysPlayed),
		headline: {
			value: daysWon.length,
			caption: `${pluralize(daysWon.length, "слова")} ${agree(daysWon.length, "адгадана", "адгаданы", "адгадана")}`,
		},
		highlights,
	};
}
