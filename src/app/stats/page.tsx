"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GAMES } from "@/shared/types";

interface CombinedStats {
	valoshka: {
		gamesPlayed: number;
		currentStreak: number;
		longestStreak: number;
		totalWordsFound: number;
	} | null;
	pobach: {
		gamesPlayed: number;
		gamesWon: number;
		winRate: number;
		currentStreak: number;
		longestStreak: number;
	} | null;
}

function loadValoshkaStats() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem("vulej_stats");
		if (!raw) return null;
		const s = JSON.parse(raw);
		return {
			gamesPlayed: s.datesPlayed?.length ?? 0,
			currentStreak: s.currentStreak ?? 0,
			longestStreak: s.longestStreak ?? 0,
			totalWordsFound: s.totalWordsFound ?? 0,
		};
	} catch {
		return null;
	}
}

function loadPobachStats() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem("pobach_storage");
		if (!raw) return null;
		const s = JSON.parse(raw);
		const history = s.history ?? [];
		const won = history.filter((h: { won: boolean }) => h.won);
		return {
			gamesPlayed: history.length,
			gamesWon: won.length,
			winRate: history.length > 0 ? Math.round((won.length / history.length) * 100) : 0,
			currentStreak: s.stats?.currentStreak ?? 0,
			longestStreak: s.stats?.maxStreak ?? 0,
		};
	} catch {
		return null;
	}
}

function StatCard({
	label,
	value,
}: {
	label: string;
	value: number | string;
}) {
	return (
		<div
			className="flex flex-col gap-1 p-4 rounded-xl"
			style={{
				background: "var(--color-bg-card)",
				border: "1px solid var(--color-border)",
			}}
		>
			<span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
				{label}
			</span>
			<span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
				{value}
			</span>
		</div>
	);
}

export default function CombinedStatsPage() {
	const [stats, setStats] = useState<CombinedStats>({ valoshka: null, pobach: null });

	useEffect(() => {
		setStats({
			valoshka: loadValoshkaStats(),
			pobach: loadPobachStats(),
		});
	}, []);

	return (
		<div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
			<div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
				<h1
					className="text-3xl font-bold mb-8"
					style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
				>
					Статыстыка
				</h1>

				{stats.valoshka && (
					<section className="mb-10">
						<h2
							className="text-xl font-bold mb-4"
							style={{ color: GAMES[0].color, fontFamily: "var(--font-display)" }}
						>
							{GAMES[0].nameBel}
							{" "}
							<Link
								href="/valoshka/stats"
								className="text-xs font-normal"
								style={{ color: "var(--color-text-muted)" }}
							>
								падрабязней →
							</Link>
						</h2>
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
							<StatCard label="Гульняў зыграна" value={stats.valoshka.gamesPlayed} />
							<StatCard label="Бягучая серыя" value={stats.valoshka.currentStreak} />
							<StatCard label="Найлепшая серыя" value={stats.valoshka.longestStreak} />
							<StatCard label="Слоў знойдзена" value={stats.valoshka.totalWordsFound} />
						</div>
					</section>
				)}

				{stats.pobach && (
					<section className="mb-10">
						<h2
							className="text-xl font-bold mb-4"
							style={{ color: GAMES[1].color, fontFamily: "var(--font-display)" }}
						>
							{GAMES[1].nameBel}
							{" "}
							<Link
								href="/pobach/stats"
								className="text-xs font-normal"
								style={{ color: "var(--color-text-muted)" }}
							>
								падрабязней →
							</Link>
						</h2>
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
							<StatCard label="Гульняў зыграна" value={stats.pobach.gamesPlayed} />
							<StatCard label="Перамог" value={`${stats.pobach.winRate}%`} />
							<StatCard label="Бягучая серыя" value={stats.pobach.currentStreak} />
							<StatCard label="Найлепшая серыя" value={stats.pobach.longestStreak} />
						</div>
					</section>
				)}

				{!stats.valoshka && !stats.pobach && (
					<p style={{ color: "var(--color-text-muted)" }}>
						Няма дадзеных. Згуляйце некалькі гульняў, каб убачыць статыстыку.
					</p>
				)}
			</div>
		</div>
	);
}
