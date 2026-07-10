import { belmorphMock, flushMicrotasks, setLemma } from "./belmorph.mock";

// `belmorph` only ships an ESM `import` export condition; virtual: true
// registers the mock without Jest trying to resolve the real package.
jest.mock("belmorph", () => belmorphMock, { virtual: true });

import { collectLemmas, tokenize } from "./tokenize";

beforeAll(async () => {
	await flushMicrotasks();
});

describe("tokenize", () => {
	it("splits text into word and sep tokens", () => {
		const tokens = tokenize("Горад Мінск — сталіца.");
		const words = tokens.filter((t) => t.type === "word");
		const seps = tokens.filter((t) => t.type === "sep");
		expect(words.length).toBeGreaterThan(2);
		expect(seps.length).toBeGreaterThan(0);
	});

	it("keeps punctuation in sep tokens in original order", () => {
		const tokens = tokenize("а, б; в.");
		const texts = tokens.map((t) => t.text);
		expect(texts.join("")).toBe("а, б; в.");
	});

	it("marks short Belarusian function words as free", () => {
		const tokens = tokenize("і у на");
		for (const t of tokens) {
			if (t.type === "word") {
				expect(t.isFree).toBe(true);
			}
		}
	});

	it("does not mark longer content words as free", () => {
		setLemma("сталіца", "сталіца");
		const tokens = tokenize("сталіца");
		const word = tokens.find((t) => t.type === "word");
		expect(word).toBeDefined();
		expect(word?.isFree).toBe(false);
	});

	it("populates a lemma for word tokens", () => {
		setLemma("горада", "горад");
		const tokens = tokenize("горада");
		const word = tokens.find((t) => t.type === "word");
		expect(word).toBeDefined();
		expect(word?.lemma).toBe("горад");
	});

	it("preserves word casing in text", () => {
		setLemma("мінск", "мінск");
		const tokens = tokenize("Мінск");
		const word = tokens.find((t) => t.type === "word");
		expect(word?.text).toBe("Мінск");
		expect(word?.lemma).toBe("мінск");
	});
});

describe("collectLemmas", () => {
	it("returns a unique set of lemmas", () => {
		setLemma("горада", "горад");
		setLemma("горадам", "горад");
		const tokens = tokenize("горада горад горадам");
		const lemmas = collectLemmas(tokens);
		expect(lemmas.size).toBe(1);
		expect(lemmas.has("горад")).toBe(true);
	});
});
