import type { GameId } from "@/shared/config";
import type { WrappedSummary } from "@/shared/types/wrapped";

export type WrappedSlide =
	| { kind: "hero"; year: number }
	| { kind: "common" }
	| { kind: "calendar" }
	| { kind: "game"; gameId: GameId; page: 1 | 2 }
	| { kind: "thin" }
	| { kind: "share" };

/** Slide order: hero, common, the year calendar, then exactly two slides per
 *  game that has data, in registry order (Побач, Валошка, Сакрэтна), then
 *  the share card. Thin data collapses everything to hero and thin
 *  invitation, and drops the share card. */
export function buildSlides(summary: WrappedSummary): WrappedSlide[] {
	const hero: WrappedSlide = { kind: "hero", year: summary.year };

	if (summary.isThin) return [hero, { kind: "thin" }];

	return [
		hero,
		{ kind: "common" },
		{ kind: "calendar" },
		...summary.perGame.flatMap((g): WrappedSlide[] => [
			{ kind: "game", gameId: g.gameId, page: 1 },
			{ kind: "game", gameId: g.gameId, page: 2 },
		]),
		{ kind: "share" },
	];
}
