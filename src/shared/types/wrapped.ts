import type { GameId } from "@/shared/config";

/** One labelled fact on a slide. Labels are player-facing Belarusian. */
export interface WrappedHighlight {
	key: string;
	label: string;
	value: string | number;
}

/** A single game's contribution to the year recap. Every field is scoped to
 *  `year` — providers recompute from dated data rather than reusing all-time
 *  aggregates, which would be wrong once a second year exists. */
export interface GameYearStats {
	gameId: GameId;
	year: number;
	/** `YYYY-MM-DD`, ascending, deduplicated. */
	daysPlayed: string[];
	daysWon: string[];
	longestStreakInYear: number;
	/** Game-specific facts. A fact that cannot be derived is omitted, never 0. */
	highlights: WrappedHighlight[];
}
