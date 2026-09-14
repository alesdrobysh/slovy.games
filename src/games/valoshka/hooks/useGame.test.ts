import { act, renderHook } from "@testing-library/react";
import {
	trackValoshkaGameStarted,
	trackValoshkaWordFound,
} from "@/games/valoshka/lib/analytics";
import type { Puzzle } from "@/games/valoshka/types";
import { useGame } from "./useGame";

jest.mock("@/games/valoshka/lib/analytics", () => ({
	trackValoshkaGameStarted: jest.fn(),
	trackValoshkaWordFound: jest.fn(),
	trackValoshkaRankUp: jest.fn(),
	trackValoshkaHintUsed: jest.fn(),
	trackValoshkaVasiliokReached: jest.fn(),
}));

const puzzle: Puzzle = {
	date: "2026-09-14",
	center: "а",
	outer: ["б", "в", "г", "д", "е", "ж"],
	answers: ["абвг", "абвгд"],
	pangrams: [],
	max_score: 100,
};

beforeEach(() => {
	localStorage.clear();
	jest.clearAllMocks();
});

it("does not report restored progress as a new game or word", () => {
	localStorage.setItem(
		`vulej_${puzzle.date}`,
		JSON.stringify({ date: puzzle.date, foundWords: ["абвг"], score: 4 })
	);

	const { result } = renderHook(() => useGame(puzzle));

	expect(result.current.state.foundWords).toEqual(["абвг"]);
	expect(trackValoshkaGameStarted).not.toHaveBeenCalled();
	expect(trackValoshkaWordFound).not.toHaveBeenCalled();
});

it("reports a newly found word after restoring progress without another start", () => {
	localStorage.setItem(
		`vulej_${puzzle.date}`,
		JSON.stringify({ date: puzzle.date, foundWords: ["абвг"], score: 4 })
	);

	const { result } = renderHook(() => useGame(puzzle));
	act(() => {
		for (const letter of "абвгд") result.current.actions.handleLetter(letter);
	});
	act(() => result.current.actions.handleSubmit());

	expect(trackValoshkaGameStarted).not.toHaveBeenCalled();
	expect(trackValoshkaWordFound).toHaveBeenCalledTimes(1);
	expect(trackValoshkaWordFound).toHaveBeenCalledWith(
		"абвгд",
		false,
		expect.any(Number),
		puzzle.date
	);
});
