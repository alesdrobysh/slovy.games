import type { GameState, Puzzle } from "../types";
import { createInitialState, gameReducer } from "./reducer";

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

describe("hintCredits — initial state", () => {
	it("starts at 2 (daily free)", () => {
		expect(createInitialState(puzzle).hintCredits).toBe(2);
	});

	it("starts with empty milestonesAwarded", () => {
		expect(createInitialState(puzzle).milestonesAwarded).toEqual([]);
	});
});

describe("hintCredits — earning (N/10)", () => {
	it("increments by word.length/10 on each found word", () => {
		const s = state({ currentInput: "абвг", hintCredits: 2 });
		const next = gameReducer(s, {
			type: "SUBMIT",
			answers: ["абвг"],
			pangrams: [],
			center: "а",
			maxScore: puzzle.max_score,
		});
		expect(next.hintCredits).toBe(2.4);
	});

	it("does not cap — unlimited earning", () => {
		const s = state({ hintCredits: 5, currentInput: "абвгд" });
		const next = gameReducer(s, {
			type: "SUBMIT",
			answers: ["абвгд"],
			pangrams: [],
			center: "а",
			maxScore: puzzle.max_score,
		});
		expect(next.hintCredits).toBe(5.5);
	});

	it("does NOT increment earning when the found word is the active hint target", () => {
		const s = state({
			hintCredits: 2,
			currentInput: "абвг",
			hint: {
				targetWord: "абвг",
				revealedIndices: [0, 3],
				isActive: true,
			},
		});
		const next = gameReducer(s, {
			type: "SUBMIT",
			answers: ["абвг"],
			pangrams: [],
			center: "а",
			maxScore: puzzle.max_score,
		});
		expect(next.hintCredits).toBe(2);
	});
});

describe("hintCredits — milestones", () => {
	it("awards +1 hint credit at 25% score", () => {
		const s = state({
			currentInput: "абвг",
			score: 24,
			hintCredits: 2,
		});
		expect(s.milestonesAwarded).toEqual([]);
		const next = gameReducer(s, {
			type: "SUBMIT",
			answers: ["абвг"],
			pangrams: [],
			center: "а",
			maxScore: puzzle.max_score,
		});
		expect(next.score).toBe(25);
		expect(next.hintCredits).toBe(2.4 + 1);
		expect(next.milestonesAwarded).toEqual([25]);
	});

	it("awards +1 hint credit at 50% score", () => {
		const s = state({
			currentInput: "абвгд",
			score: 45,
			hintCredits: 3,
			milestonesAwarded: [25],
		});
		const next = gameReducer(s, {
			type: "SUBMIT",
			answers: ["абвгд"],
			pangrams: [],
			center: "а",
			maxScore: puzzle.max_score,
		});
		expect(next.score).toBe(50);
		expect(next.hintCredits).toBe(3 + 0.5 + 1);
		expect(next.milestonesAwarded).toEqual([25, 50]);
	});

	it("awards +1 hint credit at 75% score", () => {
		const s = state({
			currentInput: "абвгд",
			score: 70,
			hintCredits: 4,
			milestonesAwarded: [25, 50],
		});
		const next = gameReducer(s, {
			type: "SUBMIT",
			answers: ["абвгд"],
			pangrams: [],
			center: "а",
			maxScore: puzzle.max_score,
		});
		expect(next.score).toBe(75);
		expect(next.hintCredits).toBe(4 + 0.5 + 1);
		expect(next.milestonesAwarded).toEqual([25, 50, 75]);
	});

	it("awards multiple milestones when score jumps far", () => {
		const s = state({
			currentInput: "абвгдеж",
			score: 20,
			hintCredits: 2,
		});
		const next = gameReducer(s, {
			type: "SUBMIT",
			answers: ["абвгдеж"],
			pangrams: ["абвгдеж"],
			center: "а",
			maxScore: puzzle.max_score,
		});
		expect(next.score).toBe(34);
		expect(next.hintCredits).toBe(2 + 0.7 + 1);
		expect(next.milestonesAwarded).toEqual([25]);
	});

	it("does not duplicate already-awarded milestones", () => {
		const s = state({
			currentInput: "абвгд",
			score: 50,
			hintCredits: 3,
			milestonesAwarded: [25, 50, 75],
		});
		const next = gameReducer(s, {
			type: "SUBMIT",
			answers: ["абвгд"],
			pangrams: [],
			center: "а",
			maxScore: puzzle.max_score,
		});
		expect(next.hintCredits).toBe(3 + 0.5);
		expect(next.milestonesAwarded).toEqual([25, 50, 75]);
	});

	it("milestones still awarded on hinted word (earning skips, bonus applies)", () => {
		const s = state({
			currentInput: "абвг",
			score: 24,
			hintCredits: 5,
			hint: {
				targetWord: "абвг",
				revealedIndices: [0, 3],
				isActive: true,
			},
		});
		const next = gameReducer(s, {
			type: "SUBMIT",
			answers: ["абвг"],
			pangrams: [],
			center: "а",
			maxScore: puzzle.max_score,
		});
		expect(next.score).toBe(25);
		expect(next.hintCredits).toBe(5 + 1);
		expect(next.milestonesAwarded).toEqual([25]);
	});
});

describe("START_HINT — token spending", () => {
	it("decrements hintCredits by 1", () => {
		const s = state({ hintCredits: 5 });
		const next = gameReducer(s, {
			type: "START_HINT",
			answers: ["абвг"],
			foundWords: [],
		});
		expect(next.hintCredits).toBe(4);
	});

	it("does nothing when hintCredits < 1", () => {
		const s = state({ hintCredits: 0.9 });
		const next = gameReducer(s, {
			type: "START_HINT",
			answers: ["абвг"],
			foundWords: [],
		});
		expect(next.hintCredits).toBe(0.9);
		expect(next.hint.isActive).toBe(false);
	});
});

describe("proportional reveal on START_HINT", () => {
	it("reveals indices [0, 3] for a 4-letter word", () => {
		const s = state({ hintCredits: 1 });
		const next = gameReducer(s, {
			type: "START_HINT",
			answers: ["абвг"],
			foundWords: [],
		});
		expect(next.hint.revealedIndices).toEqual([0, 3]);
	});

	it("reveals indices [0, 5] for a 6-letter word", () => {
		const s = state({ hintCredits: 1 });
		const next = gameReducer(s, {
			type: "START_HINT",
			answers: ["абвгде"],
			foundWords: [],
		});
		expect(next.hint.revealedIndices).toEqual([0, 5]);
	});

	it("reveals indices [0, 1, 6] for a 7-letter word (pangram)", () => {
		const s = state({ hintCredits: 1 });
		const next = gameReducer(s, {
			type: "START_HINT",
			answers: ["абвгдеж"],
			foundWords: [],
		});
		expect(next.hint.revealedIndices).toEqual([0, 1, 6]);
	});
});

describe("RESTORE_STATE", () => {
	it("restores foundWords, score, hint, hintCredits, and milestonesAwarded", () => {
		const s = createInitialState(puzzle);
		const hint = {
			targetWord: "абвг",
			revealedIndices: [0, 3],
			isActive: true,
		};
		const next = gameReducer(s, {
			type: "RESTORE_STATE",
			foundWords: ["абвг"],
			score: 1,
			hint,
			hintCredits: 4,
			milestonesAwarded: [25],
		});
		expect(next.foundWords).toEqual(["абвг"]);
		expect(next.score).toBe(1);
		expect(next.hint).toEqual(hint);
		expect(next.hintCredits).toBe(4);
		expect(next.milestonesAwarded).toEqual([25]);
	});

	it("defaults hintCredits to 2 and milestonesAwarded to [] when not provided", () => {
		const s = createInitialState(puzzle);
		const next = gameReducer(s, {
			type: "RESTORE_STATE",
			foundWords: ["абвг"],
			score: 1,
		});
		expect(next.hintCredits).toBe(2);
		expect(next.milestonesAwarded).toEqual([]);
	});

	it("restores legacy wordsEarnTokenCount with +2 daily bonus", () => {
		const s = createInitialState(puzzle);
		const next = gameReducer(s, {
			type: "RESTORE_STATE",
			foundWords: ["абвг"],
			score: 1,
			wordsEarnTokenCount: 1.5,
		});
		expect(next.hintCredits).toBe(3.5);
		expect(next.milestonesAwarded).toEqual([]);
	});

	it("prefers hintCredits over legacy wordsEarnTokenCount when both supplied", () => {
		const s = createInitialState(puzzle);
		const next = gameReducer(s, {
			type: "RESTORE_STATE",
			foundWords: ["абвг"],
			score: 1,
			hintCredits: 5,
			wordsEarnTokenCount: 1.5,
		});
		expect(next.hintCredits).toBe(5);
	});
});
