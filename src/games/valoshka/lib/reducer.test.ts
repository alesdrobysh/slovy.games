import { createInitialState, gameReducer } from "./reducer";
import type { GameState, Puzzle } from "../types";

const puzzle: Puzzle = {
	date: "2026-06-12",
	center: "а",
	outer: ["б", "в", "г", "д", "е", "ж"],
	answers: ["абвг", "абвгд", "абвгде", "абвгдеж"],
	pangrams: ["абвгдеж"],
	max_score: 100,
};

function state(overrides: Partial<GameState> = {}): GameState {
	return { ...createInitialState(puzzle), ...overrides };
}

describe("wordsEarnTokenCount — earning", () => {
	it("starts at 0", () => {
		expect(createInitialState(puzzle).wordsEarnTokenCount).toBe(0);
	});

	it("increments by 1 on each found word", () => {
		const s = state({ currentInput: "абвг" });
		const next = gameReducer(s, { type: "SUBMIT", answers: ["абвг"], pangrams: [], center: "а" });
		expect(next.wordsEarnTokenCount).toBe(1);
	});

	it("caps at 9", () => {
		const s = state({ wordsEarnTokenCount: 9, currentInput: "абвг" });
		const next = gameReducer(s, { type: "SUBMIT", answers: ["абвг"], pangrams: [], center: "а" });
		expect(next.wordsEarnTokenCount).toBe(9);
	});

	it("does NOT increment when the found word is the active hint target", () => {
		const s = state({
			wordsEarnTokenCount: 2,
			currentInput: "абвг",
			hint: { targetWord: "абвг", revealedIndices: [0, 3], isActive: true },
		});
		const next = gameReducer(s, { type: "SUBMIT", answers: ["абвг"], pangrams: [], center: "а" });
		expect(next.wordsEarnTokenCount).toBe(2);
	});
});

describe("START_HINT — token spending", () => {
	it("decrements wordsEarnTokenCount by 3", () => {
		const s = state({ wordsEarnTokenCount: 5 });
		const next = gameReducer(s, { type: "START_HINT", answers: ["абвг"], foundWords: [] });
		expect(next.wordsEarnTokenCount).toBe(2);
	});

	it("does nothing when wordsEarnTokenCount < 3", () => {
		const s = state({ wordsEarnTokenCount: 2 });
		const next = gameReducer(s, { type: "START_HINT", answers: ["абвг"], foundWords: [] });
		expect(next.wordsEarnTokenCount).toBe(2);
		expect(next.hint.isActive).toBe(false);
	});
});

describe("REVEAL_NEXT_LETTER — token spending", () => {
	it("decrements wordsEarnTokenCount by 3", () => {
		const s = state({
			wordsEarnTokenCount: 6,
			hint: { targetWord: "абвгд", revealedIndices: [0, 4], isActive: true },
		});
		const next = gameReducer(s, { type: "REVEAL_NEXT_LETTER" });
		expect(next.wordsEarnTokenCount).toBe(3);
	});

	it("does nothing when wordsEarnTokenCount < 3", () => {
		const s = state({
			wordsEarnTokenCount: 2,
			hint: { targetWord: "абвгд", revealedIndices: [0, 4], isActive: true },
		});
		const next = gameReducer(s, { type: "REVEAL_NEXT_LETTER" });
		expect(next.wordsEarnTokenCount).toBe(2);
		expect(next.hint.revealedIndices).toEqual([0, 4]);
	});
});

describe("proportional reveal on START_HINT", () => {
	it("reveals indices [0, 3] for a 4-letter word", () => {
		const s = state({ wordsEarnTokenCount: 3 });
		const next = gameReducer(s, { type: "START_HINT", answers: ["абвг"], foundWords: [] });
		expect(next.hint.revealedIndices).toEqual([0, 3]);
	});

	it("reveals indices [0, 5] for a 6-letter word", () => {
		const s = state({ wordsEarnTokenCount: 3 });
		const next = gameReducer(s, { type: "START_HINT", answers: ["абвгде"], foundWords: [] });
		expect(next.hint.revealedIndices).toEqual([0, 5]);
	});

	it("reveals indices [0, 1, 6] for a 7-letter word (pangram)", () => {
		const s = state({ wordsEarnTokenCount: 3 });
		const next = gameReducer(s, { type: "START_HINT", answers: ["абвгдеж"], foundWords: [] });
		expect(next.hint.revealedIndices).toEqual([0, 1, 6]);
	});
});

describe("RESTORE_STATE", () => {
	it("restores foundWords, score, hint, and wordsEarnTokenCount", () => {
		const s = createInitialState(puzzle);
		const hint = { targetWord: "абвг", revealedIndices: [0, 3], isActive: true };
		const next = gameReducer(s, {
			type: "RESTORE_STATE",
			foundWords: ["абвг"],
			score: 1,
			hint,
			wordsEarnTokenCount: 4,
		});
		expect(next.foundWords).toEqual(["абвг"]);
		expect(next.score).toBe(1);
		expect(next.hint).toEqual(hint);
		expect(next.wordsEarnTokenCount).toBe(4);
	});

	it("defaults wordsEarnTokenCount to 0 when not provided (old save)", () => {
		const s = createInitialState(puzzle);
		const next = gameReducer(s, {
			type: "RESTORE_STATE",
			foundWords: ["абвг"],
			score: 1,
		});
		expect(next.wordsEarnTokenCount).toBe(0);
	});
});
