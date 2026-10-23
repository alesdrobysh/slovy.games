export const lemmaReady = Promise.resolve();

export function lemmaOf(word: string): string {
	return word.toLowerCase();
}

export function pluralizeCount(_count: number, word: string): string {
	return word;
}

export function lemmasOf(word: string): string[] {
	return [lemmaOf(word)];
}
