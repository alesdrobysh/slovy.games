import { MorphAnalyzer, loadDictAsync, type CaseName } from "belmorph";

const pr = new Intl.PluralRules("be-BY");

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

	const rule = pr.select(count);
	if (rule === "one") {
		return res.inflect({ number: "singular", case: targetCase })?.word ?? word;
	}
	if (rule === "few") {
		return res.inflect({ number: "plural", case: targetCase })?.word ?? word;
	}
	return res.inflect({ number: "plural", case: "genitive" })?.word ?? word;
}
