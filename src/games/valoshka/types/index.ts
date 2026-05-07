export interface Puzzle {
	date: string;
	center: string;
	outer: string[];
	answers: string[];
	pangrams: string[];
	max_score: number;
}

export type ValidationError =
	| "too_short"
	| "missing_center"
	| "not_in_list"
	| "already_found";

export interface SavedProgress {
	date: string;
	foundWords: string[];
	score: number;
	hint?: HintState;
}

export interface Rank {
	name: string;
	threshold: number;
}

export interface HintState {
	targetWord: string | null;
	revealedIndices: number[];
	isActive: boolean;
}

export interface GameState {
	currentInput: string;
	foundWords: string[];
	score: number;
	outerLetters: string[];
	errorType: ValidationError | null;
	errorKey: number;
	lastFoundWord: string | null;
	lastFoundIsPangram: boolean;
	hint: HintState;
}

export interface GameStats {
	datesPlayed: string[];
	currentStreak: number;
	longestStreak: number;
	topRankCount: number;
	totalWordsFound: number;
	perDateBest: Record<string, { rankIdx: number; foundCount: number }>;
}

export type GameAction =
	| { type: "TYPE_LETTER"; letter: string }
	| { type: "DELETE_LETTER" }
	| { type: "SUBMIT"; answers: string[]; pangrams: string[]; center: string }
	| { type: "SHUFFLE" }
	| { type: "CLEAR_ERROR" }
	| { type: "CLEAR_LAST_FOUND" }
	| { type: "RESTORE"; foundWords: string[]; score: number }
	| { type: "START_HINT"; answers: string[]; foundWords: string[] }
	| { type: "REVEAL_NEXT_LETTER" }
	| { type: "CLEAR_HINT" }
	| { type: "RESTORE_HINT"; hint: HintState };
