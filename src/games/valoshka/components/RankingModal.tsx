"use client";

import { RANKS } from "@/games/valoshka/lib/scoring";
import { Modal } from "@/shared/components/ui/Modal";
import { Typography } from "@/shared/components/ui/Typography";

interface RankingModalProps {
	score: number;
	maxScore: number;
	rankIdx: number;
	onClose: () => void;
}

export function RankingModal({
	score,
	maxScore,
	rankIdx,
	onClose,
}: RankingModalProps) {
	const minPoints = (threshold: number) =>
		Math.ceil((threshold / 100) * maxScore);

	const nextRank = rankIdx < RANKS.length - 1 ? RANKS[rankIdx + 1] : null;
	const pointsToNext = nextRank
		? Math.max(0, minPoints(nextRank.threshold) - score)
		: 0;

	const topRankReached = rankIdx === RANKS.length - 1;
	const ranksReversed = [...RANKS]
		.filter((_, i) => i < RANKS.length - 1 || topRankReached)
		.reverse();

	return (
		<Modal isOpen={true} onClose={onClose} title="Рангі">
			<div className="mb-flow-md">
				<Typography variant="body">
					Рангі залежаць ад адсотка магчымых балаў.
				</Typography>
			</div>

			{/* Column headers */}
			<div className="flex justify-between pt-flow-lg pb-flow-sm border-b border-rule">
				<Typography variant="overline">Ранг</Typography>
				<Typography variant="overline">Мін. балы</Typography>
			</div>

			{/* Rank rows */}
			<div className="pt-flow-sm pb-inset-md">
				{ranksReversed.map((r) => {
					const originalIdx = RANKS.indexOf(r);
					const isCurrent = originalIdx === rankIdx;
					const pts = minPoints(r.threshold);
					const isPast = originalIdx < rankIdx;

					if (isCurrent) {
						return (
							<div
								key={r.name}
								className="bg-(--accent-dim) border border-(--accent-border) rounded-full py-flow-sm px-inset-md my-flow-xs flex items-center justify-between gap-flow-sm"
							>
								<div className="flex items-center gap-flow-md">
									<span className="size-7 rounded-full bg-valoshka flex items-center justify-center text-white text-xs font-bold shrink-0">
										{score}
									</span>
									<div>
										<Typography variant="smallSerif" as="div" className="text-valoshka">
											{r.name}
										</Typography>
										{nextRank && (
											<Typography variant="label">
												яшчэ {pointsToNext} да наступнага
											</Typography>
										)}
									</div>
								</div>
								<Typography variant="smallSerif" className="text-valoshka">
									{pts}
								</Typography>
							</div>
						);
					}

					return (
						<div
							key={r.name}
							className="flex items-center justify-between py-flow-sm px-inset-md"
						>
							<div className="flex items-center gap-flow-md">
								<span
									className={`size-2 rounded-full shrink-0 ${isPast ? "bg-valoshka" : "bg-rule"}`}
								/>
								<Typography variant="body" as="span" className="text-ink">{r.name}</Typography>
							</div>
							<Typography variant="body" as="span" className="text-ink-muted">{pts}</Typography>
						</div>
					);
				})}
			</div>
		</Modal>
	);
}
