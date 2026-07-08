"use client";

import { useEffect, useMemo, useState } from "react";
import { Share2 } from "lucide-react";
import { RankDistributionChart } from "@/games/valoshka/components/RankDistributionChart";
import { RANKS } from "@/games/valoshka/lib/scoring";
import { DEFAULT_STATS, loadStats } from "@/games/valoshka/lib/storage";
import type { GameStats } from "@/games/valoshka/types";
import { Button } from "@/shared/components/ui/Button";
import { StatCard } from "@/shared/components/ui/StatCard";
import { Typography } from "@/shared/components/ui/Typography";
import { useShare } from "@/shared/hooks/useShare";
import {
	getMskDateString,
	getMskYesterdayDateString,
} from "@/shared/lib/timezone";
import { pluralize } from "@/shared/lib/pluralize";

interface HistoryEntry {
	date: string;
	rankIdx: number;
	foundCount: number;
}

function formatDateLabel(date: string): string {
	const today = getMskDateString();
	if (date === today) return "Сёння";

	const yesterday = getMskYesterdayDateString();
	if (date === yesterday) return "Учора";

	// "N дзён таму" or show the date
	const d = new Date(`${date}T00:00:00+03:00`);
	const now = new Date();
	const diffDays = Math.floor(
		(now.getTime() - d.getTime()) / 86400000
	);
	if (diffDays <= 30) return `${diffDays} дзён таму`;

	return date.split("-").reverse().join(".");
}

function buildHistory(stats: GameStats): HistoryEntry[] {
	return Object.entries(stats.perDateBest)
		.map(([date, entry]) => ({ date, ...entry }))
		.sort((a, b) => b.date.localeCompare(a.date))
		.slice(0, 10);
}

export function StatsPage() {
	const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
	useEffect(() => {
		setStats(loadStats());
	}, []);

	const streak = stats.currentStreak;
	const longest = stats.longestStreak;
	const played = stats.datesPlayed.length;
	const words = stats.totalWordsFound;
	const cornflowers = stats.topRankCount;

	const history = useMemo(() => buildHistory(stats), [stats]);

	const rankDistribution = useMemo(() => {
		const dist: Record<number, number> = {};
		for (const entry of Object.values(stats.perDateBest)) {
			dist[entry.rankIdx] = (dist[entry.rankIdx] ?? 0) + 1;
		}
		return dist;
	}, [stats]);
	const hasDistribution = Object.keys(rankDistribution).length > 0;

	const shareText = useMemo(() => {
		const lines = [
			"Мая статыстыка ў «Валошка»:",
			`Гульняў: ${stats.datesPlayed.length}`,
			`Слоў знойдзена: ${stats.totalWordsFound}`,
			`Бягучая серыя: ${stats.currentStreak}`,
			`Макс. серыя: ${stats.longestStreak}`,
		];
		if (stats.topRankCount > 0) {
			lines.push(`Васількоў: ${stats.topRankCount}`);
		}
		lines.push("slovy.games");
		return lines.join("\n");
	}, [stats]);

	const { share, isSharing, showToast } = useShare(shareText);

	const hasVasiliok = stats.topRankCount > 0;

	return (
		<div className="page-narrow page-container py-inset-lg flex flex-col gap-y-flow-lg">
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-flow-md">
				<StatCard label="Гульняў" value={played} />
				<StatCard label="Слоў" value={words} />
				<StatCard label="Серыя" value={streak} />
				<StatCard label="Макс." value={longest} />
				{hasVasiliok && (
					<StatCard label="Васількоў" value={cornflowers} />
				)}
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

			<Typography
				variant="heading"
				as="h2"
				className="mt-inset-xl mb-flow-lg text-ink"
			>
				Гісторыя гульняў
			</Typography>
			<div className="bg-card ring-1 ring-rule rounded-2xl px-flow-lg">
				{history.length === 0 ? (
					<Typography
						variant="body"
						as="div"
						className="py-inset-lg text-center text-ink-muted"
					>
						Пакуль няма гісторыі гульняў
					</Typography>
				) : (
					history.map((entry) => (
						<div
							key={entry.date}
							className="flex items-center gap-flow-md py-flow-lg border-b border-rule last:border-0"
						>
							<span
								className={`w-2.5 h-2.5 rounded-full shrink-0 ${
									entry.rankIdx === 8
										? "bg-success"
										: "bg-[var(--valoshka)]"
								}`}
							/>
							<Typography
								variant="body"
								as="div"
								className="flex-1 text-ink"
							>
								<span className="font-display">
									{RANKS[entry.rankIdx]?.name ?? "—"}
								</span>
							</Typography>
							<Typography
								variant="caption"
								as="div"
								className="flex items-center gap-flow-md text-ink-muted"
							>
								<span>
									<span className="font-display tabular-nums">
										{entry.foundCount}
									</span>{" "}
									{pluralize(entry.foundCount, "слова")}
								</span>
								<span>{formatDateLabel(entry.date)}</span>
							</Typography>
						</div>
					))
				)}
			</div>

			<div className="mt-inset-xl flex justify-center relative">
				<Button
					onClick={share}
					disabled={isSharing}
					variant="solid"
					color="primary"
					startIcon={<Share2 size={16} />}
				>
					Падзяліцца статыстыкай
				</Button>
				{showToast && (
					<div
						aria-live="polite"
						className="absolute -top-10 left-1/2 -translate-x-1/2 px-inset-sm py-flow-sm rounded-lg bg-ink text-paper text-xs font-medium whitespace-nowrap shadow-lg"
					>
						Скапіравана!
					</div>
				)}
			</div>
		</div>
	);
}
