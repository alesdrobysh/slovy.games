type ParseResult = {
	lemma: string;
	pluralize: (count: number, targetCase: string) => { word: string };
};

export class MorphAnalyzer {
	parse(word: string): ParseResult[] {
		const lemma = word.toLowerCase();
		return [
			{
				lemma,
				pluralize: (count, targetCase) => ({
					word: `${targetCase}:${count}:${lemma}`,
				}),
			},
		];
	}
}

export function loadDictAsync(): Promise<Record<string, never>> {
	return Promise.resolve({});
}

export function loadDict(): Record<string, never> {
	return {};
}
