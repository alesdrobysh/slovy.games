import { isWrappedOpen, isWrappedVisible, wrappedYearFor } from "./window";

/** A UTC timestamp for the given Minsk (UTC+3) wall-clock moment. */
function msk(
	year: number,
	month: number,
	day: number,
	hour = 12,
	minute = 0
): number {
	return Date.UTC(year, month - 1, day, hour - 3, minute);
}

describe("isWrappedOpen", () => {
	it("is closed the day before the window opens", () => {
		expect(isWrappedOpen(msk(2026, 12, 19, 23, 59))).toBe(false);
	});

	it("is open at the first Minsk minute of 20 December", () => {
		expect(isWrappedOpen(msk(2026, 12, 20, 0, 0))).toBe(true);
	});

	it("stays open across the new year", () => {
		expect(isWrappedOpen(msk(2026, 12, 31, 23, 30))).toBe(true);
		expect(isWrappedOpen(msk(2027, 1, 1, 0, 30))).toBe(true);
	});

	it("is open on the last Minsk minute of 10 January", () => {
		expect(isWrappedOpen(msk(2027, 1, 10, 23, 59))).toBe(true);
	});

	it("is closed on 11 January", () => {
		expect(isWrappedOpen(msk(2027, 1, 11, 0, 0))).toBe(false);
	});

	it("is closed mid-year", () => {
		expect(isWrappedOpen(msk(2026, 9, 12))).toBe(false);
	});

	it("uses Minsk time, not UTC, at the boundary", () => {
		// 19 Dec 22:00 UTC is already 20 Dec 01:00 in Minsk.
		expect(isWrappedOpen(Date.UTC(2026, 11, 19, 22, 0))).toBe(true);
	});
});

describe("wrappedYearFor", () => {
	it("recaps the current year in December", () => {
		expect(wrappedYearFor(msk(2026, 12, 25))).toBe(2026);
	});

	it("recaps the previous year in early January", () => {
		expect(wrappedYearFor(msk(2027, 1, 5))).toBe(2026);
	});

	it("uses Minsk time at the new year boundary", () => {
		// 31 Dec 22:00 UTC is already 1 Jan in Minsk, so the recap year is 2026.
		expect(wrappedYearFor(Date.UTC(2026, 11, 31, 22, 0))).toBe(2026);
	});

	it("recaps the current year mid-year", () => {
		expect(wrappedYearFor(msk(2026, 9, 12))).toBe(2026);
	});
});

describe("isWrappedVisible", () => {
	it("is visible inside the window without preview", () => {
		expect(
			isWrappedVisible({ nowMs: msk(2026, 12, 25), hasPreview: false })
		).toBe(true);
	});

	it("is visible outside the window with preview", () => {
		expect(
			isWrappedVisible({ nowMs: msk(2026, 9, 12), hasPreview: true })
		).toBe(true);
	});

	it("is hidden outside the window without preview", () => {
		expect(
			isWrappedVisible({ nowMs: msk(2026, 9, 12), hasPreview: false })
		).toBe(false);
	});
});
