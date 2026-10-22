import {
	getMskDateString,
	getMskYesterdayDateString,
} from "@/shared/lib/timezone";
import type { SavedProgress } from "../types";
import {
	DEFAULT_STATS,
	loadProgress,
	loadStats,
	recordResult,
	saveProgress,
} from "./storage";

function progress(date: string, won: boolean): SavedProgress {
	return {
		date,
		articleId: "test-article",
		foundLemmas: won ? ["адказ"] : [],
		guesses: won ? ["адказ"] : [],
		won,
		givenUp: !won,
		hintsUsed: 0,
	};
}

it("migrates corrected lemmas without losing guesses or counting a form twice", () => {
	const saved = {
		...progress("2026-10-22", false),
		foundLemmas: ["мёбіуса", "мёбіус", "стужка"],
		guesses: ["Мёбіуса", "Мёбіус", "стужка"],
	};
	saveProgress(saved);
	expect(loadProgress(saved.date)).toEqual({
		...saved,
		foundLemmas: ["мёбіус", "стужка"],
	});
});

describe("recordResult streaks", () => {
	beforeEach(() => localStorage.clear());

	it("does not count a surrender as a win streak", () => {
		recordResult(progress(getMskDateString(), false));

		expect(loadStats()).toEqual({
			...DEFAULT_STATS,
			totalPlayed: 1,
		});
	});

	it("breaks a win streak when the latest result is a surrender", () => {
		recordResult(progress(getMskYesterdayDateString(), true));
		recordResult(progress(getMskDateString(), false));

		expect(loadStats()).toEqual({
			...DEFAULT_STATS,
			datesPlayed: [getMskYesterdayDateString(), getMskDateString()].sort(),
			datesWon: [getMskYesterdayDateString()],
			totalPlayed: 2,
			totalWins: 1,
			currentStreak: 0,
			longestStreak: 1,
		});
	});
});
