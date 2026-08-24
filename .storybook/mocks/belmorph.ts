export async function loadDictAsync(): Promise<Record<string, never>> {
	return {};
}

export class MorphAnalyzer {
	parse(word: string) {
		return [
			{
				lemma: word.toLowerCase(),
				pluralize: () => ({ word }),
			},
		];
	}
}
