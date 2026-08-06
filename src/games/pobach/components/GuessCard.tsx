import { getBarPercentage, getRankColor } from "@/games/pobach/lib/rank-utils";
import type { Guess } from "@/games/pobach/types";
import DictionaryLink from "@/shared/components/DictionaryLink";
import { Typography } from "@/shared/components/ui/Typography";

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
			className={`flex flex-col gap-flow-sm px-inset-md py-inset-sm rounded-lg ring-1 ring-rule bg-card transition-all ${
				highlight ? "animate-pop-in ring-pobach/40" : ""
			}`}
			aria-label={`Слова ${guess.word}, ранг ${guess.rank}`}
		>
			<div className="flex items-center justify-between gap-flow-md min-w-0">
				<div className="flex items-center gap-flow-sm min-w-0">
					<Typography
						variant="body"
						as="span"
						className="text-ink font-bold truncate"
					>
						<DictionaryLink word={guess.word} source="pobach_guess_card" />
					</Typography>

					{guess.isHint && (
						<Typography
							variant="caption"
							as="span"
							className="text-ink-soft shrink-0"
						>
							(падказка)
						</Typography>
					)}
				</div>

				<Typography
					variant="overline"
					as="span"
					className="shrink-0 tabular-nums normal-case tracking-normal"
					style={{ color: rankColor }}
				>
					#{guess.rank}
				</Typography>
			</div>

			<div className="h-1.5 rounded-full bg-ink/5 overflow-hidden">
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
