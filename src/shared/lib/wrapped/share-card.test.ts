import type { GameYearStats, WrappedSummary } from "@/shared/types/wrapped";
import {
	CARD,
	cardFontStacks,
	fitText,
	shareWords,
	yearHeatCells,
} from "./share-card";

/** Fake metrics: 10px of width per character per 100px of font size. */
function fakeCtx() {
	return {
		font: "",
		measureText(text: string) {
			const size = Number(/(\d+)px/.exec(this.font)?.[1] ?? 100);
			return { width: text.length * size * 0.1 } as TextMetrics;
		},
	};
}

describe("CARD", () => {
	it("is a 9:16 story frame", () => {
		expect(CARD.w / CARD.h).toBeCloseTo(9 / 16, 3);
	});
});

describe("fitText", () => {
	it("keeps the starting size when the text already fits", () => {
		expect(fitText(fakeCtx(), "кароткі", 1000, 100, "serif")).toBe(100);
	});

	it("shrinks until the text fits", () => {
		// 20 chars at 100px measures 200px wide; the cap is 100px.
		const size = fitText(fakeCtx(), "а".repeat(20), 100, 100, "serif");
		expect(size).toBeLessThan(100);
		expect(size).toBeGreaterThan(0);
	});

	it("never goes below a readable floor", () => {
		const size = fitText(fakeCtx(), "а".repeat(500), 10, 100, "serif");
		expect(size).toBeGreaterThanOrEqual(24);
	});

	it("handles empty text", () => {
		expect(fitText(fakeCtx(), "", 100, 100, "serif")).toBe(100);
	});
});

describe("cardFontStacks", () => {
	it("falls back to literal stacks when the CSS vars are absent", () => {
		const { display, body } = cardFontStacks();
		expect(display).toMatch(/Literata/);
		expect(body).toMatch(/Wix Madefor Text/);
	});
});

describe("shareWords", () => {
	function game(
		gameId: GameYearStats["gameId"],
		highlights: GameYearStats["highlights"]
	): GameYearStats {
		return {
			gameId,
			year: 2026,
			daysPlayed: ["2026-03-01"],
			daysWon: [],
			longestStreakInYear: 1,
			headline: { value: 0, caption: "" },
			highlights,
		};
	}

	it("takes one signature highlight per game, in deck order", () => {
		const summary = {
			perGame: [
				game("pobach", [
					{ key: "winRate", label: "Працэнт перамог", value: "50%" },
					{ key: "favoriteGuess", label: "Любімая здагадка", value: "мова" },
				]),
				game("valoshka", []),
				game("sakretna", [
					{ key: "bestWin", label: "Лепшае расследаванне", value: "Мінск" },
				]),
			],
		} as WrappedSummary;
		expect(shareWords(summary)).toEqual([
			{ game: "Побач", value: "мова", caption: "любімая здагадка" },
			{ game: "Сакрэтна", value: "Мінск", caption: "лепшае расследаванне" },
		]);
	});
});

describe("yearHeatCells", () => {
	it("leads with blanks up to the first Monday and covers every day", () => {
		// 1 January 2026 is a Thursday.
		const cells = yearHeatCells(2026, { "2026-01-01": 2, "2026-12-31": 5 });
		expect(cells.slice(0, 4)).toEqual([null, null, null, 2]);
		expect(cells).toHaveLength(3 + 365);
		expect(cells[cells.length - 1]).toBe(3);
	});
});
