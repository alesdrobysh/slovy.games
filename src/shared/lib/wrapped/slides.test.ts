import type { GameYearStats, WrappedSummary } from "@/shared/types/wrapped";
import { buildSlides } from "./slides";
import { computeWrappedSummary } from "./summary";

function game(
	gameId: GameYearStats["gameId"],
	count: number,
	startDay = 1
): GameYearStats {
	return {
		gameId,
		year: 2026,
		daysPlayed: Array.from(
			{ length: count },
			(_, i) => `2026-03-${String(startDay + i).padStart(2, "0")}`
		),
		daysWon: [],
		longestStreakInYear: count,
		highlights: [],
	};
}

function summaryFor(...games: GameYearStats[]): WrappedSummary {
	return computeWrappedSummary(games, 2026);
}

describe("buildSlides", () => {
	it("builds hero, common, two slides per game, then share", () => {
		const slides = buildSlides(
			summaryFor(game("pobach", 6), game("valoshka", 6, 10))
		);
		expect(slides).toEqual([
			{ kind: "hero", year: 2026 },
			{ kind: "common" },
			{ kind: "game", gameId: "pobach", page: 1 },
			{ kind: "game", gameId: "pobach", page: 2 },
			{ kind: "game", gameId: "valoshka", page: 1 },
			{ kind: "game", gameId: "valoshka", page: 2 },
			{ kind: "share" },
		]);
	});

	it("puts pobach slides before valoshka slides", () => {
		const slides = buildSlides(
			summaryFor(game("valoshka", 6, 10), game("pobach", 6))
		);
		const gameOrder = slides
			.filter((s) => s.kind === "game")
			.map((s) => (s.kind === "game" ? s.gameId : null));
		expect(gameOrder).toEqual(["pobach", "pobach", "valoshka", "valoshka"]);
	});

	it("drops a game group entirely when it has no days", () => {
		const slides = buildSlides(summaryFor(game("pobach", 6)));
		expect(slides.map((s) => s.kind)).toEqual([
			"hero",
			"common",
			"game",
			"game",
			"share",
		]);
	});

	it("collapses to hero, thin, and no share when data is thin", () => {
		const slides = buildSlides(summaryFor(game("pobach", 2)));
		expect(slides).toEqual([{ kind: "hero", year: 2026 }, { kind: "thin" }]);
	});

	it("collapses when there is no data at all", () => {
		const slides = buildSlides(summaryFor());
		expect(slides).toEqual([{ kind: "hero", year: 2026 }, { kind: "thin" }]);
	});
});
