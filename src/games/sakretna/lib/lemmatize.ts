import { type CaseName, MorphAnalyzer } from "belmorph";
import posthog from "posthog-js";
import { DICT_URL } from "@/shared/lib/dictUrl";
import { lemmaOverrideOf } from "./lemmaOverrides";

const isBrowser = typeof window !== "undefined";

let analyzer: MorphAnalyzer | null = null;
let loadingPromise: Promise<void> | null = null;

/** Resolves once the dictionary load settles. If the load fails, it still
 *  resolves and `lemmaOf` falls back to the lowercased word. */
export const lemmaReady: Promise<void> = startLoading();

function startLoading(): Promise<void> {
	if (!isBrowser) return Promise.resolve();
	if (!loadingPromise) {
		loadingPromise = import("belmorph")
			.then(async ({ loadDictAsync }) => {
				const dict = await loadDictAsync(DICT_URL);
				analyzer = new MorphAnalyzer(dict);
			})
			.catch((err) => {
				console.error("Failed to load belmorph dictionary", err);
				posthog.captureException(err);
			});
	}
	return loadingPromise;
}

export function lemmaOf(word: string, articleId?: string): string {
	return lemmasOf(word, articleId)[0];
}

/** Every distinct lemma the word can be a form of, most likely first:
 *  беларускі is both the adjective беларускі and a form of беларуска. */
export function lemmasOf(word: string, articleId?: string): string[] {
	const override = lemmaOverrideOf(word, articleId);
	if (override) return [override];
	const normalizedWord = word.toLowerCase();
	if (!analyzer) return [normalizedWord];
	const lemmas = (analyzer.parse(normalizedWord) ?? []).map((r) =>
		r.lemma.toLowerCase()
	);
	return lemmas.length > 0 ? [...new Set(lemmas)] : [normalizedWord];
}

export function pluralizeCount(
	count: number,
	word: string,
	targetCase: CaseName = "nominative"
): string {
	if (!analyzer) return word;
	const res = analyzer.parse(word)?.[0];
	if (!res) return word;
	return res.pluralize(count, targetCase)?.word ?? word;
}
