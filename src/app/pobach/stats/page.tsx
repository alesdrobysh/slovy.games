"use client";

import { useEffect, useState } from "react";
import Header from "@/games/pobach/components/Header";
import type { HistoryRecord } from "@/games/pobach/core/entities/game";
import { calculateStats, formatRelativeDate } from "@/games/pobach/lib/stats";
import { getHistory } from "@/games/pobach/lib/storage";

function StatCard({ label, value }: { label: string; value: string | number }) {
	return (
		<div
			className="flex flex-col gap-1 p-4 rounded-xl"
			style={{
				background: "var(--color-bg-card)",
				border: "1px solid var(--color-border)",
			}}
		>
			<span
				className="text-xs font-semibold uppercase tracking-wider"
				style={{ color: "var(--color-text-muted)" }}
			>
				{label}
			</span>
			<span
				className="text-2xl font-bold"
				style={{ color: "var(--color-text)" }}
			>
				{value}
			</span>
		</div>
	);
}

export default function PobachStatsPage() {
	const [stats, setStats] = useState<ReturnType<typeof calculateStats> | null>(
		null
	);
	const [history, setHistory] = useState<HistoryRecord[]>([]);

	useEffect(() => {
		const h = getHistory();
		setHistory(h.slice(-10).reverse());
		setStats(calculateStats(h));
	}, []);

	if (!stats) return null;

	const distEntries = Object.entries(stats.distribution).sort(
		([a], [b]) => Number(a) - Number(b)
	);

	return (
		<main style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
			<Header />
			<div className="mx-auto max-w-[600px] px-4 py-8">
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
					<StatCard label="Гульняў зыграна" value={stats.gamesPlayed} />
					<StatCard label="Перамог" value={`${stats.winRate}%`} />
					<StatCard label="Бягучая серыя" value={stats.currentStreak} />
					<StatCard label="Найлепшая серыя" value={stats.maxStreak} />
				</div>

				{distEntries.length > 0 && (
					<div className="mb-8">
						<h3
							className="text-sm font-bold mb-3"
							style={{ color: "var(--color-text)" }}
						>
							Размеркаванне спробаў
						</h3>
						{distEntries.map(([label, count]) => (
							<div key={label} className="flex items-center gap-3 mb-2">
								<span
									className="text-xs w-20 text-right"
									style={{ color: "var(--color-text-muted)" }}
								>
									{label} спроб
								</span>
								<div
									className="flex-1 h-5 rounded-sm relative overflow-hidden"
									style={{ background: "var(--color-bg-surface)" }}
								>
									<div
										className="h-full rounded-sm absolute left-0 top-0"
										style={{
											width: `${(count / stats.gamesWon) * 100}%`,
											background: "var(--color-accent)",
											opacity: 0.8,
										}}
									/>
								</div>
								<span
									className="text-xs font-semibold"
									style={{ color: "var(--color-text)" }}
								>
									{count}
								</span>
							</div>
						))}
					</div>
				)}

				{history.length > 0 && (
					<div className="mb-8">
						<h3
							className="text-sm font-bold mb-3"
							style={{ color: "var(--color-text)" }}
						>
							Апошнія гульні
						</h3>
						{history.map((h) => (
							<div
								key={h.dayIndex}
								className="flex items-center gap-3 py-2 border-b"
								style={{ borderColor: "var(--color-border)" }}
							>
								<span
									className="text-sm font-semibold"
									style={{
										color: h.won
											? "var(--color-accent)"
											: "var(--color-text-muted)",
									}}
								>
									{h.won ? "🏆" : "💔"}
								</span>
								<span
									className="text-sm"
									style={{ color: "var(--color-text)" }}
								>
									{formatRelativeDate(h.dayIndex)}
								</span>
								<span
									className="text-xs ml-auto"
									style={{ color: "var(--color-text-muted)" }}
								>
									{h.won ? `${h.attempts} спр.` : "—"}
								</span>
							</div>
						))}
					</div>
				)}
			</div>
		</main>
	);
}
