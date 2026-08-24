import type { SavedProgress } from "../types";
import { formatDuration } from "./SakretnaStatsPage";

jest.mock(
	"belmorph",
	() => ({
		loadDictAsync: () => Promise.resolve({}),
		MorphAnalyzer: class {},
	}),
	{ virtual: true }
);

describe("SakretnaStatsPage", () => {
	it("formats persisted game duration", () => {
		const progress = {
			startedAt: "2026-08-24T10:00:00.000Z",
			finishedAt: "2026-08-24T10:03:07.000Z",
		} as SavedProgress;
		expect(formatDuration(progress)).toBe("3 хв 7 с");
	});
});
