"use client";

import { useEffect } from "react";
import { RANKS } from "@/games/valoshka/lib/scoring";

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
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [onClose]);

	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, []);

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
		// biome-ignore lint/a11y/noStaticElementInteractions: presentation role backdrop
		<div
			role="presentation"
			onClick={onClose}
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 50,
				background: "rgba(0,0,0,0.5)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "16px",
			}}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Рангі"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
				style={{
					background: "var(--bg-card)",
					border: "1px solid var(--border)",
					borderRadius: "16px",
					width: "100%",
					maxWidth: "480px",
					maxHeight: "85vh",
					display: "flex",
					flexDirection: "column",
					fontFamily: "var(--font-manrope), sans-serif",
					overflowY: "auto",
				}}
			>
				{/* Header */}
				<div
					style={{
						display: "flex",
						alignItems: "flex-start",
						justifyContent: "space-between",
						padding: "20px 24px 0",
						flexShrink: 0,
					}}
				>
					<div>
						<h2
							style={{
								margin: 0,
								fontFamily: "var(--font-eb-garamond), serif",
								fontSize: "26px",
								fontWeight: "700",
								color: "var(--text)",
								letterSpacing: "-0.02em",
							}}
						>
							Рангі
						</h2>
						<p
							style={{
								margin: "6px 0 0",
								fontSize: "13px",
								color: "var(--text-muted)",
								lineHeight: 1.5,
							}}
						>
							Рангі залежаць ад адсотка магчымых балаў.
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						style={{
							background: "none",
							border: "none",
							cursor: "pointer",
							color: "var(--text-muted)",
							fontSize: "20px",
							lineHeight: 1,
							padding: "2px 4px",
							flexShrink: 0,
						}}
					>
						✕
					</button>
				</div>

				{/* Column headers */}
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						padding: "16px 24px 8px",
						borderBottom: "1px solid var(--border)",
					}}
				>
					<span
						style={{
							fontSize: "11px",
							fontWeight: "700",
							color: "var(--text)",
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
							color: "var(--text)",
							textTransform: "uppercase",
							letterSpacing: "0.08em",
						}}
					>
						Мін. балы
					</span>
				</div>

				{/* Rank rows */}
				<div style={{ padding: "8px 12px 20px" }}>
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
										background: "var(--cornflower-bg-subtle)",
										border: "1px solid var(--cornflower-border-subtle)",
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
												background: "var(--cornflower)",
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
													color: "var(--cornflower)",
												}}
											>
												{r.name}
											</div>
											{nextRank && (
												<div
													style={{
														fontSize: "11px",
														color: "var(--text-muted)",
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
											color: "var(--cornflower)",
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
												? "var(--cornflower)"
												: "var(--border)",
											flexShrink: 0,
										}}
									/>
									<span style={{ fontSize: "14px", color: "var(--text)" }}>
										{r.name}
									</span>
								</div>
								<span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
									{pts}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
