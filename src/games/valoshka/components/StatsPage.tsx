"use client";

import { useEffect, useState } from "react";
import { DEFAULT_STATS, loadStats } from "@/games/valoshka/lib/storage";
import type { GameStats } from "@/games/valoshka/types";
import { useAnimatedValue } from "@/shared/hooks/useAnimatedValue";
import { StatCard } from "@/shared/components/ui/StatCard";

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
		<main className="min-h-screen" style={{ background: "var(--sly-bg)" }}>
			<header
				className="border-b px-6 py-4"
				style={{ borderColor: "var(--sly-border)" }}
			>
				<div className="mx-auto max-w-5xl flex items-center gap-4">
					<a
						href="/"
						className="text-sm font-semibold"
						style={{ color: "var(--sly-text-muted)" }}
					>
						← Да гульні
					</a>
					<h1
						className="text-3xl"
						style={{
							fontFamily: "var(--sly-font-display)",
							color: "var(--sly-cornflower)",
						}}
					>
						Статыстыка
					</h1>
				</div>
			</header>

			<div className="mx-auto max-w-5xl px-6 py-8">
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{rows.map((row) => (
						<StatCard key={row.label} label={row.label} value={row.value} />
					))}
				</div>
			</div>
		</main>
	);
}
