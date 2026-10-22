import { join } from "node:path";
import { MorphAnalyzer } from "belmorph";
import { loadDict } from "belmorph/node";
import { lemmaOverrideOf } from "./lemmaOverrides";

const DICT_DIR = join(process.cwd(), "node_modules", "belmorph", "dict");

let analyzer: MorphAnalyzer | null = null;

function getAnalyzer(): MorphAnalyzer {
	if (!analyzer) {
		analyzer = new MorphAnalyzer(loadDict(DICT_DIR));
	}
	return analyzer;
}

/** Lemmatize a single Belarusian word using the synchronous Node loader.
 *  Server-only — do not import from client components. */
export function serverLemmaOf(word: string, articleId?: string): string {
	const override = lemmaOverrideOf(word, articleId);
	if (override) return override;
	const normalizedWord = word.toLowerCase();
	const res = getAnalyzer().parse(normalizedWord);
	return res?.[0]?.lemma?.toLowerCase() ?? normalizedWord;
}
