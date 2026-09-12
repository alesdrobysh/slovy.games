import type { GameStats } from "@/games/valoshka/types";
import { getWrappedStats } from "./wrapped-stats";

const STATS_KEY = "vulej_stats";

function seed(over: Partial<GameStats>): void {
	const stats: GameStats = {
		datesPlayed: [],
		currentStreak: 0,
		longestStreak: 0,
		topRankCount: 0,
		totalWordsFound: 0,
		perDateBest: {},
		...over,
	};
	localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

beforeEach(() => {
	localStorage.clear();
});

describe("valoshka getWrappedStats", () => {
	it("returns empty stats when storage is missing", () => {
		expect(getWrappedStats(2026)).toEqual({
			gameId: "valoshka",
			year: 2026,
			daysPlayed: [],
			daysWon: [],
			longestStreakInYear: 0,
			highlights: [],
		});
	});

	it("returns empty stats when storage is corrupt", () => {
		localStorage.setItem(STATS_KEY, "{not json");
		expect(getWrappedStats(2026).daysPlayed).toEqual([]);
	});

	it("keeps only dates inside the requested year, sorted", () => {
		seed({ datesPlayed: ["2027-01-02", "2026-08-05", "2026-07-30"] });
		expect(getWrappedStats(2026).daysPlayed).toEqual([
			"2026-07-30",
			"2026-08-05",
		]);
	});

	it("computes the in-year streak", () => {
		seed({ datesPlayed: ["2026-08-01", "2026-08-02", "2026-08-09"] });
		expect(getWrappedStats(2026).longestStreakInYear).toBe(2);
	});

	it("sums words found from per-date bests inside the year only", () => {
		seed({
			datesPlayed: ["2026-08-01", "2027-01-01"],
			perDateBest: {
				"2026-08-01": { rankIdx: 3, foundCount: 12 },
				"2027-01-01": { rankIdx: 1, foundCount: 99 },
			},
			totalWordsFound: 111,
		});
		const byKey = Object.fromEntries(
			getWrappedStats(2026).highlights.map((h) => [h.key, h.value])
		);
		expect(byKey.wordsFound).toBe(12);
	});

	it("omits the words highlight when no per-date data survives", () => {
		seed({ datesPlayed: ["2026-08-01"], perDateBest: {} });
		const keys = getWrappedStats(2026).highlights.map((h) => h.key);
		expect(keys).not.toContain("wordsFound");
	});

	it("survives malformed entries instead of throwing", () => {
		localStorage.setItem(
			STATS_KEY,
			JSON.stringify({
				datesPlayed: ["2026-08-01", 20260802, null, "2026-08-03"],
				perDateBest: {
					"2026-08-01": { rankIdx: 2, foundCount: 9 },
					"2026-08-03": { rankIdx: "nope", foundCount: null },
				},
			})
		);
		const stats = getWrappedStats(2026);
		expect(stats.daysPlayed).toEqual(["2026-08-01", "2026-08-03"]);
		const byKey = Object.fromEntries(
			stats.highlights.map((h) => [h.key, h.value])
		);
		expect(byKey.wordsFound).toBe(9);
	});

	it("counts days that reached the top rank as wins", () => {
		seed({
			datesPlayed: ["2026-08-01", "2026-08-02"],
			perDateBest: {
				"2026-08-01": { rankIdx: 99, foundCount: 40 },
				"2026-08-02": { rankIdx: 0, foundCount: 3 },
			},
		});
		const stats = getWrappedStats(2026);
		expect(stats.daysWon).toEqual(["2026-08-01"]);
		const byKey = Object.fromEntries(
			stats.highlights.map((h) => [h.key, h.value])
		);
		expect(byKey.vasiliokDays).toBe(1);
	});
});
