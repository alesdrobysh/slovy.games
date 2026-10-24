import { getWrappedStats as pobachWrappedStats } from "@/games/pobach/lib/wrapped-stats";
import { getWrappedStats as sakretnaWrappedStats } from "@/games/sakretna/lib/wrapped-stats";
import { getWrappedStats as valoshkaWrappedStats } from "@/games/valoshka/lib/wrapped-stats";
import type { GameId } from "@/shared/config";
import type { GameYearStats } from "@/shared/types/wrapped";

/** Data a provider cannot read from localStorage. Сакрэтна saves only an
 *  article id, and the article list is too large to ship to the client, so
 *  the server passes the titles in. */
export interface WrappedProviderContext {
	sakretnaTitles: Record<string, string>;
}

/** Each game owns its storage schema and reports a year of activity through
 *  this registry, so shared code never parses another game's localStorage.
 *  Сакрэтна is in beta, but a player who never opened it has no data and
 *  simply gets no Сакрэтна slides. */
export const WRAPPED_PROVIDERS: Record<
	string,
	(year: number, context: WrappedProviderContext) => GameYearStats
> = {
	pobach: pobachWrappedStats,
	valoshka: valoshkaWrappedStats,
	sakretna: (year, context) =>
		sakretnaWrappedStats(year, context.sakretnaTitles),
};

/** Canonical presentation order: Побач, Валошка, Сакрэтна. `perGame` is
 *  sorted by this in `computeWrappedSummary`, so slide order and
 *  game-of-the-year tie-breaks never depend on storage read order. */
export const WRAPPED_GAME_ORDER: GameId[] = ["pobach", "valoshka", "sakretna"];

/** Read every registered game's stats. */
export function collectWrappedStats(
	year: number,
	context: WrappedProviderContext
): GameYearStats[] {
	return Object.values(WRAPPED_PROVIDERS).map((read) => read(year, context));
}
