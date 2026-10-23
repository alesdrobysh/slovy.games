import type { ArticleToken, ValidationError } from "../types";
import { normalizeLemmaWord } from "./lemmaOverrides";
import { lemmasOf } from "./lemmatize";
import { collectLemmas } from "./tokenize";

/** Normalize a player guess: trim, lowercase, drop surrounding punctuation. */
export function normalizeGuess(raw: string): string {
	return normalizeLemmaWord(raw.trim()).replace(
		/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu,
		""
	);
}

export interface ValidationResult {
	error: ValidationError | null;
	lemma: string | null;
	/** Newly revealed lemmas; a form like беларускі can open several. */
	lemmas: string[];
	revealedCount: number;
}

/** Validate a guess against the article's token list and current found lemmas. */
export function validateGuess(
	rawGuess: string,
	tokens: ArticleToken[],
	foundLemmas: ReadonlySet<string>,
	titleLemmas: ReadonlySet<string> = new Set(),
	articleId?: string
): ValidationResult {
	const normalized = normalizeGuess(rawGuess);
	if (normalized.length === 0) {
		return { error: "empty", lemma: null, lemmas: [], revealedCount: 0 };
	}
	if (normalized.length < 2) {
		return { error: "too_short", lemma: null, lemmas: [], revealedCount: 0 };
	}
	if (!/^[а-яёіў'’-]+$/iu.test(normalized)) {
		return {
			error: "invalid_characters",
			lemma: null,
			lemmas: [],
			revealedCount: 0,
		};
	}
	if (!/[\p{L}\p{N}]/u.test(normalized)) {
		return { error: "no_letters", lemma: null, lemmas: [], revealedCount: 0 };
	}
	const candidates = lemmasOf(normalized, articleId);
	const articleLemmas = collectLemmas(tokens);
	const present = candidates.filter(
		(l) => articleLemmas.has(l) || titleLemmas.has(l)
	);
	if (present.length === 0) {
		return {
			error: "not_in_article",
			lemma: candidates[0],
			lemmas: [],
			revealedCount: 0,
		};
	}
	const lemmas = present.filter((l) => !foundLemmas.has(l));
	if (lemmas.length === 0) {
		return {
			error: "already_found",
			lemma: present[0],
			lemmas: [],
			revealedCount: 0,
		};
	}
	let revealedCount = 0;
	for (const t of tokens) {
		if (t.type === "word" && t.lemma && lemmas.includes(t.lemma))
			revealedCount += 1;
	}
	return { error: null, lemma: lemmas[0], lemmas, revealedCount };
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
