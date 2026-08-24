import { belmorphMock, flushMicrotasks, setLemma } from "./belmorph.mock";

jest.mock("belmorph", () => belmorphMock, { virtual: true });

import type { ArticleToken } from "../types";
import { tokenize } from "./tokenize";
import { normalizeGuess, validateGuess } from "./validation";

const ARTICLE =
	"Горад Мінск — сталіца Беларусі, адміністрацыйны цэнтр Мінскай вобласці.";
let tokens: ArticleToken[];

beforeAll(async () => {
	setLemma("горад", "горад");
	setLemma("мінск", "мінск");
	setLemma("сталіца", "сталіца");
	setLemma("беларусь", "беларусь");
	setLemma("адміністрацыйны", "адміністрацыйны");
	setLemma("цэнтр", "цэнтр");
	setLemma("мінскі", "мінскі");
	setLemma("вобласць", "вобласць");
	setLemma("горада", "горад");
	setLemma("сталіцы", "сталіца");
	tokens = tokenize(ARTICLE);
	await flushMicrotasks();
});

describe("normalizeGuess", () => {
	it("lowercases and trims", () => {
		expect(normalizeGuess("  Мінск  ")).toBe("мінск");
	});

	it("strips surrounding punctuation", () => {
		expect(normalizeGuess('"горад!"')).toBe("горад");
	});
});

describe("validateGuess", () => {
	it("rejects empty input", () => {
		expect(validateGuess("", tokens, new Set()).error).toBe("empty");
		expect(validateGuess("   ", tokens, new Set()).error).toBe("empty");
	});

	it("rejects too-short input", () => {
		expect(validateGuess("а", tokens, new Set()).error).toBe("too_short");
	});

	it("rejects guesses not present in the article", () => {
		const result = validateGuess("аўтамабіль", tokens, new Set());
		expect(result.error).toBe("not_in_article");
	});

	it("rejects duplicates", () => {
		const result = validateGuess("горад", tokens, new Set(["горад"]));
		expect(result.error).toBe("already_found");
	});

	it("accepts a word present in the article", () => {
		const result = validateGuess("сталіца", tokens, new Set());
		expect(result.error).toBeNull();
		expect(result.lemma).toBe("сталіца");
		expect(result.revealedCount).toBeGreaterThan(0);
	});

	it("matches a different inflected form by lemma", () => {
		const result = validateGuess("горада", tokens, new Set());
		expect(result.error).toBeNull();
		expect(result.lemma).toBe("горад");
	});

	it("accepts a required title lemma that is missing from the body", () => {
		setLemma("ельскі", "ельскі");
		const result = validateGuess(
			"Ельскі",
			tokens,
			new Set(),
			new Set(["ельскі"])
		);

		expect(result).toEqual({
			error: null,
			lemma: "ельскі",
			revealedCount: 0,
		});
	});
});
