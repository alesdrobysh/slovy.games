/**
 * Virtual mock for the "belmorph" package, used by sakretna tests.
 * `belmorph` ships only an ESM `import` export condition so it can't be
 * `require()`d under ts-jest's CJS transform. The virtual mock registers
 * without Jest trying to resolve the real package first.
 *
 * The mock exposes a tiny custom lemma dictionary controlled via
 * `setLemma(word, lemma)`; if a word has no entry, its lemma is its
 * lowercase form (a faithful-enough approximation for tests that only
 * need same-form matching).
 */

type MockParseResult = {
	lemma: string;
	pluralize: (count: number, targetCase: string) => { word: string } | null;
};

const lemmaMap = new Map<string, string>();

const defaultParse = (word: string): MockParseResult[] => {
	const lemma = lemmaMap.get(word.toLowerCase()) ?? word.toLowerCase();
	return [
		{
			lemma,
			pluralize: (count: number, targetCase: string) => ({
				word: `${targetCase}:${count}:${lemma}`,
			}),
		},
	];
};

let parseImpl: (word: string) => MockParseResult[] = defaultParse;

export function setLemma(word: string, lemma: string): void {
	lemmaMap.set(word.toLowerCase(), lemma.toLowerCase());
}

export function resetLemmas(): void {
	lemmaMap.clear();
	parseImpl = defaultParse;
}

export function setParseImpl(fn: (word: string) => MockParseResult[]): void {
	parseImpl = fn;
}

export function flushMicrotasks(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, 0));
}

const parse = jest.fn((word: string) => parseImpl(word));

export const belmorphMock = {
	MorphAnalyzer: jest.fn().mockImplementation(() => ({ parse })),
	loadDictAsync: jest.fn(() => Promise.resolve({})),
	__parseMock: parse,
};
