import type { Guess } from "@/games/pobach/core/entities/game";
import {
	getBarPercentage,
	getBarWidth,
	getRankColor,
} from "@/games/pobach/lib/rank-utils";
import DictionaryLink from "./DictionaryLink";

type GuessCardProps = {
	guess: Guess;
	isWin?: boolean;
};

export default function GuessCard({ guess, isWin = false }: GuessCardProps) {
	const rankColor = getRankColor(guess.rank);
	const barWidth = getBarWidth(guess.rank);
	const barPercentage = getBarPercentage(guess.rank);

	return (
		<article
			className="guess-card"
			aria-label={`Слова ${guess.word}, ранг ${guess.rank}${isWin ? ", вы перамаглі" : ""}`}
		>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 mb-1.5">
					<span className="font-semibold text-[var(--sly-text)] truncate">
						<DictionaryLink word={guess.word} />
					</span>
					{guess.isHint && (
						<span className="text-xs italic text-[var(--sly-text-muted)] shrink-0">
							(падказка)
						</span>
					)}
				</div>
				<div
					className="h-1 rounded-full bg-[var(--sly-border)]"
					role="progressbar"
					aria-valuenow={barPercentage}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-label={`Якасць здагадкі: ${barPercentage}%`}
				>
					<div
						className="h-full rounded-full"
						style={
							{
								width: barWidth,
								backgroundColor: rankColor,
								"--bar-target": barWidth,
								animation: "barGrow 0.6s cubic-bezier(0.4, 0, 0.2, 1) both",
							} as React.CSSProperties
						}
					/>
				</div>
			</div>
			<div className="shrink-0 text-right">
				<div className="rank-badge" style={{ color: rankColor }}>
					#{guess.rank}
				</div>
			</div>
		</article>
	);
}
