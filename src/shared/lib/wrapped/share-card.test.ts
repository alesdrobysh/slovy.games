import { CARD, cardFontStacks, fitText } from "./share-card";

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
