import type { GameStats, SavedProgress } from "../types";
import { DEFAULT_STATS, saveProgress, saveStats } from "./storage";
import { getWrappedStats } from "./wrapped-stats";

const TITLES = {
	"art-1": "Грунвальдская бітва",
	"art-2": "Фотасінтэз",
	"art-3": "Мінск",
};

function game(
	date: string,
	articleId: string,
	over: Partial<SavedProgress> = {}
): SavedProgress {
	return {
		date,
		articleId,
		foundLemmas: [],
		guesses: ["горад", "рака"],
		won: true,
		givenUp: false,
		hintsUsed: 0,
		...over,
	};
}

function seed(games: SavedProgress[], over: Partial<GameStats> = {}): void {
	for (const g of games) saveProgress(g);
	saveStats({
		...DEFAULT_STATS,
		datesPlayed: games.map((g) => g.date),
		datesWon: games.filter((g) => g.won).map((g) => g.date),
		...over,
	});
}

beforeEach(() => {
	localStorage.clear();
});

describe("sakretna getWrappedStats", () => {
	it("returns empty stats when nothing was played", () => {
		expect(getWrappedStats(2026, TITLES)).toEqual({
			gameId: "sakretna",
			year: 2026,
			daysPlayed: [],
			daysWon: [],
			longestStreakInYear: 0,
			headline: { value: 0, caption: "" },
			highlights: [],
		});
	});

	it("keeps only days inside the requested year", () => {
		seed([game("2026-12-31", "art-1"), game("2027-01-01", "art-2")]);
		const stats = getWrappedStats(2026, TITLES);
		expect(stats.daysPlayed).toEqual(["2026-12-31"]);
		expect(stats.daysWon).toEqual(["2026-12-31"]);
		expect(stats.headline.value).toBe(1);
	});

	it("reports best and hardest investigations, clean wins and the opener", () => {
		seed([
			game("2026-08-01", "art-1", {
				guesses: ["горад", "бітва", "1410"],
			}),
			game("2026-08-02", "art-2", {
				guesses: ["горад", ...Array(20).fill("x")],
				hintsUsed: 2,
			}),
			game("2026-08-03", "art-3", {
				guesses: ["рака"],
				won: false,
				givenUp: true,
			}),
		]);
		const stats = getWrappedStats(2026, TITLES);
		const byKey = Object.fromEntries(stats.highlights.map((h) => [h.key, h]));

		expect(stats.headline.value).toBe(2);
		expect(byKey.bestWin.value).toBe("Грунвальдская бітва");
		expect(byKey.bestWin.caption).toContain("без падказак");
		expect(byKey.hardestWin.value).toBe("Фотасінтэз");
		expect(byKey.noHintWins.value).toBe(1);
		expect(byKey.noHintWins.caption).toMatch(/^з 2 /);
		expect(byKey.openingWord.value).toBe("горад");
	});

	it("still counts a win whose article title is unknown", () => {
		seed([game("2026-08-01", "missing")]);
		const stats = getWrappedStats(2026, TITLES);
		expect(stats.headline.value).toBe(1);
		const keys = stats.highlights.map((h) => h.key);
		expect(keys).not.toContain("bestWin");
		expect(keys).toContain("noHintWins");
	});

	it("survives malformed stats instead of throwing", () => {
		localStorage.setItem(
			"sakretna_stats",
			JSON.stringify({ datesPlayed: ["2026-08-01", 7, null], datesWon: "x" })
		);
		const stats = getWrappedStats(2026, TITLES);
		expect(stats.daysPlayed).toEqual(["2026-08-01"]);
		expect(stats.daysWon).toEqual([]);
	});
});
