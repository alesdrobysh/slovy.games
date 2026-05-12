"use client";

import { RANKS } from "@/games/valoshka/lib/scoring";
import { Modal } from "@/shared/components/ui/Modal";

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
			<p className="text-sm text-[var(--sly-text-muted)] mb-3">
				Рангі залежаць ад адсотка магчымых балаў.
			</p>

			{/* Column headers */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					padding: "16px 0 8px",
					borderBottom: "1px solid var(--sly-border)",
				}}
			>
				<span
					style={{
						fontSize: "11px",
						fontWeight: "700",
						color: "var(--sly-text)",
						textTransform: "uppercase",
						letterSpacing: "0.08em",
					}}
				>
					Ранг
				</span>
				<span
					style={{
						fontSize: "11px",
						fontWeight: "700",
						color: "var(--sly-text)",
						textTransform: "uppercase",
						letterSpacing: "0.08em",
					}}
				>
					Мін. балы
				</span>
			</div>

			{/* Rank rows */}
			<div style={{ padding: "8px 0 20px" }}>
				{ranksReversed.map((r) => {
					const originalIdx = RANKS.indexOf(r);
					const isCurrent = originalIdx === rankIdx;
					const pts = minPoints(r.threshold);
					const isPast = originalIdx < rankIdx;

					if (isCurrent) {
						return (
							<div
								key={r.name}
								style={{
									background: "var(--sly-cornflower-bg-subtle)",
									border: "1px solid var(--sly-cornflower-border-subtle)",
									borderRadius: "999px",
									padding: "10px 20px",
									margin: "4px 0",
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									gap: "8px",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "12px",
									}}
								>
									<span
										style={{
											width: "28px",
											height: "28px",
											borderRadius: "50%",
											background: "var(--sly-cornflower)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "white",
											fontSize: "11px",
											fontWeight: "700",
											flexShrink: 0,
										}}
									>
										{score}
									</span>
									<div>
										<div
											style={{
												fontWeight: "700",
												fontSize: "15px",
												color: "var(--sly-cornflower)",
											}}
										>
											{r.name}
										</div>
										{nextRank && (
											<div
												style={{
													fontSize: "11px",
													color: "var(--sly-text-muted)",
													marginTop: "1px",
												}}
											>
												{pointsToNext} б. да наступнага
											</div>
										)}
									</div>
								</div>
								<span
									style={{
										fontWeight: "700",
										fontSize: "15px",
										color: "var(--sly-cornflower)",
									}}
								>
									{pts}
								</span>
							</div>
						);
					}

					return (
						<div
							key={r.name}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								padding: "8px 20px",
							}}
						>
							<div
								style={{ display: "flex", alignItems: "center", gap: "12px" }}
							>
								<span
									style={{
										width: "8px",
										height: "8px",
										borderRadius: "50%",
										background: isPast
											? "var(--sly-cornflower)"
											: "var(--sly-border)",
										flexShrink: 0,
									}}
								/>
								<span style={{ fontSize: "14px", color: "var(--sly-text)" }}>
									{r.name}
								</span>
							</div>
							<span
								style={{ fontSize: "14px", color: "var(--sly-text-muted)" }}
							>
								{pts}
							</span>
						</div>
					);
				})}
			</div>
		</Modal>
	);
}
