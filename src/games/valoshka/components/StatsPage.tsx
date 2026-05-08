"use client";

import { useEffect, useState } from "react";
import { DEFAULT_STATS, loadStats } from "@/games/valoshka/lib/storage";
import type { GameStats } from "@/games/valoshka/types";

function useAnimatedValue(target: number, duration = 900) {
	const [value, setValue] = useState(0);
	useEffect(() => {
		let raf: number;
		const start = performance.now();
		const animate = (now: number) => {
			const t = Math.min((now - start) / duration, 1);
			setValue(Math.round(target * (1 - (1 - t) ** 3)));
			if (t < 1) raf = requestAnimationFrame(animate);
		};
		raf = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(raf);
	}, [target, duration]);
	return value;
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

	const rows = [
		{ label: "Бягучая серыя", value: streak },
		{ label: "Найлепшая серыя", value: longest },
		{ label: "Гульняў зыграна", value: played },
		{ label: "Слоў знойдзена", value: words },
	];

	return (
		<main className="min-h-screen" style={{ background: "var(--bg)" }}>
			<header
				className="border-b px-6 py-4"
				style={{ borderColor: "var(--border)" }}
			>
				<div className="mx-auto max-w-5xl flex items-center gap-4">
					<a
						href="/"
						className="text-sm font-semibold"
						style={{ color: "var(--text-muted)" }}
					>
						← Да гульні
					</a>
					<h1
						className="text-3xl"
						style={{
							fontFamily: "var(--font-display)",
							color: "var(--cornflower)",
						}}
					>
						Статыстыка
					</h1>
				</div>
			</header>

			<div className="mx-auto max-w-5xl px-6 py-8">
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{rows.map((row) => (
						<div
							key={row.label}
							className="flex flex-col gap-1"
							style={{
								background: "var(--bg-card)",
								border: "1px solid var(--border)",
								borderRadius: "12px",
								padding: "20px 24px",
							}}
						>
							<span
								className="text-xs font-semibold uppercase tracking-wider"
								style={{ color: "var(--text-muted)" }}
							>
								{row.label}
							</span>
							<span
								className="text-3xl font-bold"
								style={{
									fontFamily: "var(--font-display)",
									color: "var(--text)",
								}}
							>
								{row.value}
							</span>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
