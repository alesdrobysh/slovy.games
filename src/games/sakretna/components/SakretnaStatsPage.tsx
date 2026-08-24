"use client";

import { Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
	DEFAULT_STATS,
	loadProgress,
	loadStats,
} from "@/games/sakretna/lib/storage";
import type { GameStats, SavedProgress } from "@/games/sakretna/types";
import { Button } from "@/shared/components/ui/Button";
import { StatCard } from "@/shared/components/ui/StatCard";
import { Typography } from "@/shared/components/ui/Typography";
import { useShare } from "@/shared/hooks/useShare";
import { pluralize } from "@/shared/lib/pluralize";

function formatDateLabel(date: string): string {
	const today = new Date().toISOString().slice(0, 10);
	if (date === today) return "Сёння";
	return new Date(`${date}T00:00:00Z`).toLocaleDateString("be-BY", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export function formatDuration(progress: SavedProgress): string {
	if (!progress.startedAt || !progress.finishedAt) return "—";
	const seconds = Math.max(
		0,
		Math.round(
			(new Date(progress.finishedAt).getTime() -
				new Date(progress.startedAt).getTime()) /
				1000
		)
	);
	const minutes = Math.floor(seconds / 60);
	return minutes > 0 ? `${minutes} хв ${seconds % 60} с` : `${seconds} с`;
}

function recentCalendar(days: number): string[] {
	const result: string[] = [];
	const cursor = new Date();
	cursor.setUTCHours(0, 0, 0, 0);
	for (let offset = days - 1; offset >= 0; offset--) {
		const date = new Date(cursor);
		date.setUTCDate(cursor.getUTCDate() - offset);
		result.push(date.toISOString().slice(0, 10));
	}
	return result;
}

export function SakretnaStatsPage() {
	const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
	const [games, setGames] = useState<SavedProgress[]>([]);
	useEffect(() => {
		const loaded = loadStats();
		setStats(loaded);
		setGames(
			[...loaded.datesPlayed]
				.sort()
				.reverse()
				.map(loadProgress)
				.filter((game): game is SavedProgress => game !== null)
		);
	}, []);

	const winRate =
		stats.totalPlayed > 0
			? Math.round((stats.totalWins / stats.totalPlayed) * 100)
			: 0;
	const playedDates = useMemo(
		() => new Set(stats.datesPlayed),
		[stats.datesPlayed]
	);
	const wonDates = useMemo(() => new Set(stats.datesWon), [stats.datesWon]);
	const calendar = useMemo(() => recentCalendar(28), []);
	const shareText = useMemo(
		() =>
			[
				"Мая статыстыка ў «Сакрэтна»:",
				`Гульняў: ${stats.totalPlayed}`,
				`Здагадана: ${stats.totalWins} (${winRate}%)`,
				`Бягучая серыя: ${stats.currentStreak}`,
				`Макс. серыя: ${stats.longestStreak}`,
				`Падказак: ${stats.hintsUsedCount}`,
				"slovy.games/sakretna",
			].join("\n"),
		[stats, winRate]
	);
	const { share, isSharing, showToast } = useShare(shareText, {
		game: "sakretna",
		context: "stats",
	});

	return (
		<div className="mx-auto max-w-3xl px-5 sm:px-8 py-inset-lg flex flex-col gap-y-flow-lg">
			<header className="flex flex-col gap-flow-xs">
				<div className="text-sakretna">
					<Typography variant="overline" as="span">
						Сакрэтна
					</Typography>
				</div>
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

			<section aria-labelledby="calendar-heading">
				<h2
					id="calendar-heading"
					className="font-display text-xl font-semibold text-ink mb-flow-md"
				>
					Апошнія 28 дзён
				</h2>
				<fieldset className="grid grid-cols-7 gap-flow-xs">
					<legend className="sr-only">Каляндар гульняў</legend>
					{calendar.map((date) => {
						const played = playedDates.has(date);
						const won = wonDates.has(date);
						return (
							<span
								key={date}
								role="img"
								title={`${formatDateLabel(date)}: ${won ? "перамога" : played ? "здача" : "не гулялі"}`}
								aria-label={`${formatDateLabel(date)}: ${won ? "перамога" : played ? "здача" : "не гулялі"}`}
								className={`aspect-square rounded-md ring-1 ring-rule ${won ? "bg-sakretna" : played ? "bg-ink-muted" : "bg-card"}`}
							/>
						);
					})}
				</fieldset>
			</section>

			<section aria-labelledby="games-heading">
				<h2
					id="games-heading"
					className="font-display text-xl font-semibold text-ink mb-flow-md"
				>
					Партыі
				</h2>
				<div className="bg-card ring-1 ring-rule rounded-2xl divide-y divide-rule">
					{games.length === 0 ? (
						<div className="p-inset-lg text-center text-ink-muted">
							<p>
								Згуляйце сённяшнюю партыю — тут з’явяцца вынік, спробы, падказкі
								і час.
							</p>
							<Link
								href="/sakretna"
								className="inline-flex min-h-11 items-center mt-flow-sm text-sakretna underline"
							>
								Пачаць гульню
							</Link>
						</div>
					) : (
						games.slice(0, 10).map((game) => (
							<Link
								key={game.date}
								href={`/sakretna/play/${game.articleId}`}
								className="min-h-16 p-inset-md flex items-center justify-between gap-flow-md hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
							>
								<div>
									<p className="font-semibold text-ink">
										{formatDateLabel(game.date)}
									</p>
									<p className="text-sm text-ink-muted">
										{game.won ? "Перамога" : "Здача"} · {game.guesses.length}{" "}
										спроб · {game.hintsUsed ? "з падказкай" : "без падказкі"}
									</p>
								</div>
								<span className="text-sm text-ink-muted whitespace-nowrap">
									{formatDuration(game)}
								</span>
							</Link>
						))
					)}
				</div>
			</section>

			<div className="flex justify-center relative">
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
