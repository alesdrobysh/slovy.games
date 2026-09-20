import { getWrappedStats as pobachWrappedStats } from "@/games/pobach/lib/wrapped-stats";
import { getWrappedStats as valoshkaWrappedStats } from "@/games/valoshka/lib/wrapped-stats";
import type { GameId } from "@/shared/config";
import type { GameYearStats } from "@/shared/types/wrapped";

/** Each game owns its storage schema and reports a year of activity through
 *  this registry, so shared code never parses another game's localStorage.
 *  Sakretna is intentionally absent until it ships publicly. */
export const WRAPPED_PROVIDERS: Record<
	string,
	(year: number) => GameYearStats
> = {
	pobach: pobachWrappedStats,
	valoshka: valoshkaWrappedStats,
};

/** Canonical presentation order: Побач first, then Валошка. `perGame` is
 *  sorted by this in `computeWrappedSummary`, so slide order and
 *  game-of-the-year tie-breaks never depend on storage read order. */
export const WRAPPED_GAME_ORDER: GameId[] = ["pobach", "valoshka"];

/** Read every registered game's stats. */
export function collectWrappedStats(year: number): GameYearStats[] {
	return Object.values(WRAPPED_PROVIDERS).map((read) => read(year));
}
