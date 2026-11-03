import { act, renderHook, waitFor } from "@testing-library/react";
import posthog from "posthog-js";
import { StrictMode } from "react";
import { belmorphMock } from "../lib/belmorph.mock";
import type { PickedArticle, SavedProgress } from "../types";

jest.mock("belmorph", () => belmorphMock, { virtual: true });
jest.mock("posthog-js", () => ({ __loaded: true, capture: jest.fn() }));
jest.mock("@/games/sakretna/lib/confetti", () => ({
	triggerConfetti: jest.fn(),
}));
jest.mock("@/games/sakretna/lib/haptics", () => ({
	vibrate: jest.fn(),
}));

import { triggerConfetti } from "@/games/sakretna/lib/confetti";
import { vibrate } from "@/games/sakretna/lib/haptics";

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
	jest.clearAllMocks();
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
	expect(triggerConfetti).toHaveBeenCalledTimes(1);
	expect(vibrate).toHaveBeenCalledWith("long");
});

it("vibrates briefly on each wrong guess", async () => {
	const { result } = renderHook(() => useSakretnaGame(picked));
	await waitFor(() => expect(result.current.ready).toBe(true));
	act(() => result.current.setInput("аўтамабіль"));
	act(() => result.current.submitGuess());
	act(() => result.current.setInput("аўтамабіль"));
	act(() => result.current.submitGuess());
	expect(vibrate).toHaveBeenCalledTimes(2);
	expect(vibrate).toHaveBeenCalledWith("short");
});

it("replays confetti without haptics for a win restored from storage", async () => {
	saveProgress({ ...progress(["арфаграфія", "беларуска", "мова"]), won: true });
	const { result } = renderHook(() => useSakretnaGame(picked));
	await waitFor(() => expect(result.current.ready).toBe(true));
	expect(result.current.state.won).toBe(true);
	expect(triggerConfetti).toHaveBeenCalledTimes(1);
	expect(vibrate).not.toHaveBeenCalled();
	expect(posthog.capture).not.toHaveBeenCalled();
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
	const first = renderHook(() => useSakretnaGame(picked), {
		wrapper: StrictMode,
	});
	await waitFor(() => expect(first.result.current.ready).toBe(true));
	expect(first.result.current.state.won).toBe(true);
	expect(loadProgress(picked.date)?.won).toBe(true);
	expect(loadStats().totalWins).toBe(1);
	first.unmount();
	const second = renderHook(() => useSakretnaGame(picked));
	await waitFor(() => expect(second.result.current.ready).toBe(true));
	expect(loadStats().totalWins).toBe(1);
	expect(posthog.capture).not.toHaveBeenCalled();
});

it("tracks unique attempts and one start in StrictMode, including misses", async () => {
	const { result } = renderHook(() => useSakretnaGame(picked), {
		wrapper: StrictMode,
	});
	await waitFor(() => expect(result.current.ready).toBe(true));
	expect(posthog.capture).not.toHaveBeenCalled();
	act(() => result.current.submitGuess());
	expect(posthog.capture).not.toHaveBeenCalled();
	for (const word of ["аўтамабіль", "аўтамабіль", "тэкст", "тэкст"]) {
		act(() => result.current.setInput(word));
		act(() => result.current.submitGuess());
	}
	expect(jest.mocked(posthog.capture).mock.calls).toEqual([
		[
			"sakretna_game_started",
			expect.objectContaining({
				game: "sakretna",
				date: picked.date,
				article_id: picked.article.id,
				attempts: 1,
			}),
		],
		[
			"sakretna_guess_submitted",
			expect.objectContaining({
				word: "аўтамабіль",
				is_hit: false,
				attempts: 1,
			}),
		],
		[
			"sakretna_guess_submitted",
			expect.objectContaining({ word: "тэкст", is_hit: true, attempts: 2 }),
		],
	]);
});

it("tracks a resumed game's winning attempt without replaying its start", async () => {
	saveProgress(progress(["беларуска", "мова"]));
	const { result, unmount } = renderHook(() => useSakretnaGame(picked), {
		wrapper: StrictMode,
	});
	await waitFor(() => expect(result.current.ready).toBe(true));
	expect(posthog.capture).not.toHaveBeenCalled();
	act(() => result.current.setInput("арфаграфія"));
	act(() => result.current.submitGuess());
	expect(jest.mocked(posthog.capture).mock.calls).toEqual([
		[
			"sakretna_guess_submitted",
			expect.objectContaining({ attempts: 3, is_hit: true }),
		],
		[
			"sakretna_game_won",
			expect.objectContaining({ attempts: 3, hints_used: 0 }),
		],
	]);
	unmount();
	jest.mocked(posthog.capture).mockClear();
	const restored = renderHook(() => useSakretnaGame(picked));
	await waitFor(() => expect(restored.result.current.ready).toBe(true));
	expect(posthog.capture).not.toHaveBeenCalled();
});

it("tracks only applied hints and a single surrender", async () => {
	const { result } = renderHook(() => useSakretnaGame(picked));
	await waitFor(() => expect(result.current.ready).toBe(true));
	act(() => result.current.useHint("арфаграфія"));
	expect(posthog.capture).not.toHaveBeenCalled();
	act(() => result.current.useHint("тэкст"));
	act(() => result.current.useHint("тэкст"));
	act(() => result.current.giveUp());
	act(() => result.current.giveUp());
	act(() => result.current.setInput("мова"));
	act(() => result.current.submitGuess());
	expect(
		jest.mocked(posthog.capture).mock.calls.map(([event]) => event)
	).toEqual([
		"sakretna_game_started",
		"sakretna_hint_used",
		"sakretna_game_gave_up",
	]);
});

it("does not capture gameplay before PostHog is initialized", async () => {
	const client = posthog as typeof posthog & { __loaded: boolean };
	client.__loaded = false;
	try {
		const { result } = renderHook(() => useSakretnaGame(picked));
		await waitFor(() => expect(result.current.ready).toBe(true));
		act(() => result.current.setInput("тэкст"));
		act(() => result.current.submitGuess());
		expect(posthog.capture).not.toHaveBeenCalled();
	} finally {
		client.__loaded = true;
	}
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
