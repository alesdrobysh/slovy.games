import { type CaseName, MorphAnalyzer } from "belmorph";

const isBrowser = typeof window !== "undefined";

let analyzer: MorphAnalyzer | null = null;
let loadingPromise: Promise<void> | null = null;

/** Resolves once the dictionary has loaded and `lemmaOf` returns real lemmas. */
export const lemmaReady: Promise<void> = startLoading();

function startLoading(): Promise<void> {
	if (!isBrowser) return Promise.resolve();
	if (!loadingPromise) {
		loadingPromise = import("belmorph").then(async ({ loadDictAsync }) => {
			const dict = await loadDictAsync("/dict/");
			analyzer = new MorphAnalyzer(dict);
		});
	}
	return loadingPromise;
}

export function lemmaOf(word: string): string {
	const normalizedWord = word.toLowerCase();
	if (!analyzer) return word.toLowerCase();
	const res = analyzer.parse(normalizedWord);
	return res?.[0]?.lemma?.toLowerCase() ?? normalizedWord;
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
