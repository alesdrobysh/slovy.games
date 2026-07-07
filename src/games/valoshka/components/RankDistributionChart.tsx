import { RANKS } from "@/games/valoshka/lib/scoring";

interface RankDistributionChartProps {
	distribution: Record<number, number>;
}

export function RankDistributionChart({
	distribution,
}: RankDistributionChartProps) {
	const maxCount = Math.max(...Object.values(distribution), 1);

	return (
		<div className="space-y-flow-sm">
			{RANKS.map((rank, idx) => {
				const count = distribution[idx] ?? 0;
				const pct =
					count > 0
						? Math.max(Math.round((count / maxCount) * 100), 8)
						: 0;

				return (
					<div
						key={rank.name}
						className="flex items-center gap-flow-md text-sm"
					>
						<div className="w-24 text-right text-ink-muted shrink-0 whitespace-nowrap font-display text-xs">
							{rank.name}
						</div>
						<div className="flex-1 h-10 bg-rule rounded-lg overflow-hidden relative">
							{count > 0 ? (
								<div
									className="h-full min-w-12 rounded-lg flex items-center justify-end pr-inset-sm transition-all duration-500"
									style={{
										width: `${pct}%`,
										backgroundColor: "var(--valoshka)",
									}}
								>
									<span className="text-white font-bold text-sm font-display">
										{count}
									</span>
								</div>
							) : (
								<div
									className="h-full w-12 rounded-lg flex items-center justify-center"
									style={{
										backgroundColor: "var(--valoshka)",
										opacity: 0.3,
									}}
								>
									<span className="text-white font-bold text-sm font-display">
										0
									</span>
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
