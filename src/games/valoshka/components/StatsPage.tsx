"use client";

import { useEffect, useState } from "react";
import { DEFAULT_STATS, loadStats } from "@/games/valoshka/lib/storage";
import type { GameStats } from "@/games/valoshka/types";
import { StatCard } from "@/shared/components/ui/StatCard";
import { useAnimatedValue } from "@/shared/hooks/useAnimatedValue";

export function StatsPage() {
	const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
	useEffect(() => {
		setStats(loadStats());
	}, []);

	const streak = useAnimatedValue(stats.currentStreak);
	const longest = useAnimatedValue(stats.longestStreak);
	const played = useAnimatedValue(stats.datesPlayed.length);

	const words = useAnimatedValue(stats.totalWordsFound);

	const rows = [
		{ label: "Бягучая серыя", value: streak },
		{ label: "Найлепшая серыя", value: longest },
		{ label: "Гульняў зыграна", value: played },
		{ label: "Слоў знойдзена", value: words },
	];

	return (
		<div className="page-container page-section">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{rows.map((row) => (
					<StatCard key={row.label} label={row.label} value={row.value} />
				))}
			</div>
		</div>
	);
}
