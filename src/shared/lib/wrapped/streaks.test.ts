import { longestStreakFromDates } from "./streaks";

describe("longestStreakFromDates", () => {
	it("returns 0 for no dates", () => {
		expect(longestStreakFromDates([])).toBe(0);
	});

	it("returns 1 for a single date", () => {
		expect(longestStreakFromDates(["2026-03-04"])).toBe(1);
	});

	it("counts a consecutive run", () => {
		expect(
			longestStreakFromDates(["2026-03-04", "2026-03-05", "2026-03-06"])
		).toBe(3);
	});

	it("returns the longest of several runs", () => {
		expect(
			longestStreakFromDates([
				"2026-03-01",
				"2026-03-02",
				"2026-03-10",
				"2026-03-11",
				"2026-03-12",
			])
		).toBe(3);
	});

	it("sorts unsorted input", () => {
		expect(
			longestStreakFromDates(["2026-03-06", "2026-03-04", "2026-03-05"])
		).toBe(3);
	});

	it("ignores duplicates", () => {
		expect(
			longestStreakFromDates(["2026-03-04", "2026-03-04", "2026-03-05"])
		).toBe(2);
	});

	it("counts across a month boundary", () => {
		expect(longestStreakFromDates(["2026-01-31", "2026-02-01"])).toBe(2);
	});

	it("counts across a year boundary", () => {
		expect(longestStreakFromDates(["2026-12-31", "2027-01-01"])).toBe(2);
	});

	it("ignores malformed entries", () => {
		expect(longestStreakFromDates(["nope", "2026-03-04", ""])).toBe(1);
	});
});
