import type { ArticleToken, ValidationError } from "../types";
import { lemmaOf } from "./lemmatize";
import { collectLemmas } from "./tokenize";

/** Normalize a player guess: trim, lowercase, drop surrounding punctuation. */
export function normalizeGuess(raw: string): string {
	return raw
		.trim()
		.toLowerCase()
		.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
}

export interface ValidationResult {
	error: ValidationError | null;
	lemma: string | null;
	revealedCount: number;
}

/** Validate a guess against the article's token list and current found lemmas. */
export function validateGuess(
	rawGuess: string,
	tokens: ArticleToken[],
	foundLemmas: ReadonlySet<string>,
	titleLemmas: ReadonlySet<string> = new Set()
): ValidationResult {
	const normalized = normalizeGuess(rawGuess);
	if (normalized.length === 0) {
		return { error: "empty", lemma: null, revealedCount: 0 };
	}
	if (normalized.length < 2) {
		return { error: "too_short", lemma: null, revealedCount: 0 };
	}
	if (!/^[а-яёіў'’\-]+$/iu.test(normalized)) {
		return { error: "invalid_characters", lemma: null, revealedCount: 0 };
	}
	if (!/[\p{L}\p{N}]/u.test(normalized)) {
		return { error: "no_letters", lemma: null, revealedCount: 0 };
	}
	const lemma = lemmaOf(normalized);
	if (foundLemmas.has(lemma)) {
		return { error: "already_found", lemma, revealedCount: 0 };
	}
	const articleLemmas = collectLemmas(tokens);
	if (!articleLemmas.has(lemma) && !titleLemmas.has(lemma)) {
		return { error: "not_in_article", lemma, revealedCount: 0 };
	}
	let revealedCount = 0;
	for (const t of tokens) {
		if (t.type === "word" && t.lemma === lemma) revealedCount += 1;
	}
	return { error: null, lemma, revealedCount };
}

export const ERROR_MESSAGES: Record<ValidationError, string> = {
	empty: "Увядзіце слова",
	too_short: "Мінімум 2 літары",
	no_letters: "Патрэбныя літары",
	invalid_characters: "Толькі беларускія літары",
	already_tried: "Ужо спрабавалі",
	already_found: "Ужо расшыфравана",
	not_in_article: "Няма ў артыкуле",
	no_guesses_after_finish: "Гульня скончана",
};
