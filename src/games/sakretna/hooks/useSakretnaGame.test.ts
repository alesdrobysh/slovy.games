import { act, renderHook, waitFor } from "@testing-library/react";
import { belmorphMock } from "../lib/belmorph.mock";
import type { PickedArticle, SavedProgress } from "../types";

jest.mock("belmorph", () => belmorphMock, { virtual: true });

import {
	DEFAULT_STATS,
	loadProgress,
	loadStats,
	STATS_KEY,
	saveProgress,
} from "../lib/storage";
import { useSakretnaGame } from "./useSakretnaGame";

// The server title lemma deliberately differs from a fresh client analysis.
const picked: PickedArticle = {
	date: "2026-10-20",
	article: {
		id: "orthography",
		title: "Арфаграфія беларускай мовы",
		body: "Тэкст",
		source: "",
		retrieved: "2026-10-20",
	},
	titleTokens: [
		{ type: "word", text: "Арфаграфія", lemma: "арфаграфія" },
		{ type: "word", text: "беларускай", lemma: "беларуска" },
		{ type: "word", text: "мовы", lemma: "мова" },
	],
	tokens: [{ type: "word", text: "Тэкст", lemma: "тэкст" }],
};

function progress(foundLemmas: string[]): SavedProgress {
	return {
		date: picked.date,
		articleId: picked.article.id,
		foundLemmas,
		guesses: [...foundLemmas],
		won: false,
		givenUp: false,
		hintsUsed: 0,
		startedAt: "2026-10-20T12:00:00Z",
	};
}

beforeEach(() => {
	localStorage.clear();
	localStorage.setItem(STATS_KEY, JSON.stringify(DEFAULT_STATS));
});

it("wins when the last rendered title word is guessed", async () => {
	saveProgress(progress(["беларуска", "мова"]));
	const { result } = renderHook(() => useSakretnaGame(picked));
	await waitFor(() => expect(result.current.ready).toBe(true));
	act(() => result.current.setInput("арфаграфія"));
	act(() => result.current.submitGuess());
	expect(result.current.state.won).toBe(true);
	expect(result.current.state.foundLemmas).toContain("тэкст");
	expect(loadStats().totalWins).toBe(1);
});

it("restores an old name prediction and uses article corrections for the final guess", async () => {
	const named: PickedArticle = {
		...picked,
		article: { ...picked.article, id: "wiki-51612", title: "Кацусіка Хокусай" },
		titleTokens: [
			{ type: "word", text: "Кацусіка", lemma: "кацусіка" },
			{ type: "word", text: "Хокусай", lemma: "хокусай" },
		],
		tokens: [{ type: "word", text: "Хокусая", lemma: "хокусай" }],
	};
	saveProgress({
		...progress(["хокусаць"]),
		articleId: named.article.id,
		guesses: ["хокусай"],
	});
	const { result } = renderHook(() => useSakretnaGame(named));
	await waitFor(() => expect(result.current.ready).toBe(true));
	expect(result.current.state.foundLemmas).toEqual(["хокусай"]);
	expect(result.current.state.won).toBe(false);
	act(() => result.current.setInput("Кацусіка"));
	act(() => result.current.submitGuess());
	expect(result.current.state.won).toBe(true);
});

it("repairs a saved game with a fully revealed title and records it once", async () => {
	saveProgress(progress(["арфаграфія", "беларуска", "мова"]));
	const first = renderHook(() => useSakretnaGame(picked));
	await waitFor(() => expect(first.result.current.ready).toBe(true));
	expect(first.result.current.state.won).toBe(true);
	expect(loadProgress(picked.date)?.won).toBe(true);
	expect(loadStats().totalWins).toBe(1);
	first.unmount();
	const second = renderHook(() => useSakretnaGame(picked));
	await waitFor(() => expect(second.result.current.ready).toBe(true));
	expect(loadStats().totalWins).toBe(1);
});

it.each([
	false,
	true,
])("keeps incomplete or surrendered games unfinished (givenUp=%s)", async (givenUp) => {
	const saved = progress(
		givenUp ? ["арфаграфія", "беларуска", "мова"] : ["арфаграфія"]
	);
	saveProgress({ ...saved, givenUp });
	const { result } = renderHook(() => useSakretnaGame(picked));
	await waitFor(() => expect(result.current.ready).toBe(true));
	expect(result.current.state.won).toBe(false);
});
