"use client";

import { useEffect, useState } from "react";
import { RankDistributionChart } from "@/games/valoshka/components/RankDistributionChart";
import { DEFAULT_STATS, loadStats } from "@/games/valoshka/lib/storage";
import type { GameStats } from "@/games/valoshka/types";
import { StatCard } from "@/shared/components/ui/StatCard";
import { Typography } from "@/shared/components/ui/Typography";
import { useAnimatedValue } from "@/shared/hooks/useAnimatedValue";

function buildRankDistribution(
	perDateBest: GameStats["perDateBest"]
): Record<number, number> {
	const dist: Record<number, number> = {};
	for (const entry of Object.values(perDateBest)) {
		dist[entry.rankIdx] = (dist[entry.rankIdx] ?? 0) + 1;
	}
	return dist;
}

export function StatsPage() {
	const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
	useEffect(() => {
		setStats(loadStats());
	}, []);

	const streak = useAnimatedValue(stats.currentStreak);
	const longest = useAnimatedValue(stats.longestStreak);
	const played = useAnimatedValue(stats.datesPlayed.length);
	const words = useAnimatedValue(stats.totalWordsFound);
	const cornflowers = useAnimatedValue(stats.topRankCount);

	const rows = [
		{ label: "Бягучая серыя", value: streak },
		{ label: "Найлепшая серыя", value: longest },
		{ label: "Гульняў зыграна", value: played },
		{ label: "Слоў знойдзена", value: words },
		{ label: "Васількоў", value: cornflowers },
	];

	const rankDistribution = buildRankDistribution(stats.perDateBest);
	const hasDistribution = Object.keys(rankDistribution).length > 0;

	return (
		<div className="page-container page-section">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{rows.map((row) => (
					<StatCard key={row.label} label={row.label} value={row.value} />
				))}
			</div>

			{hasDistribution && (
				<>
					<Typography
						variant="heading"
						as="h2"
						className="mt-inset-xl mb-flow-lg text-ink"
					>
						Размеркаванне рангаў
					</Typography>
					<RankDistributionChart distribution={rankDistribution} />
				</>
			)}
		</div>
	);
}
