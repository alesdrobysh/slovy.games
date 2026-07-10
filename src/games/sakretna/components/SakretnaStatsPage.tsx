"use client";

import { Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_STATS, loadStats } from "@/games/redaktle/lib/storage";
import type { GameStats } from "@/games/redaktle/types";
import { Button } from "@/shared/components/ui/Button";
import { StatCard } from "@/shared/components/ui/StatCard";
import { Typography } from "@/shared/components/ui/Typography";
import { useShare } from "@/shared/hooks/useShare";
import { pluralize } from "@/shared/lib/pluralize";

function formatDateLabel(date: string): string {
	const today = new Date().toISOString().slice(0, 10);
	if (date === today) return "Сёння";
	const d = new Date(`${date}T00:00:00Z`);
	return d.toLocaleDateString("be-BY", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export function RedactleStatsPage() {
	const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
	useEffect(() => {
		setStats(loadStats());
	}, []);

	const winRate =
		stats.totalPlayed > 0
			? Math.round((stats.totalWins / stats.totalPlayed) * 100)
			: 0;

	const shareText = useMemo(() => {
		return [
			"Мая статыстыка ў «Рэдактле»:",
			`Гульняў: ${stats.totalPlayed}`,
			`Здагадана: ${stats.totalWins} (${winRate}%)`,
			`Бягучая серыя: ${stats.currentStreak}`,
			`Макс. серыя: ${stats.longestStreak}`,
			`Падказак: ${stats.hintsUsedCount}`,
			"slovy.games/redaktle",
		].join("\n");
	}, [stats, winRate]);

	const { share, isSharing, showToast } = useShare(shareText, {
		game: "redaktle",
		context: "stats",
	});

	const recent = useMemo(
		() => [...stats.datesPlayed].sort().reverse().slice(0, 10),
		[stats.datesPlayed]
	);

	return (
		<div className="mx-auto max-w-3xl px-5 sm:px-8 py-inset-lg flex flex-col gap-y-flow-lg">
			<header className="flex flex-col gap-flow-xs">
				<Typography variant="overline" as="span" className="text-redaktle">
					Рэдактле
				</Typography>
				<Typography variant="title" as="h1">
					Статыстыка
				</Typography>
			</header>

			<div className="grid grid-cols-2 sm:grid-cols-3 gap-flow-md">
				<StatCard label="Гульняў" value={stats.totalPlayed} />
				<StatCard
					label="Здагадана"
					value={`${stats.totalWins} (${winRate}%)`}
				/>
				<StatCard label="Серыя" value={stats.currentStreak} />
				<StatCard label="Макс. серыя" value={stats.longestStreak} />
				<StatCard label="Падказак" value={stats.hintsUsedCount} />
			</div>

			<Typography
				variant="heading"
				as="h2"
				className="mt-inset-xl mb-flow-lg text-ink"
			>
				Апошнія дні
			</Typography>
			<div className="bg-card ring-1 ring-rule rounded-2xl px-flow-lg">
				{recent.length === 0 ? (
					<Typography
						variant="body"
						as="div"
						className="py-inset-lg text-center text-ink-muted"
					>
						Пакуль няма гісторыі гульняў
					</Typography>
				) : (
					recent.map((date) => (
						<div
							key={date}
							className="flex items-center gap-flow-md py-flow-lg border-b border-rule last:border-0"
						>
							<Typography variant="body" as="div" className="flex-1 text-ink">
								{formatDateLabel(date)}
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
						{pluralize(1, "скапіравана", "nominative")}
					</div>
				)}
			</div>
		</div>
	);
}
