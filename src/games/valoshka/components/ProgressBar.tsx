"use client";

import { useState } from "react";
import { RankingModal } from "@/games/valoshka/components/RankingModal";
import { getRank, getRankIndex, RANKS } from "@/games/valoshka/lib/scoring";

interface ProgressBarProps {
	score: number;
	maxScore: number;
	date: string;
	foundCount: number;
	totalWords: number;
}

export function ProgressBar({
	score,
	maxScore,
	date,
	foundCount: _foundCount,
	totalWords: _totalWords,
}: ProgressBarProps) {
	const rank = getRank(score, maxScore);
	const rankIdx = getRankIndex(score, maxScore);
	const pct = maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;
	const [copied, setCopied] = useState(false);
	const [showRanking, setShowRanking] = useState(false);

	function handleShare() {
		const [y, m, d] = date.split("-");
		const dateStr = `${d}.${m}.${y}`;
		const visibleRanks =
			rankIdx < RANKS.length - 1 ? rankIdx + 1 : RANKS.length;
		const dots = Array.from({ length: visibleRanks }, (_, i) =>
			i <= rankIdx ? "🟡" : "⬜"
		).join("");
		const text = `Валошка ${dateStr}\nРанг: ${rank.name} (${score} пт)\n${dots}`;
		navigator.clipboard.writeText(text).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		});
	}

	return (
		<>
			<div className="w-full max-w-sm">
				{/* Rank badge + score + share */}
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setShowRanking(true)}
							className="text-xs font-bold tracking-widest uppercase rounded-full px-3 py-1"
							style={{
								background: "var(--cornflower-bg-subtle)",
								color: "var(--cornflower)",
								border: "1px solid var(--cornflower-border-subtle)",
								fontFamily: "var(--font-manrope), sans-serif",
								cursor: "pointer",
							}}
						>
							{rank.name}
						</button>
						<button
							type="button"
							onClick={handleShare}
							style={{
								background: "none",
								border: "none",
								cursor: "pointer",
								color: copied ? "var(--cornflower)" : "var(--text-muted)",
								fontFamily: "var(--font-manrope), sans-serif",
								fontSize: "12px",
								fontWeight: "600",
								padding: "2px 6px",
								borderRadius: "4px",
								transition: "color 0.2s",
							}}
						>
							{copied ? "Скапіравана!" : "Падзяліцца"}
						</button>
					</div>
					<span
						className="text-sm font-semibold tabular-nums"
						style={{
							color: "var(--text-muted)",
							fontFamily: "var(--font-manrope), sans-serif",
						}}
					>
						<span style={{ color: "var(--text)" }}>{score}</span>
						<span style={{ margin: "0 5px", color: "var(--border)" }}>/</span>
						{maxScore}
					</span>
				</div>

				{/* Progress track with dots */}
				{/* biome-ignore lint/a11y/noStaticElementInteractions: decorative progress bar */}
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: decorative progress bar */}
				<div
					className="relative"
					onClick={() => setShowRanking(true)}
					style={{
						height: "20px",
						display: "flex",
						alignItems: "center",
						cursor: "pointer",
					}}
				>
					{/* Track */}
					<div
						className="w-full rounded-full overflow-hidden"
						style={{ height: "3px", background: "var(--border)" }}
					>
						<div
							className="h-full rounded-full"
							style={{
								width: `${pct}%`,
								background:
									"linear-gradient(90deg, var(--cornflower-dark), var(--cornflower-light))",
								transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
							}}
						/>
					</div>

					{/* Rank dots */}
					{RANKS.map((r, i) => {
						const dotPct = r.threshold;
						const isActive = i <= rankIdx;
						const isCurrent = i === rankIdx;
						const isTopRank = i === RANKS.length - 1;
						// Hide top rank dot until reached
						if (isTopRank && !isActive) return <div key={r.name} />;
						return (
							<div
								key={r.name}
								title={r.name}
								style={{
									position: "absolute",
									left: `${dotPct}%`,
									transform: "translateX(-50%)",
									width: isCurrent ? "12px" : "7px",
									height: isCurrent ? "12px" : "7px",
									borderRadius: "50%",
									background: isActive ? "var(--cornflower)" : "var(--border)",
									border: isCurrent
										? "2px solid var(--cornflower-dark)"
										: "none",
									boxShadow: isCurrent
										? "0 0 8px rgba(245, 168, 24, 0.6)"
										: "none",
									transition: "all 0.3s ease",
									zIndex: 1,
								}}
							/>
						);
					})}
				</div>
			</div>

			{showRanking && (
				<RankingModal
					score={score}
					maxScore={maxScore}
					rankIdx={rankIdx}
					onClose={() => setShowRanking(false)}
				/>
			)}
		</>
	);
}
