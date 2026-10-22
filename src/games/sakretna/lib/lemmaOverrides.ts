import titleNames from "../data/title-name-lemmas.json" with { type: "json" };

// belmorph predicts unknown proper names independently for each surface form.
// Scope ambiguous names to their article: Крыта must not change крыты elsewhere.
const OVERRIDES = new Map(
	["мёбіус", "мёбіуса", "мёбіусу", "мёбіусам", "мёбіусе"].map(
		(form) => [form, "мёбіус"] as const
	)
);

export function normalizeLemmaWord(word: string): string {
	return word.toLowerCase().replace(/[‘’ʼ]/gu, "'");
}

const byArticle = new Map<string, Map<string, string>>();
for (const { articleId, lemma, forms } of titleNames) {
	let formsMap = byArticle.get(articleId);
	if (!formsMap) {
		formsMap = new Map();
		byArticle.set(articleId, formsMap);
	}
	for (const form of forms) formsMap.set(form, lemma);
}

export function lemmaOverrideOf(
	word: string,
	articleId?: string
): string | undefined {
	const normalized = normalizeLemmaWord(word);
	return (
		(articleId ? byArticle.get(articleId)?.get(normalized) : undefined) ??
		OVERRIDES.get(normalized)
	);
}

/** Repair old predictor results only when a recorded guess identifies the name.
 * A bare legacy lemma such as крыты may belong to an ordinary word instead. */
export function migrateFoundLemmas(
	found: string[],
	guesses: string[],
	articleId: string
): string[] {
	const identifiedNames = titleNames.filter(
		(entry) =>
			entry.articleId === articleId &&
			guesses.some((guess) => entry.forms.includes(normalizeLemmaWord(guess)))
	);
	return [
		...new Set(
			found.map((lemma) => {
				const name = identifiedNames.find((entry) =>
					entry.legacyLemmas.includes(lemma)
				);
				return name?.lemma ?? lemmaOverrideOf(lemma, articleId) ?? lemma;
			})
		),
	];
}
