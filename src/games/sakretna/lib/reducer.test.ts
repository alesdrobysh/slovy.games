import { belmorphMock, flushMicrotasks, setLemma } from "./belmorph.mock";

jest.mock("belmorph", () => belmorphMock, { virtual: true });

import type { ArticleToken } from "../types";
import { createInitialState, gameReducer, stateToProgress } from "./reducer";
import { collectLemmas, tokenize } from "./tokenize";

const ARTICLE = "Мінск — сталіца Беларусі. Горад мае багатую гісторыю.";
let tokens: ArticleToken[];

beforeAll(async () => {
	setLemma("мінск", "мінск");
	setLemma("сталіца", "сталіца");
	setLemma("сталіцы", "сталіца");
	setLemma("беларусь", "беларусь");
	setLemma("горад", "горад");
	setLemma("мае", "мець");
	setLemma("багаты", "багаты");
	setLemma("гісторыя", "гісторыя");
	setLemma("горада", "горад");
	tokens = tokenize(ARTICLE);
	await flushMicrotasks();
});

describe("createInitialState", () => {
	it("starts with empty progress and 0 hints", () => {
		const s = createInitialState();
		expect(s.foundLemmas).toEqual([]);
		expect(s.guesses).toEqual([]);
		expect(s.hintsUsed).toBe(0);
		expect(s.won).toBe(false);
		expect(s.givenUp).toBe(false);
	});
});

const NO_TITLE = new Set<string>();

describe("SUBMIT_GUESS", () => {
	it("records a successful guess and reveals words", () => {
		const s = createInitialState();
		const next = gameReducer(s, {
			type: "SUBMIT_GUESS",
			rawGuess: "сталіца",
			tokens,
			titleLemmas: NO_TITLE,
		});
		expect(next.errorType).toBeNull();
		expect(next.foundLemmas).toContain("сталіца");
		expect(next.guesses).toContain("сталіца");
		expect(next.currentInput).toBe("");
	});

	it("matches inflected forms by lemma", () => {
		const s = createInitialState();
		const next = gameReducer(s, {
			type: "SUBMIT_GUESS",
			rawGuess: "горада",
			tokens,
			titleLemmas: NO_TITLE,
		});
		expect(next.errorType).toBeNull();
		expect(next.foundLemmas).toContain("горад");
		expect(next.guesses).toContain("горада");
	});

	it("rejects duplicates", () => {
		const s = createInitialState();
		const a = gameReducer(s, {
			type: "SUBMIT_GUESS",
			rawGuess: "сталіца",
			tokens,
			titleLemmas: NO_TITLE,
		});
		const b = gameReducer(a, {
			type: "SUBMIT_GUESS",
			rawGuess: "сталіцы",
			tokens,
			titleLemmas: NO_TITLE,
		});
		expect(b.errorType).toBe("already_found");
		expect(b.foundLemmas).toEqual(["сталіца"]);
	});

	it("rejects unknown words", () => {
		const s = createInitialState();
		const next = gameReducer(s, {
			type: "SUBMIT_GUESS",
			rawGuess: "аўтамабіль",
			tokens,
			titleLemmas: NO_TITLE,
		});
		expect(next.errorType).toBe("not_in_article");
		expect(next.foundLemmas).toEqual([]);
	});

	it("counts a word missing from the article as an attempt", () => {
		const s = createInitialState();
		const next = gameReducer(s, {
			type: "SUBMIT_GUESS",
			rawGuess: "аўтамабіль",
			tokens,
			titleLemmas: NO_TITLE,
		});
		expect(next.errorType).toBe("not_in_article");
		expect(next.guesses).toEqual(["аўтамабіль"]);
	});

	it("counts only unique valid guesses", () => {
		const miss = gameReducer(createInitialState(), {
			type: "SUBMIT_GUESS",
			rawGuess: "аўтамабіль",
			tokens,
			titleLemmas: NO_TITLE,
		});
		const repeated = gameReducer(miss, {
			type: "SUBMIT_GUESS",
			rawGuess: " аўтамабіль ",
			tokens,
			titleLemmas: NO_TITLE,
		});

		expect(repeated.errorType).toBe("already_tried");
		expect(repeated.guesses).toEqual(["аўтамабіль"]);
	});

	it("does not count a wrong keyboard layout as an attempt", () => {
		const next = gameReducer(createInitialState(), {
			type: "SUBMIT_GUESS",
			rawGuess: "xyz",
			tokens,
			titleLemmas: NO_TITLE,
		});

		expect(next.errorType).toBe("invalid_characters");
		expect(next.guesses).toEqual([]);
	});

	it("blocks new guesses after game finished", () => {
		const s = createInitialState();
		const finished = gameReducer(s, { type: "GIVE_UP", lemmas: [] });
		const next = gameReducer(finished, {
			type: "SUBMIT_GUESS",
			rawGuess: "сталіца",
			tokens,
			titleLemmas: NO_TITLE,
		});
		expect(next.errorType).toBe("no_guesses_after_finish");
		expect(next.foundLemmas).toEqual([]);
	});

	it("auto-wins once every title lemma has been guessed", () => {
		const titleLemmas = new Set(["мінск"]);
		const s = createInitialState();
		const next = gameReducer(s, {
			type: "SUBMIT_GUESS",
			rawGuess: "мінск",
			tokens,
			titleLemmas,
		});
		expect(next.won).toBe(true);
		expect(next.finishedAt).not.toBeNull();
	});

	it("reveals every article word on a win", () => {
		const titleLemmas = new Set(["мінск"]);
		const next = gameReducer(createInitialState(), {
			type: "SUBMIT_GUESS",
			rawGuess: "мінск",
			tokens,
			titleLemmas,
		});
		expect(new Set(next.foundLemmas)).toEqual(collectLemmas(tokens));
	});

	it("does not win while some title lemmas are still missing", () => {
		const titleLemmas = new Set(["мінск", "сталіца"]);
		const s = createInitialState();
		const next = gameReducer(s, {
			type: "SUBMIT_GUESS",
			rawGuess: "мінск",
			tokens,
			titleLemmas,
		});
		expect(next.won).toBe(false);
		expect(next.finishedAt).toBeNull();
	});

	it("replaces a miss with success feedback", () => {
		const miss = gameReducer(createInitialState(), {
			type: "SUBMIT_GUESS",
			rawGuess: "аўтамабіль",
			tokens,
			titleLemmas: NO_TITLE,
		});
		const hit = gameReducer(miss, {
			type: "SUBMIT_GUESS",
			rawGuess: "горад",
			tokens,
			titleLemmas: NO_TITLE,
		});

		expect(hit.errorType).toBeNull();
		expect(hit.statusMessage).toBe("Расшыфравана: горад");
	});

	it("replaces duplicate feedback with the next successful guess", () => {
		const first = gameReducer(createInitialState(), {
			type: "SUBMIT_GUESS",
			rawGuess: "горад",
			tokens,
			titleLemmas: NO_TITLE,
		});
		const duplicate = gameReducer(first, {
			type: "SUBMIT_GUESS",
			rawGuess: "горада",
			tokens,
			titleLemmas: NO_TITLE,
		});
		const hit = gameReducer(duplicate, {
			type: "SUBMIT_GUESS",
			rawGuess: "сталіца",
			tokens,
			titleLemmas: NO_TITLE,
		});

		expect(hit.errorType).toBeNull();
		expect(hit.statusMessage).toBe("Расшыфравана: сталіца");
	});
});

describe("USE_HINT", () => {
	it("increments hintsUsed up to the maximum of 3", () => {
		let s = createInitialState();
		for (const lemma of ["горад", "мінск", "гісторыя", "рака"]) {
			s = gameReducer(s, { type: "USE_HINT", lemma, revealedCount: 1 });
		}
		expect(s.hintsUsed).toBe(3);
		expect(s.foundLemmas).toEqual(["горад", "мінск", "гісторыя"]);
	});

	it("refuses to open a word of the title", () => {
		const s = createInitialState();
		const next = gameReducer(s, {
			type: "USE_HINT",
			lemma: "мінск",
			revealedCount: 1,
			titleLemmas: new Set(["мінск"]),
		});
		expect(next).toBe(s);
	});

	it("refuses a word that is already open", () => {
		const s = gameReducer(createInitialState(), {
			type: "USE_HINT",
			lemma: "горад",
			revealedCount: 1,
		});
		const next = gameReducer(s, {
			type: "USE_HINT",
			lemma: "горад",
			revealedCount: 1,
		});
		expect(next).toBe(s);
	});

	it("reveals the given lemma as if it were found", () => {
		const s = createInitialState();
		const next = gameReducer(s, {
			type: "USE_HINT",
			lemma: "горад",
			revealedCount: 1,
		});
		expect(next.foundLemmas).toContain("горад");
		expect(next.highlighted).toBe("горад");
		expect(next.statusMessage).toBe("Падказка: «горад» — раскрыта 1");
	});

	it("reveals nothing when there's no eligible word", () => {
		const s = createInitialState();
		const next = gameReducer(s, {
			type: "USE_HINT",
			lemma: null,
			revealedCount: 0,
		});
		expect(next.hintsUsed).toBe(1);
		expect(next.foundLemmas).toEqual([]);
	});

	it("replaces an error with hint status", () => {
		const miss = gameReducer(createInitialState(), {
			type: "SUBMIT_GUESS",
			rawGuess: "аўтамабіль",
			tokens,
			titleLemmas: NO_TITLE,
		});
		const hinted = gameReducer(miss, {
			type: "USE_HINT",
			lemma: "горад",
			revealedCount: 1,
		});

		expect(hinted.errorType).toBeNull();
		expect(hinted.statusMessage).toBe("Падказка: «горад» — раскрыта 1");
	});
});

describe("GIVE_UP", () => {
	it("reveals the full article while preserving prior progress", () => {
		const guessed = gameReducer(createInitialState(), {
			type: "SUBMIT_GUESS",
			rawGuess: "горад",
			tokens,
			titleLemmas: NO_TITLE,
		});
		const next = gameReducer(guessed, {
			type: "GIVE_UP",
			lemmas: ["горад", "сталіца", "беларусь"],
		});

		expect(next.givenUp).toBe(true);
		expect(next.foundLemmas).toEqual(["горад", "сталіца", "беларусь"]);
		expect(next.guesses).toEqual(["горад"]);
		expect(next.finishedAt).not.toBeNull();
	});

	it("GIVE_UP marks givenUp and records finishedAt", () => {
		const s = createInitialState();
		const next = gameReducer(s, { type: "GIVE_UP", lemmas: [] });
		expect(next.givenUp).toBe(true);
		expect(next.won).toBe(false);
		expect(next.finishedAt).not.toBeNull();
	});

	it("RESTORE restores prior progress", () => {
		const progress = {
			date: "2026-07-11",
			articleId: "minsk",
			foundLemmas: ["горад", "сталіца"],
			guesses: ["горада", "сталіца"],
			won: true,
			givenUp: false,
			hintsUsed: 0,
			finishedAt: "2026-07-11T10:00:00Z",
		};
		const next = gameReducer(createInitialState(), {
			type: "RESTORE",
			progress,
		});
		expect(next.foundLemmas).toEqual(["горад", "сталіца"]);
		expect(next.won).toBe(true);
	});
});

describe("stateToProgress", () => {
	it("serializes game state for storage", () => {
		const s = createInitialState();
		const next = gameReducer(s, {
			type: "SUBMIT_GUESS",
			rawGuess: "сталіца",
			tokens,
			titleLemmas: NO_TITLE,
		});
		const p = stateToProgress("2026-07-11", "minsk", next);
		expect(p.date).toBe("2026-07-11");
		expect(p.articleId).toBe("minsk");
		expect(p.foundLemmas).toContain("сталіца");
	});
});
