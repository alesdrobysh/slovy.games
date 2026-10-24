import { loadProgress, loadStats } from "@/games/sakretna/lib/storage";
import type { SavedProgress } from "@/games/sakretna/types";
import { pluralize } from "@/shared/lib/pluralize";
import { agree } from "@/shared/lib/wrapped/format";
import { longestStreakFromDates } from "@/shared/lib/wrapped/streaks";
import type { GameYearStats, WrappedHighlight } from "@/shared/types/wrapped";

interface Win {
	title: string;
	guesses: number;
	hints: number;
}

/** The first word typed in the most investigations. */
function mostFrequentOpener(
	games: SavedProgress[]
): { word: string; games: number } | null {
	const counts = new Map<string, number>();
	for (const game of games) {
		const opener = game.guesses[0];
		if (typeof opener !== "string" || opener.length === 0) continue;
		counts.set(opener, (counts.get(opener) ?? 0) + 1);
	}
	return (
		[...counts.entries()]
			.sort(([aWord, aCount], [bWord, bCount]) =>
				bCount === aCount ? aWord.localeCompare(bWord, "be") : bCount - aCount
			)
			.map(([word, games]) => ({ word, games }))[0] ?? null
	);
}

function guessesCaption({ guesses, hints }: Win): string {
	const tries = `${guesses} ${pluralize(guesses, "спроба")}`;
	return hints === 0
		? `${tries}, без падказак`
		: `${tries}, ${hints} ${pluralize(hints, "падказка")}`;
}

function emptyStats(year: number): GameYearStats {
	return {
		gameId: "sakretna",
		year,
		daysPlayed: [],
		daysWon: [],
		longestStreakInYear: 0,
		headline: { value: 0, caption: "" },
		highlights: [],
	};
}

/** Сакрэтна activity for one calendar year, from the finished days in
 *  `datesPlayed` and each day's saved progress. Progress stores only the
 *  article id, so titles come from `titles`; a win whose title is unknown
 *  still counts, it just cannot be named. */
export function getWrappedStats(
	year: number,
	titles: Record<string, string>
): GameYearStats {
	let stats: ReturnType<typeof loadStats>;
	try {
		stats = loadStats();
	} catch {
		return emptyStats(year);
	}

	const prefix = `${year}-`;
	const inYear = (dates: unknown): string[] =>
		Array.isArray(dates)
			? [
					...new Set(
						dates.filter(
							(d): d is string => typeof d === "string" && d.startsWith(prefix)
						)
					),
				].sort()
			: [];

	const daysPlayed = inYear(stats.datesPlayed);
	if (daysPlayed.length === 0) return emptyStats(year);
	const daysWon = inYear(stats.datesWon);

	const games = daysPlayed
		.map((date) => loadProgress(date))
		.filter(
			(p): p is SavedProgress =>
				p !== null && Array.isArray(p.guesses) && typeof p.won === "boolean"
		);
	const wonGames = games.filter((g) => g.won);

	// Ordered best-first: fewest guesses, then fewest hints, then earliest.
	const wins = wonGames
		.map((g): Win | null => {
			const title = titles[g.articleId];
			if (!title) return null;
			return {
				title,
				guesses: g.guesses.length,
				hints: Number.isFinite(g.hintsUsed) ? g.hintsUsed : 0,
			};
		})
		.filter((win): win is Win => win !== null)
		.sort((a, b) => a.guesses - b.guesses || a.hints - b.hints);

	const highlights: WrappedHighlight[] = [];

	const best = wins[0];
	if (best) {
		highlights.push({
			key: "bestWin",
			label: "Лепшае расследаванне",
			value: best.title,
			caption: guessesCaption(best),
		});
	}

	if (daysWon.length > 0) {
		const clean = wonGames.filter((g) => !g.hintsUsed).length;
		const total = daysWon.length;
		highlights.push({
			key: "noHintWins",
			label: "Перамогі без падказак",
			value: clean,
			caption: `з ${total} ${pluralize(total, "рассакрэчаны", "genitive")} ${pluralize(total, "артыкул", "genitive")}`,
		});
	}

	const opener = mostFrequentOpener(games);
	if (opener) {
		highlights.push({
			key: "openingWord",
			label: "Стартавое слова",
			value: opener.word,
			caption: `${opener.games} ${pluralize(opener.games, "расследаванне")}`,
		});
	}

	// With a single win the hardest one is the best one; skip the repeat.
	const hardest = wins.length > 1 ? wins[wins.length - 1] : null;
	if (hardest) {
		highlights.push({
			key: "hardestWin",
			label: "Самае ўпартае расследаванне",
			value: hardest.title,
			caption: `${hardest.guesses} ${pluralize(hardest.guesses, "спроба")}`,
		});
	}

	return {
		gameId: "sakretna",
		year,
		daysPlayed,
		daysWon,
		longestStreakInYear: longestStreakFromDates(daysPlayed),
		headline: {
			value: daysWon.length,
			caption: `${pluralize(daysWon.length, "артыкул")} ${agree(daysWon.length, "рассакрэчаны", "рассакрэчаны", "рассакрэчана")}`,
		},
		highlights,
	};
}
