export interface Article {
	id: string;
	title: string;
	body: string;
	source: string;
	author?: string;
	retrieved: string;
}

export type ArticleTokenType = "word" | "sep";

export interface ArticleToken {
	type: ArticleTokenType;
	text: string;
	lemma?: string;
	isFree?: boolean;
}

export interface SavedProgress {
	date: string;
	articleId: string;
	foundLemmas: string[];
	guesses: string[];
	won: boolean;
	givenUp: boolean;
	hintsUsed: number;
	startedAt?: string;
	finishedAt?: string;
}

export interface GameStats {
	datesPlayed: string[];
	datesWon: string[];
	currentStreak: number;
	longestStreak: number;
	totalPlayed: number;
	totalWins: number;
	hintsUsedCount: number;
	winsByAttempts: number[];
}

export interface GameState {
	currentInput: string;
	foundLemmas: string[];
	guesses: string[];
	errorType: ValidationError | null;
	errorKey: number;
	statusMessage: string | null;
	won: boolean;
	givenUp: boolean;
	hintsUsed: number;
	startedAt: string;
	finishedAt: string | null;
	highlighted: string | null;
}

export type ValidationError =
	| "empty"
	| "too_short"
	| "no_letters"
	| "invalid_characters"
	| "already_tried"
	| "already_found"
	| "not_in_article"
	| "no_guesses_after_finish";

export type GameAction =
	| {
			type: "SUBMIT_GUESS";
			rawGuess: string;
			tokens: ArticleToken[];
			titleLemmas: Set<string>;
	  }
	| {
			type: "USE_HINT";
			lemma: string | null;
			revealedCount: number;
			titleLemmas?: ReadonlySet<string>;
	  }
	| { type: "GIVE_UP"; lemmas: string[] }
	| { type: "RESTORE"; progress: SavedProgress }
	| { type: "CLEAR_ERROR" }
	| { type: "SET_INPUT"; value: string }
	| { type: "SET_HIGHLIGHT"; lemma: string | null };

export interface PickedArticle {
	article: Article;
	tokens: ArticleToken[];
	titleTokens: ArticleToken[];
	date: string;
}
