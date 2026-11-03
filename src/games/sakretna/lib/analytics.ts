import posthog from "posthog-js";
import type { GameState } from "../types";

/** Track committed gameplay transitions, never restored progress or input edits. */
export function trackSakretnaTransition(
	previous: GameState,
	current: GameState,
	date: string,
	articleId: string
) {
	// The shared provider initializes PostHog only after analytics consent.
	if (!(posthog as { __loaded?: boolean }).__loaded) return;
	if (previous.won || previous.givenUp) return;
	const guessed = current.guesses.length > previous.guesses.length;
	const hinted = current.hintsUsed > previous.hintsUsed;
	const won = current.won && !previous.won;
	const gaveUp = current.givenUp && !previous.givenUp;
	if (!guessed && !hinted && !won && !gaveUp) return;

	const properties = {
		game: "sakretna",
		date,
		article_id: articleId,
		attempts: current.guesses.length,
		hints_used: current.hintsUsed,
	};
	if (previous.guesses.length === 0 && previous.hintsUsed === 0) {
		posthog.capture("sakretna_game_started", properties);
	}
	if (guessed) {
		posthog.capture("sakretna_guess_submitted", {
			...properties,
			word: current.guesses[current.guesses.length - 1],
			is_hit: current.errorType === null,
		});
	}
	if (hinted) posthog.capture("sakretna_hint_used", properties);
	if (won) posthog.capture("sakretna_game_won", properties);
	if (gaveUp) posthog.capture("sakretna_game_gave_up", properties);
}
