import type { GameYearStats } from "@/shared/types/wrapped";
import { computeWrappedSummary, WRAPPED_THIN_DATA_DAYS } from "./summary";

function game(
	gameId: GameYearStats["gameId"],
	daysPlayed: string[],
	daysWon: string[] = daysPlayed
): GameYearStats {
	return {
		gameId,
		year: 2026,
		daysPlayed,
		daysWon,
		longestStreakInYear: 0,
		highlights: [],
	};
}

describe("computeWrappedSummary", () => {
	it("handles no games at all", () => {
		const s = computeWrappedSummary([], 2026);
		expect(s.activeDays).toEqual([]);
		expect(s.gamesFinished).toBe(0);
		expect(s.gameOfTheYear).toBeNull();
		expect(s.busiestMonth).toBeNull();
		expect(s.isThin).toBe(true);
	});

	it("sorts perGame into canonical order regardless of input order", () => {
		const s = computeWrappedSummary(
			[game("valoshka", ["2026-03-01"]), game("pobach", ["2026-03-01"])],
			2026
		);
		expect(s.perGame.map((g) => g.gameId)).toEqual(["pobach", "valoshka"]);
	});

	it("drops games with no activity from perGame", () => {
		const s = computeWrappedSummary(
			[game("pobach", ["2026-03-01"]), game("valoshka", [])],
			2026
		);
		expect(s.perGame.map((g) => g.gameId)).toEqual(["pobach"]);
	});

	it("unions active days across games and counts each day once", () => {
		const s = computeWrappedSummary(
			[
				game("pobach", ["2026-03-01", "2026-03-02"]),
				game("valoshka", ["2026-03-02", "2026-03-03"]),
			],
			2026
		);
		expect(s.activeDays).toEqual(["2026-03-01", "2026-03-02", "2026-03-03"]);
	});

	it("counts games finished as the total of per-game days played", () => {
		const s = computeWrappedSummary(
			[
				game("pobach", ["2026-03-01", "2026-03-02"]),
				game("valoshka", ["2026-03-02"]),
			],
			2026
		);
		expect(s.gamesFinished).toBe(3);
	});

	it("computes the cross-game streak from the union of days", () => {
		const s = computeWrappedSummary(
			[
				game("pobach", ["2026-03-01", "2026-03-03"]),
				game("valoshka", ["2026-03-02"]),
			],
			2026
		);
		expect(s.longestStreakAnyGame).toBe(3);
	});

	it("picks the busiest month, earliest month winning a tie", () => {
		const s = computeWrappedSummary(
			[
				game("pobach", [
					"2026-02-01",
					"2026-02-02",
					"2026-05-01",
					"2026-05-02",
				]),
			],
			2026
		);
		expect(s.busiestMonth).toEqual({ month: 2, days: 2 });
	});

	it("picks game of the year by most active days", () => {
		const s = computeWrappedSummary(
			[
				game("pobach", ["2026-03-01"]),
				game("valoshka", ["2026-03-01", "2026-03-02"]),
			],
			2026
		);
		expect(s.gameOfTheYear).toBe("valoshka");
	});

	it("breaks a game-of-the-year tie by days won", () => {
		const s = computeWrappedSummary(
			[
				game("pobach", ["2026-03-01", "2026-03-02"], ["2026-03-01"]),
				game(
					"valoshka",
					["2026-03-01", "2026-03-02"],
					["2026-03-01", "2026-03-02"]
				),
			],
			2026
		);
		expect(s.gameOfTheYear).toBe("valoshka");
	});

	it("marks thin data below the threshold and not at it", () => {
		const days = Array.from(
			{ length: WRAPPED_THIN_DATA_DAYS },
			(_, i) => `2026-03-${String(i + 1).padStart(2, "0")}`
		);
		expect(computeWrappedSummary([game("pobach", days)], 2026).isThin).toBe(
			false
		);
		expect(
			computeWrappedSummary([game("pobach", days.slice(1))], 2026).isThin
		).toBe(true);
	});
});
