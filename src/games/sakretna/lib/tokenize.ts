import type { ArticleToken } from "../types";
import { FREE_WORD_LEMMAS, MIN_REDACTED_LENGTH } from "./constants";
import { lemmaOf as clientLemmaOf } from "./lemmatize";

/**
 * Regex matching a contiguous run of letter characters in the Cyrillic or
 * Latin scripts. Diacritics are kept as part of the word. Numbers and other
 * characters fall into the separator bucket.
 */
const LETTER_RUN = /[\p{Letter}\p{M}]+/u;

/**
 * Tokenize plain text into word/separator tokens, computing a lemma and
 * `isFree` flag for each word token. Pure function; lemmatization results
 * depend on the analyzer being loaded. On the server, the caller is expected
 * to pre-load the dictionary or pass in a `serverLemmaOf` from
 * `./lemmatize.server` so the resulting tokens carry real lemmas.
 */
export function tokenize(
	text: string,
	lemmaFn: (word: string) => string = clientLemmaOf
): ArticleToken[] {
	const tokens: ArticleToken[] = [];
	let i = 0;
	while (i < text.length) {
		const ch = text[i];
		if (LETTER_RUN.test(ch)) {
			const match = text.slice(i).match(LETTER_RUN);
			if (!match) break;
			const word = match[0];
			const lemma = lemmaFn(word);
			const isFree =
				word.length < MIN_REDACTED_LENGTH || FREE_WORD_LEMMAS.has(lemma);
			tokens.push({ type: "word", text: word, lemma, isFree });
			i += word.length;
		} else {
			tokens.push({ type: "sep", text: ch });
			i += 1;
		}
	}
	return tokens;
}

/** Lowercase lookup of all distinct word lemmas present in the token list. */
export function collectLemmas(tokens: ArticleToken[]): Set<string> {
	const lemmas = new Set<string>();
	for (const t of tokens) {
		if (t.type === "word" && t.lemma) lemmas.add(t.lemma);
	}
	return lemmas;
}

/**
 * Distinct non-free word lemmas that make up an article title. Free/common
 * words are excluded since they're never redacted and so don't need to be
 * guessed to complete the title.
 */
export function titleLemmas(
	title: string,
	lemmaFn: (word: string) => string = clientLemmaOf
): Set<string> {
	const lemmas = new Set<string>();
	for (const t of tokenize(title, lemmaFn)) {
		if (t.type === "word" && t.lemma && !t.isFree) lemmas.add(t.lemma);
	}
	return lemmas;
}
