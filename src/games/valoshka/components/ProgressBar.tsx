"use client";

import { useMemo, useState } from "react";
import { RankingModal } from "@/games/valoshka/components/RankingModal";
import { getRank, getRankIndex, RANKS } from "@/games/valoshka/lib/scoring";
import { Badge } from "@/shared/components/ui/Badge";
import { useShare } from "@/shared/hooks/useShare";

function buildShareText(
	date: string,
	rank: { name: string },
	score: number,
	rankIdx: number
): string {
	const [y, m, d] = date.split("-");
	const dateStr = `${d}.${m}.${y}`;
	const visibleRanks = rankIdx < RANKS.length - 1 ? rankIdx + 1 : RANKS.length;
	const dots = Array.from({ length: visibleRanks }, (_, i) =>
		i <= rankIdx ? "🟡" : "⬜"
	).join("");
	return `Валошка ${dateStr}\nРанг: ${rank.name} (${score} пт)\n${dots}`;
}

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
	const [showRanking, setShowRanking] = useState(false);
	const shareText = useMemo(
		() => buildShareText(date, rank, score, rankIdx),
		[date, rank, score, rankIdx]
	);
	const { share, showToast } = useShare(shareText);

	return (
		<>
			<div className="w-full max-w-sm">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setShowRanking(true)}
							className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm"
						>
							<Badge>{rank.name}</Badge>
						</button>
						<button
							type="button"
							onClick={share}
							className={`text-xs font-semibold py-0.5 px-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
								showToast ? "text-valoshka" : "text-ink-muted hover:text-ink"
							}`}
						>
							{showToast ? "Скапіравана!" : "Падзяліцца"}
						</button>
					</div>
					<span className="text-sm font-semibold tabular-nums text-ink-muted font-sans">
						<span className="text-ink">{score}</span>
						<span className="mx-1 text-rule">/</span>
						{maxScore}
					</span>
				</div>

				<button
					type="button"
					aria-label="Паказаць рангі"
					className="relative flex items-center w-full bg-transparent border-none p-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-full"
					style={{ height: "20px" }}
					onClick={() => setShowRanking(true)}
				>
					<div
						className="w-full rounded-full overflow-hidden"
						style={{ height: "3px", background: "var(--border)" }}
					>
						<div
							className="h-full rounded-full origin-left"
							style={{
								transform: `scaleX(${pct / 100})`,
								background:
									"linear-gradient(90deg, var(--accent-dark), var(--accent-light))",
								transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
							}}
						/>
					</div>

					{RANKS.map((r, i) => {
						const dotPct = r.threshold;
						const isActive = i <= rankIdx;
						const isCurrent = i === rankIdx;
						const isTopRank = i === RANKS.length - 1;
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
									background: isActive
										? "var(--valoshka)"
										: "var(--border)",
									border: isCurrent
										? "2px solid var(--accent-dark)"
										: "none",
									transition: "all 0.3s ease",
									zIndex: 1,
								}}
							/>
						);
					})}
				</button>
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
