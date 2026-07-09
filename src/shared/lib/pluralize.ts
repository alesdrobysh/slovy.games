import { MorphAnalyzer, loadDictAsync, type CaseName } from "belmorph";

let _analyzer: MorphAnalyzer | null = null;

/** Resolves once the dictionary has loaded and `pluralize` can inflect words.
 *  Callers that compute pluralized text once (e.g. in an effect on mount)
 *  should re-run after this settles, since it can still be loading then. */
export const dictReady: Promise<void> =
	typeof window !== "undefined"
		? loadDictAsync("/dict/").then((dict) => {
				_analyzer = new MorphAnalyzer(dict);
			})
		: Promise.resolve();

export function pluralize(
	count: number,
	word: string,
	targetCase: CaseName = "nominative"
): string {
	const res = _analyzer?.parse(word)?.[0];
	if (!res) return word;

	return res.pluralize(count, targetCase)?.word ?? word;
}
