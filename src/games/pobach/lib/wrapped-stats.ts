import { getHistory } from "@/games/pobach/lib/storage";
import { POBACH_EPOCH_DATE } from "@/shared/config";
import { dateForDayIndex } from "@/shared/lib/timezone";
import { longestStreakFromDates } from "@/shared/lib/wrapped/streaks";
import type { GameYearStats, WrappedHighlight } from "@/shared/types/wrapped";

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
	const inYear = history
		.map((r) => ({
			record: r,
			date: dateForDayIndex(POBACH_EPOCH_DATE, r.dayIndex)
				.toISOString()
				.slice(0, 10),
		}))
		.filter(({ date }) => date.startsWith(prefix))
		.sort((a, b) => a.date.localeCompare(b.date));

	if (inYear.length === 0) return emptyStats(year);

	const daysPlayed = [...new Set(inYear.map(({ date }) => date))];
	const daysWon = [
		...new Set(inYear.filter(({ record }) => record.won).map((e) => e.date)),
	];

	const won = inYear.filter(({ record }) => record.won);
	const highlights: WrappedHighlight[] = [];

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

	const ranks = inYear
		.map(({ record }) => record.bestRank)
		.filter((r) => typeof r === "number" && r > 0);
	if (ranks.length > 0) {
		highlights.push({
			key: "bestRank",
			label: "Найбліжэйшае слова",
			value: Math.min(...ranks),
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
