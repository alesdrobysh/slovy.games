import type { GameId } from "@/shared/config";

/** One labelled fact on a slide. Labels and captions are player-facing
 *  Belarusian. */
export interface WrappedHighlight {
	key: string;
	label: string;
	value: string | number;
	/** Small print under the value, e.g. "4 спробы, без падказак". */
	caption?: string;
	/** Words shown as chips under the caption. */
	words?: string[];
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
	/** The big number on the game's first slide, e.g. 118 "слоў адгадана". */
	headline: { value: number; caption: string };
	/** Game-specific facts. A fact that cannot be derived is omitted, never 0. */
	highlights: WrappedHighlight[];
}

/** Cross-game recap. `activeDays` is the union across games, so a day played
 *  in two games counts once. */
export interface WrappedSummary {
	year: number;
	activeDays: string[];
	/** How many games were played on each active day, keyed `YYYY-MM-DD`. */
	gamesPerDay: Record<string, number>;
	longestStreakAnyGame: number;
	busiestMonth: { month: number; days: number } | null;
	gameOfTheYear: GameId | null;
	perGame: GameYearStats[];
	isThin: boolean;
}
