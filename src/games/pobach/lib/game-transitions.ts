import type { Guess } from "@/games/pobach/types";

/** Normalize raw guess input: trim, lowercase, unify apostrophe variants. */
export function normalizeGuessWord(raw: string): string {
	return raw.trim().toLowerCase().replace(/[’ʼ`]/g, "'");
}

export function isDuplicateGuess(guesses: Guess[], word: string): boolean {
	return guesses.some((g) => g.word === word);
}

/** True when a response's dayIndex no longer matches the day the hook is
 *  currently tracking — the in-memory guesses/won/gameOver state belongs to
 *  a stale day and must be reset before the new result is applied. */
export function didDayRollover(
	currentDayIndex: number | null,
	incomingDayIndex: number
): boolean {
	return currentDayIndex !== null && incomingDayIndex !== currentDayIndex;
}

export function insertGuessSorted(guesses: Guess[], guess: Guess): Guess[] {
	return [...guesses, guess].sort((a, b) => a.rank - b.rank);
}
