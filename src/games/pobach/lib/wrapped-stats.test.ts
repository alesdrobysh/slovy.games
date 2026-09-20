import type { HistoryRecord, StorageV2 } from "@/games/pobach/types";
import { POBACH_EPOCH_DATE } from "@/shared/config";
import { dayIndexForDate } from "@/shared/lib/timezone";
import { getWrappedStats } from "./wrapped-stats";

const STORAGE_KEY = "pobach_storage";

function record(
	date: string,
	over: Partial<HistoryRecord> = {}
): HistoryRecord {
	const dayIndex = dayIndexForDate(POBACH_EPOCH_DATE, date);
	return {
		dayIndex,
		won: true,
		attempts: 5,
		bestRank: 1,
		completedAt: Date.parse(`${date}T12:00:00Z`),
		guesses: [],
		...over,
	};
}

function seed(records: HistoryRecord[]): void {
	const data: Pick<StorageV2, "version" | "history"> & { stats: unknown } = {
		version: 2,
		history: Object.fromEntries(records.map((r) => [String(r.dayIndex), r])),
		stats: {},
	};
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

beforeEach(() => {
	localStorage.clear();
});

describe("pobach getWrappedStats", () => {
	it("returns empty stats when storage is missing", () => {
		const stats = getWrappedStats(2026);
		expect(stats).toEqual({
			gameId: "pobach",
			year: 2026,
			daysPlayed: [],
			daysWon: [],
			longestStreakInYear: 0,
			highlights: [],
		});
	});

	it("returns empty stats when storage is corrupt", () => {
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		try {
			localStorage.setItem(STORAGE_KEY, "{not json");
			expect(getWrappedStats(2026).daysPlayed).toEqual([]);
		} finally {
			spy.mockRestore();
		}
	});

	it("skips records with non-finite dayIndex and returns good records", () => {
		const goodRecord = record("2026-03-05");
		const badRecord = {
			dayIndex: NaN,
			won: true,
			attempts: 5,
			bestRank: 1,
			completedAt: Date.now(),
			guesses: [],
		};
		const anotherGood = record("2026-03-10");
		const data: Pick<StorageV2, "version" | "history"> & { stats: unknown } = {
			version: 2,
			history: {
				"1": goodRecord,
				"2": badRecord as unknown as HistoryRecord,
				"3": anotherGood,
			},
			stats: {},
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		expect(getWrappedStats(2026).daysPlayed).toEqual([
			"2026-03-05",
			"2026-03-10",
		]);
	});

	it("converts day indices to dates and sorts them", () => {
		seed([record("2026-03-05"), record("2026-02-01")]);
		expect(getWrappedStats(2026).daysPlayed).toEqual([
			"2026-02-01",
			"2026-03-05",
		]);
	});

	it("keeps only days inside the requested year", () => {
		seed([record("2026-12-31"), record("2027-01-01")]);
		expect(getWrappedStats(2026).daysPlayed).toEqual(["2026-12-31"]);
		expect(getWrappedStats(2027).daysPlayed).toEqual(["2027-01-01"]);
	});

	it("separates wins from losses", () => {
		seed([
			record("2026-03-01", { won: true }),
			record("2026-03-02", { won: false }),
		]);
		const stats = getWrappedStats(2026);
		expect(stats.daysPlayed).toEqual(["2026-03-01", "2026-03-02"]);
		expect(stats.daysWon).toEqual(["2026-03-01"]);
	});

	it("computes the in-year streak", () => {
		seed([record("2026-03-01"), record("2026-03-02"), record("2026-03-09")]);
		expect(getWrappedStats(2026).longestStreakInYear).toBe(2);
	});

	it("reports fewest attempts, win rate, favorite and closest player guesses", () => {
		seed([
			record("2026-03-01", {
				won: true,
				attempts: 12,
				bestRank: 1,
				guesses: [
					{ word: "лес", rank: 40 },
					{ word: "сярэдзіна", rank: 1 },
				],
			}),
			record("2026-03-02", {
				won: true,
				attempts: 4,
				bestRank: 1,
				guesses: [
					{ word: "лес", rank: 2 },
					{ word: "падказка", rank: 3, isHint: true },
				],
			}),
			record("2026-03-03", {
				won: false,
				attempts: 99,
				bestRank: 800,
				guesses: [{ word: "вада", rank: 800 }],
			}),
		]);
		const byKey = Object.fromEntries(
			getWrappedStats(2026).highlights.map((h) => [h.key, h.value])
		);
		expect(byKey.bestAttempts).toBe(4);
		expect(byKey.winRate).toBe("67%");
		expect(byKey.favoriteGuess).toBe("лес ×2");
		expect(byKey.closestGuess).toBe("лес · №2");
	});

	it("omits the attempts highlight when nothing was won", () => {
		seed([record("2026-03-01", { won: false })]);
		const keys = getWrappedStats(2026).highlights.map((h) => h.key);
		expect(keys).not.toContain("bestAttempts");
		expect(keys).toContain("winRate");
	});
});
