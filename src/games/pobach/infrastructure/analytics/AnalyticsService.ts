import posthog from "posthog-js";

export class AnalyticsService {
	readonly sessionId: string;
	private dayIndex: number | null = null;

	constructor(sessionId: string) {
		this.sessionId = sessionId;
	}

	setDayIndex(dayIndex: number): void {
		this.dayIndex = dayIndex;
	}

	trackGameStart(): void {
		posthog.capture("pobach_game_started", {
			session_id: this.sessionId,
			day_index: this.dayIndex,
		});
	}

	trackGuess(word: string, rank: number, similarity: number): void {
		posthog.capture("pobach_guess_submitted", {
			session_id: this.sessionId,
			day_index: this.dayIndex,
			word,
			rank,
			similarity,
		});
	}

	trackUnknownWord(word: string): void {
		posthog.capture("pobach_unknown_word_submitted", {
			session_id: this.sessionId,
			day_index: this.dayIndex,
			word,
		});
	}

	trackHint(word: string, rank: number): void {
		posthog.capture("pobach_hint_used", {
			session_id: this.sessionId,
			day_index: this.dayIndex,
			word,
			rank,
		});
	}

	trackWin(attempts: number): void {
		posthog.capture("pobach_game_won", {
			session_id: this.sessionId,
			day_index: this.dayIndex,
			attempts,
		});
	}

	trackGiveUp(attempts: number, bestRank: number): void {
		posthog.capture("pobach_game_gave_up", {
			session_id: this.sessionId,
			day_index: this.dayIndex,
			attempts,
			best_rank: bestRank,
		});
	}
}
