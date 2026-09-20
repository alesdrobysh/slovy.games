import { act, renderHook } from "@testing-library/react";
import {
	trackValoshkaGameStarted,
	trackValoshkaRankUp,
	trackValoshkaWordFound,
} from "@/games/valoshka/lib/analytics";
import type { Puzzle } from "@/games/valoshka/types";
import { type UseGameReturn, useGame } from "./useGame";

jest.mock("@/games/valoshka/lib/analytics", () => ({
	trackValoshkaGameStarted: jest.fn(),
	trackValoshkaHintUsed: jest.fn(),
	trackValoshkaRankUp: jest.fn(),
	trackValoshkaVasiliokReached: jest.fn(),
	trackValoshkaWordFound: jest.fn(),
}));
jest.mock("@/games/valoshka/lib/confetti", () => ({
	triggerConfetti: jest.fn(),
}));
jest.mock("@/games/valoshka/lib/haptics", () => ({
	vibrate: jest.fn(),
}));

const puzzle: Puzzle = {
	date: "2026-09-13",
	center: "а",
	outer: ["м", "р", "б", "в", "г", "д"],
	answers: ["мама", "рама"],
	pangrams: [],
	max_score: 100,
};

const restoredPuzzle: Puzzle = {
	date: "2026-09-14",
	center: "а",
	outer: ["б", "в", "г", "д", "е", "ж"],
	answers: ["абвг", "абвгд"],
	pangrams: [],
	max_score: 100,
};

function submitWord(result: { current: UseGameReturn }, word: string) {
	for (const letter of word) {
		act(() => result.current.actions.handleLetter(letter));
	}
	act(() => result.current.actions.handleSubmit());
}

describe("Valoshka game analytics", () => {
	beforeEach(() => {
		localStorage.clear();
		jest.clearAllMocks();
	});

	it("tracks the first submitted word as a new game", () => {
		const { result } = renderHook(() => useGame(puzzle));
		submitWord(result, "мама");
		expect(trackValoshkaGameStarted).toHaveBeenCalledTimes(1);
		expect(trackValoshkaWordFound).toHaveBeenCalledWith(
			"мама",
			false,
			1,
			puzzle.date
		);
	});

	it("does not replay analytics when saved progress is restored", () => {
		localStorage.setItem(
			`vulej_${puzzle.date}`,
			JSON.stringify({ date: puzzle.date, foundWords: ["мама"], score: 1 })
		);
		const { result } = renderHook(() => useGame(puzzle));
		expect(result.current.state.foundWords).toEqual(["мама"]);
		expect(trackValoshkaGameStarted).not.toHaveBeenCalled();
		expect(trackValoshkaWordFound).not.toHaveBeenCalled();
		expect(trackValoshkaRankUp).not.toHaveBeenCalled();
		submitWord(result, "рама");
		expect(trackValoshkaGameStarted).not.toHaveBeenCalled();
		expect(trackValoshkaWordFound).toHaveBeenCalledTimes(1);
		expect(trackValoshkaWordFound).toHaveBeenCalledWith(
			"рама",
			false,
			2,
			puzzle.date
		);
	});

	it("does not report restored progress as a new game or word", () => {
		localStorage.setItem(
			`vulej_${restoredPuzzle.date}`,
			JSON.stringify({
				date: restoredPuzzle.date,
				foundWords: ["абвг"],
				score: 4,
			})
		);
		const { result } = renderHook(() => useGame(restoredPuzzle));
		expect(result.current.state.foundWords).toEqual(["абвг"]);
		expect(trackValoshkaGameStarted).not.toHaveBeenCalled();
		expect(trackValoshkaWordFound).not.toHaveBeenCalled();
	});

	it("reports a newly found word after restoring progress without another start", () => {
		localStorage.setItem(
			`vulej_${restoredPuzzle.date}`,
			JSON.stringify({
				date: restoredPuzzle.date,
				foundWords: ["абвг"],
				score: 4,
			})
		);
		const { result } = renderHook(() => useGame(restoredPuzzle));
		submitWord(result, "абвгд");
		expect(trackValoshkaGameStarted).not.toHaveBeenCalled();
		expect(trackValoshkaWordFound).toHaveBeenCalledTimes(1);
		expect(trackValoshkaWordFound).toHaveBeenCalledWith(
			"абвгд",
			false,
			expect.any(Number),
			restoredPuzzle.date
		);
	});
});
