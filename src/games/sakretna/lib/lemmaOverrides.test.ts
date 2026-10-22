import articles from "../data/articles.json";
import titleNames from "../data/title-name-lemmas.json";
import {
	lemmaOverrideOf,
	migrateFoundLemmas,
	normalizeLemmaWord,
} from "./lemmaOverrides";
import { lemmaOf, lemmaReady } from "./lemmatize";
import { serverLemmaOf } from "./lemmatize.server";
import { createInitialState, gameReducer } from "./reducer";
import { collectLemmas, tokenize } from "./tokenize";
import { validateGuess } from "./validation";

beforeAll(() => lemmaReady);

it.each([
	"Мёбіус",
	"Мёбіуса",
	"Мёбіусу",
	"Мёбіусам",
	"Мёбіусе",
])("uses the same corrected lemma on server and client for %s", (form) => {
	expect(serverLemmaOf(form)).toBe("мёбіус");
	expect(lemmaOf(form)).toBe("мёбіус");
});

describe.each(titleNames)("title name $lemma in $articleId", ({
	articleId,
	lemma,
	forms,
	legacyLemmas,
}) => {
	const article = articles.find((article) => article.id === articleId);
	if (!article) throw new Error(`Missing article ${articleId}`);
	const title = tokenize(article.title, (word) =>
		serverLemmaOf(word, articleId)
	);
	const tokens = tokenize(article.body, (word) =>
		serverLemmaOf(word, articleId)
	);
	const required = collectLemmas(title.filter((token) => !token.isFree));

	it("reveals the title and all matching body forms with any case form", () => {
		expect(required.has(lemma)).toBe(true);
		const matching = tokens.filter(
			(token) =>
				token.type === "word" && forms.includes(normalizeLemmaWord(token.text))
		);
		expect(matching.length).toBeGreaterThan(0);
		for (const form of forms) {
			expect(lemmaOf(form, articleId)).toBe(lemma);
			expect(serverLemmaOf(form, articleId)).toBe(lemma);
			const result = validateGuess(
				form,
				tokens,
				new Set(),
				required,
				articleId
			);
			expect(result).toEqual({
				error: null,
				lemma,
				revealedCount: matching.length,
			});
			expect(
				validateGuess(form, tokens, new Set([lemma]), required, articleId).error
			).toBe("already_found");
		}
		expect(matching.every((token) => token.lemma === lemma)).toBe(true);
	});

	it("wins when the corrected name is the last missing title word", () => {
		const state = {
			...createInitialState(),
			foundLemmas: [...required].filter((word) => word !== lemma),
		};
		const next = gameReducer(state, {
			type: "SUBMIT_GUESS",
			rawGuess: forms[0],
			tokens,
			titleLemmas: required,
			articleId,
		});
		expect(next.won).toBe(true);
	});

	it("repairs saved predictions using the original guess", () => {
		for (const old of legacyLemmas) {
			expect(migrateFoundLemmas([old], [forms[0]], articleId)).toEqual([lemma]);
		}
	});
});

it("keeps ambiguous names scoped and preserves unrelated saved words", () => {
	expect(lemmaOverrideOf("Крыта", "wiki-28141")).toBe("крыт");
	expect(lemmaOverrideOf("Крыта", "another-article")).toBeUndefined();
	expect(lemmaOverrideOf("Крыта")).toBeUndefined();
	expect(migrateFoundLemmas(["крыты"], ["крыты"], "wiki-28141")).toEqual([
		"крыты",
	]);
});

it.each([
	"Аліг’еры",
	"Аліг'еры",
	"Алігʼеры",
])("accepts the full surname %s", (form) => {
	const tokens = tokenize(`Дантэ ${form}`, (word) =>
		serverLemmaOf(word, "wiki-45607")
	);
	expect(tokens.filter((token) => token.type === "word")).toHaveLength(2);
	expect(
		validateGuess(form, tokens, new Set(), new Set(), "wiki-45607").lemma
	).toBe("аліг'еры");
});

it("matches the title and every body form with one guess", () => {
	const title = tokenize("Стужка Мёбіуса", serverLemmaOf);
	const body = tokenize("Мёбіуса Мёбіусам Мёбіус", serverLemmaOf);
	const result = validateGuess("Мёбіус", body, new Set(), collectLemmas(title));
	expect(result).toEqual({ error: null, lemma: "мёбіус", revealedCount: 3 });
	expect(title.find((token) => token.text === "Мёбіуса")?.lemma).toBe(
		result.lemma
	);
	expect(validateGuess("Мёбіуса", body, new Set(["мёбіус"])).error).toBe(
		"already_found"
	);
});
