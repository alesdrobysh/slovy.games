import type { Guess } from "@/games/pobach/core/entities/game";
import { getBarPercentage, getRankColor } from "@/games/pobach/lib/rank-utils";
import DictionaryLink from "./DictionaryLink";

type GuessCardProps = {
	guess: Guess;
	highlight?: boolean;
};

export default function GuessCard({
	guess,
	highlight = false,
}: GuessCardProps) {
	const rankColor = getRankColor(guess.rank);
	const barPct = getBarPercentage(guess.rank);

	return (
		<article
			className={`flex items-center gap-4 px-4 py-3 rounded-lg ring-1 ring-rule bg-card transition-all ${
				highlight ? "animate-pop-in ring-pobach/40" : ""
			}`}
			aria-label={`Слова ${guess.word}, ранг ${guess.rank}`}
		>
			<div
				className="w-12 text-right font-display font-semibold tabular-nums shrink-0"
				style={{ color: rankColor }}
			>
				{guess.rank}
			</div>

			<div className="flex-1 min-w-0 font-display text-base text-ink truncate">
				<DictionaryLink word={guess.word} />
			</div>

			{guess.isHint && (
				<span className="text-xs italic text-ink-muted shrink-0">
					(падказка)
				</span>
			)}

			<div className="w-32 h-1.5 rounded-full bg-ink/5 overflow-hidden shrink-0">
				<div
					className="h-full rounded-full transition-all"
					style={{
						width: `${barPct}%`,
						backgroundColor: rankColor,
					}}
				/>
			</div>
		</article>
	);
}
