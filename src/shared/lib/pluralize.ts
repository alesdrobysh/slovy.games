import { MorphAnalyzer, loadDictAsync, type CaseName } from "belmorph";

let _analyzer: MorphAnalyzer | null = null;

if (typeof window !== "undefined") {
	loadDictAsync("/dict/").then((dict) => {
		_analyzer = new MorphAnalyzer(dict);
	});
}

export function pluralize(
	count: number,
	word: string,
	targetCase: CaseName = "nominative"
): string {
	const res = _analyzer?.parse(word)?.[0];
	if (!res) return word;

	return res.pluralize(count, targetCase)?.word ?? word;
}
