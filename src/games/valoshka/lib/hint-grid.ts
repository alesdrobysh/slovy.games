export interface HintGrid {
	lengthCounts: Map<number, number>;
	firstLetterGrid: Map<string, Map<number, number>>;
	prefixCounts: Map<string, number>;
	unfoundPangramCount: number;
}

export function buildHintGrid(
	answers: string[],
	foundWords: string[],
	pangrams: string[]
): HintGrid {
	const found = new Set(foundWords.map((w) => w.toLowerCase()));
	const unfound = answers.filter((a) => !found.has(a));

	const lengthCounts = new Map<number, number>();
	const firstLetterGrid = new Map<string, Map<number, number>>();
	const prefixCounts = new Map<string, number>();
	let unfoundPangramCount = 0;

	for (const word of unfound) {
		const len = word.length;
		lengthCounts.set(len, (lengthCounts.get(len) ?? 0) + 1);

		const first = word[0];
		if (!firstLetterGrid.has(first)) {
			firstLetterGrid.set(first, new Map());
		}
		const lenMap = firstLetterGrid.get(first);
		if (lenMap) {
			lenMap.set(len, (lenMap.get(len) ?? 0) + 1);
		}

		if (word.length >= 2) {
			const prefix = word.slice(0, 2);
			prefixCounts.set(prefix, (prefixCounts.get(prefix) ?? 0) + 1);
		}

		if (pangrams.includes(word)) {
			unfoundPangramCount++;
		}
	}

	return { lengthCounts, firstLetterGrid, prefixCounts, unfoundPangramCount };
}
