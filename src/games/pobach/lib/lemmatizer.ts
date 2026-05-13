import { join } from "node:path";
import { type CaseName, MorphAnalyzer } from "belmorph";
import { loadDict } from "belmorph/node";

const DICT_DIR = join(process.cwd(), "node_modules", "belmorph", "dict");

let analyzer: MorphAnalyzer | null = null;

export function getAnalyzer(): MorphAnalyzer {
	if (!analyzer) {
		analyzer = new MorphAnalyzer(loadDict(DICT_DIR));
	}
	return analyzer;
}

export function lemmatize(word: string): string {
	const results = getAnalyzer().parse(word);
	return results[0]?.lemma ?? word;
}

/**
 * Returns the correct Belarusian plural form for a word using belmorph.
 * Follows the be-BY plural rules (1, 2-4, 5+).
 */
export function pluralize(
	count: number,
	word: string,
	targetCase: CaseName = "nominative"
): string {
	const results = getAnalyzer().parse(word);
	const res = results[0];
	if (!res) return word;

	const pr = new Intl.PluralRules("be-BY");
	const rule = pr.select(count);

	if (rule === "one") {
		return res.inflect({ number: "singular", case: targetCase })?.word ?? word;
	}
	if (rule === "few") {
		return res.inflect({ number: "plural", case: targetCase })?.word ?? word;
	}
	// 'many'
	return res.inflect({ number: "plural", case: "genitive" })?.word ?? word;
}
