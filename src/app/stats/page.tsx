"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const ATTEMPT_BUCKETS = [
	{ label: "1–5",    min: 1,   max: 5 },
	{ label: "6–15",   min: 6,   max: 15 },
	{ label: "16–50",  min: 16,  max: 50 },
	{ label: "51–150", min: 51,  max: 150 },
	{ label: "150+",   min: 151, max: Infinity },
];

interface ValoshkaStats {
	gamesPlayed: number;
	currentStreak: number;
	longestStreak: number;
	totalWordsFound: number;
}

interface PobachStats {
	gamesPlayed: number;
	gamesWon: number;
	winRate: number;
	currentStreak: number;
	longestStreak: number;
	distribution: Record<number, number>;
	bestAttempts: number;
}

function loadValoshkaStats(): ValoshkaStats | null {
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

function loadPobachStats(): PobachStats | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem("pobach_storage");
		if (!raw) return null;
		const s = JSON.parse(raw);
		const stats = s.stats;
		if (!stats) return null;
		return {
			gamesPlayed: stats.gamesPlayed ?? 0,
			gamesWon: stats.gamesWon ?? 0,
			winRate: Math.round(stats.winRate ?? 0),
			currentStreak: stats.currentStreak ?? 0,
			longestStreak: stats.maxStreak ?? 0,
			distribution: stats.distribution ?? {},
			bestAttempts: stats.bestAttempts ?? 0,
		};
	} catch {
		return null;
	}
}

function StatCard({
	label,
	value,
	featured = false,
}: {
	label: string;
	value: number | string;
	featured?: boolean;
}) {
	return (
		<div
			className={`bg-card ring-1 ring-rule rounded-2xl p-5 ${featured ? "sm:col-span-2 lg:col-span-1" : ""}`}
		>
			<p className="text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-1 font-medium">
				{label}
			</p>
			<p className={`font-display font-medium text-ink ${featured ? "text-4xl" : "text-3xl"}`}>
				{value}
			</p>
		</div>
	);
}

function TabButton({
	active,
	onClick,
	accent,
	children,
}: {
	active: boolean;
	onClick: () => void;
	accent: "pobach" | "valoshka";
	children: React.ReactNode;
}) {
	const activeColor = accent === "pobach" ? "text-pobach" : "text-valoshka";
	return (
		<button
			type="button"
			onClick={onClick}
			className={
				"px-5 py-1.5 rounded-full text-sm font-medium transition-all " +
				(active
					? `bg-paper text-ink shadow-sm ring-1 ring-rule ${activeColor}`
					: "text-ink-muted hover:text-ink")
			}
		>
			{children}
		</button>
	);
}

function DistributionChart({ distribution }: { distribution: Record<number, number> }) {
	const buckets = ATTEMPT_BUCKETS.map((b) => {
		let n = 0;
		for (const [attempts, count] of Object.entries(distribution)) {
			const a = Number(attempts);
			if (a >= b.min && a <= b.max) n += count;
		}
		return { ...b, n };
	});
	const maxCount = Math.max(1, ...buckets.map((b) => b.n));

	return (
		<div className="bg-card ring-1 ring-rule rounded-2xl p-6">
			<h3 className="font-display text-lg font-medium text-ink mb-4">
				Размеркаванне спроб
			</h3>
			<div className="space-y-2">
				{buckets.map((bucket) => (
					<div key={bucket.label} className="flex items-center gap-3 text-sm">
						<span className="w-16 text-ink-muted text-xs uppercase tracking-wider shrink-0">
							{bucket.label}
						</span>
						<div className="flex-1 h-6 bg-ink/5 rounded overflow-hidden">
							<div
								className="h-full rounded bg-pobach flex items-center justify-end px-2 text-white text-xs font-semibold transition-all duration-500"
								style={{
									width: `${(bucket.n / maxCount) * 100}%`,
									minWidth: bucket.n > 0 ? "1.5rem" : 0,
								}}
							>
								{bucket.n > 0 && bucket.n}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function PobachStatsView({ stats }: { stats: PobachStats }) {
	const avgGuesses =
		stats.gamesWon > 0 && stats.bestAttempts > 0
			? stats.bestAttempts
			: null;

	return (
		<div className="space-y-8">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard label="Згулялі" value={stats.gamesPlayed} />
				<StatCard label="Перамог" value={`${stats.winRate}%`} featured />
				<StatCard label="Бягучая серыя" value={stats.currentStreak} />
				<StatCard label="Найлепшая серыя" value={stats.longestStreak} />
			</div>
			{stats.gamesWon > 0 && avgGuesses && (
				<div className="grid gap-4 sm:grid-cols-2">
					<StatCard label="Лепшы вынік (спроб)" value={avgGuesses} />
					<StatCard label="Перамог усяго" value={stats.gamesWon} />
				</div>
			)}
			{stats.gamesWon > 0 && Object.keys(stats.distribution).length > 0 && (
				<DistributionChart distribution={stats.distribution} />
			)}
			<div className="text-right">
				<Link
					href="/pobach/stats"
					className="text-xs font-medium text-ink-muted hover:text-ink transition-colors no-underline"
				>
					Падрабязная статыстыка →
				</Link>
			</div>
		</div>
	);
}

function ValoshkaStatsView({ stats }: { stats: ValoshkaStats }) {
	return (
		<div className="space-y-8">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard label="Гульняў зыграна" value={stats.gamesPlayed} />
				<StatCard label="Бягучая серыя" value={stats.currentStreak} featured />
				<StatCard label="Найлепшая серыя" value={stats.longestStreak} />
				<StatCard label="Слоў знойдзена" value={stats.totalWordsFound} />
			</div>
			<div className="text-right">
				<Link
					href="/valoshka/stats"
					className="text-xs font-medium text-ink-muted hover:text-ink transition-colors no-underline"
				>
					Падрабязная статыстыка →
				</Link>
			</div>
		</div>
	);
}

export default function CombinedStatsPage() {
	const [valoshka, setValoshka] = useState<ValoshkaStats | null>(null);
	const [pobach, setPobach] = useState<PobachStats | null>(null);
	const [activeTab, setActiveTab] = useState<"valoshka" | "pobach">("valoshka");

	useEffect(() => {
		const v = loadValoshkaStats();
		const p = loadPobachStats();
		setValoshka(v);
		setPobach(p);
		if (!v && p) setActiveTab("pobach");
	}, []);

	const isEmpty = !valoshka && !pobach;

	return (
		<div className="page-container page-section">
				<div className="mb-10 animate-fade-in-up">
					<h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-ink">
						Статыстыка
					</h1>
					<p className="text-sm text-ink-muted mt-2">
						Лакальны архіў вашых вынікаў.
					</p>
				</div>

				{isEmpty ? (
					<div className="bg-card ring-1 ring-rule rounded-2xl p-10 text-center">
						<p className="text-ink-muted mb-4">
							Пакуль няма даных. Згуляйце сваю першую гульню.
						</p>
						<Link
							href="/"
							className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-pobach transition-colors no-underline"
						>
							Да гульняў →
						</Link>
					</div>
				) : (
					<>
						<div className="flex gap-1 mb-10 bg-secondary rounded-full p-1 w-fit">
							{valoshka && (
								<TabButton
									active={activeTab === "valoshka"}
									onClick={() => setActiveTab("valoshka")}
									accent="valoshka"
								>
									Валошка
								</TabButton>
							)}
							{pobach && (
								<TabButton
									active={activeTab === "pobach"}
									onClick={() => setActiveTab("pobach")}
									accent="pobach"
								>
									Побач
								</TabButton>
							)}
						</div>

						{activeTab === "valoshka" && valoshka && (
							<ValoshkaStatsView stats={valoshka} />
						)}
						{activeTab === "pobach" && pobach && (
							<PobachStatsView stats={pobach} />
						)}
					</>
				)}
			</div>
	);
}
