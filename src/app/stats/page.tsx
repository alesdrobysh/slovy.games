"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
			winRate:
				history.length > 0
					? Math.round((won.length / history.length) * 100)
					: 0,
			currentStreak: s.stats?.currentStreak ?? 0,
			longestStreak: s.stats?.maxStreak ?? 0,
		};
	} catch {
		return null;
	}
}

function StatCard({ label, value }: { label: string; value: number | string }) {
	return (
		<div className="bg-card ring-1 ring-rule rounded-2xl p-5">
			<p className="text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-1 font-medium">
				{label}
			</p>
			<p className="font-display text-3xl font-medium text-ink">{value}</p>
		</div>
	);
}

export default function CombinedStatsPage() {
	const [stats, setStats] = useState<CombinedStats>({
		valoshka: null,
		pobach: null,
	});

	useEffect(() => {
		setStats({
			valoshka: loadValoshkaStats(),
			pobach: loadPobachStats(),
		});
	}, []);

	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex-1 max-w-4xl mx-auto w-full px-5 sm:px-8 py-10 sm:py-14">
				<div className="mb-8 animate-fade-in-up">
					<h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-ink">
						Статыстыка
					</h1>
					<p className="text-sm text-ink-muted mt-2">
						Лакальны архіў вашых вынікаў.
					</p>
				</div>

				{!stats.valoshka && !stats.pobach ? (
					<div className="bg-card ring-1 ring-rule rounded-2xl p-10 text-center">
						<p className="text-ink-muted mb-4">
							Пакуль няма даных. Згуляйце некалькі гульняў, каб убачыць
							статыстыку.
						</p>
						<Link
							href="/"
							className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-pobach transition-colors no-underline"
						>
							Да гульняў →
						</Link>
					</div>
				) : (
					<div className="space-y-10">
						{stats.valoshka && (
							<section>
								<h2 className="font-display text-2xl font-medium text-valoshka mb-5">
									{GAMES[0].nameBel}{" "}
									<Link
										href="/valoshka/stats"
										className="text-xs font-normal text-ink-muted hover:text-ink"
									>
										падрабязней →
									</Link>
								</h2>
								<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
									<StatCard
										label="Гульняў зыграна"
										value={stats.valoshka.gamesPlayed}
									/>
									<StatCard
										label="Бягучая серыя"
										value={stats.valoshka.currentStreak}
									/>
									<StatCard
										label="Найлепшая серыя"
										value={stats.valoshka.longestStreak}
									/>
									<StatCard
										label="Слоў знойдзена"
										value={stats.valoshka.totalWordsFound}
									/>
								</div>
							</section>
						)}

						{stats.pobach && (
							<section>
								<h2 className="font-display text-2xl font-medium text-pobach mb-5">
									{GAMES[1].nameBel}{" "}
									<Link
										href="/pobach/stats"
										className="text-xs font-normal text-ink-muted hover:text-ink"
									>
										падрабязней →
									</Link>
								</h2>
								<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
									<StatCard
										label="Гульняў зыграна"
										value={stats.pobach.gamesPlayed}
									/>
									<StatCard
										label="Перамог"
										value={`${stats.pobach.winRate}%`}
									/>
									<StatCard
										label="Бягучая серыя"
										value={stats.pobach.currentStreak}
									/>
									<StatCard
										label="Найлепшая серыя"
										value={stats.pobach.longestStreak}
									/>
								</div>
							</section>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
