import type { GameId } from "@/shared/config";
import type { GameYearStats, WrappedSummary } from "@/shared/types/wrapped";
import { WRAPPED_GAME_ORDER } from "./providers";
import { longestStreakFromDates } from "./streaks";

/** Below this many active days the deck collapses and sharing is disabled. */
export const WRAPPED_THIN_DATA_DAYS = 5;

export function computeWrappedSummary(
	stats: GameYearStats[],
	year: number
): WrappedSummary {
	// Sorted into canonical order so slide order and the game-of-the-year
	// tie-break do not depend on the order storage happened to be read in.
	const perGame = stats
		.filter((g) => g.daysPlayed.length > 0)
		.sort(
			(a, b) =>
				WRAPPED_GAME_ORDER.indexOf(a.gameId) -
				WRAPPED_GAME_ORDER.indexOf(b.gameId)
		);

	const activeDays = [...new Set(perGame.flatMap((g) => g.daysPlayed))].sort();

	// Per-month day counts are only needed to pick the busiest month, so they
	// stay local rather than widening the summary with an unused field.
	const daysPerMonth = Array(12).fill(0) as number[];
	for (const day of activeDays) {
		const month = Number(day.slice(5, 7));
		if (month >= 1 && month <= 12) daysPerMonth[month - 1] += 1;
	}

	let busiestMonth: WrappedSummary["busiestMonth"] = null;
	daysPerMonth.forEach((days, idx) => {
		if (days > 0 && (busiestMonth === null || days > busiestMonth.days)) {
			busiestMonth = { month: idx + 1, days };
		}
	});

	let gameOfTheYear: GameId | null = null;
	let best: GameYearStats | null = null;
	for (const g of perGame) {
		if (
			best === null ||
			g.daysPlayed.length > best.daysPlayed.length ||
			(g.daysPlayed.length === best.daysPlayed.length &&
				g.daysWon.length > best.daysWon.length)
		) {
			best = g;
			gameOfTheYear = g.gameId;
		}
	}

	return {
		year,
		activeDays,
		gamesFinished: perGame.reduce((sum, g) => sum + g.daysPlayed.length, 0),
		longestStreakAnyGame: longestStreakFromDates(activeDays),
		busiestMonth,
		gameOfTheYear,
		perGame,
		isThin: activeDays.length < WRAPPED_THIN_DATA_DAYS,
	};
}
