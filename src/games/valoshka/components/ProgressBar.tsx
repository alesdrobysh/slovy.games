"use client";

import { useMemo, useState } from "react";
import { RankingModal } from "@/games/valoshka/components/RankingModal";
import { getRank, getRankIndex, RANKS } from "@/games/valoshka/lib/scoring";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
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
	return `Валошка ${dateStr}\nРанг: ${rank.name} (${score} пт)\n${dots}\nslovy.games`;
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
	const { share, showToast } = useShare(shareText, { game: "valoshka", context: "in_progress" });

	return (
		<>
			<div className="w-full max-w-sm">
				<div className="flex items-center justify-between mb-flow-md">
					<div className="flex items-center gap-flow-sm">
						<Button
							variant="ghost"
							color="neutral"
							onClick={() => setShowRanking(true)}
						>
							<Badge>{rank.name}</Badge>
						</Button>
						<Button
							variant="ghost"
							color={showToast ? "primary" : "neutral"}
							onClick={share}
						>
							{showToast ? "Скапіравана!" : "Падзяліцца"}
						</Button>
					</div>
					<span className="text-sm font-semibold tabular-nums text-ink-muted font-sans">
						<span className="text-ink">{score}</span>
						<span className="mx-flow-xs text-rule">/</span>
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
						className="w-full rounded-full overflow-hidden bg-rule"
						style={{ height: "3px" }}
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
								className={`absolute rounded-full z-1 transition-all duration-300 ${isActive ? "bg-valoshka" : "bg-rule"}`}
								style={{
									left: `${dotPct}%`,
									transform: "translateX(-50%)",
									width: isCurrent ? "12px" : "7px",
									height: isCurrent ? "12px" : "7px",
									border: isCurrent ? "2px solid var(--accent-dark)" : "none",
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
