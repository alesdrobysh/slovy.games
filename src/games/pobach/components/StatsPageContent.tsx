// src/games/pobach/components/StatsPageContent.tsx
"use client";

import { Share2 } from "lucide-react";
import { Nav } from "@/shared/components/Nav";
import type {
	GameStats,
	HistoryRecord,
} from "@/games/pobach/core/entities/game";
import { formatRelativeDate } from "@/games/pobach/lib/stats";
import {
	pluralize,
	pluralizeAttemptsNominative,
} from "@/games/pobach/lib/utils";
import { Button } from "@/shared/components/ui/Button";
import { StatCard } from "@/shared/components/ui/StatCard";
import { useShare } from "@/shared/hooks/useShare";
import { DistributionChart } from "./DistributionChart";

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<h2 className="font-display text-lg font-medium text-ink mt-8 mb-4">
			{children}
		</h2>
	);
}

function HistoryItem({ game }: { game: HistoryRecord }) {
	return (
		<div className="flex items-center gap-3 py-3.5 border-b border-rule last:border-0">
			<span
				className={`w-2.5 h-2.5 rounded-full shrink-0 ${
					game.won ? "bg-success" : "bg-destructive"
				}`}
			/>
			<div className="font-semibold text-sm text-ink flex-1">
				<span className="font-display">#{game.dayIndex + 1}</span> Дзень
			</div>
			<div className="text-xs text-ink-muted flex items-center gap-3">
				{game.won ? (
					<span>
						<span className="font-display tabular-nums">{game.attempts}</span>{" "}
						{pluralize(game.attempts)}
					</span>
				) : (
					<span>Не адгадана</span>
				)}
				{(() => {
					const hintCount = game.guesses.filter((g) => g.isHint).length;
					return hintCount > 0 ? (
						<span>
							<span className="font-display">{hintCount}</span> падк.
						</span>
					) : null;
				})()}
				<span>{formatRelativeDate(game.dayIndex)}</span>
			</div>
		</div>
	);
}

export function StatsPageContent({
	stats,
	history,
}: {
	stats: GameStats;
	history: HistoryRecord[];
}) {
	const winRate =
		stats.gamesPlayed > 0
			? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
			: 0;

	const shareText = [
		"Мая статыстыка ў «Побач»:",
		`Перамог: ${stats.gamesWon}/${stats.gamesPlayed} (${winRate}%)`,
		`Макс. серыя: ${stats.maxStreak}`,
		stats.bestAttempts > 0
			? `Лепшы вынік: ${stats.bestAttempts} ${pluralizeAttemptsNominative(
					stats.bestAttempts
				)}`
			: null,
		"pobach.app",
	]
		.filter(Boolean)
		.join("\n");

	const { share, isSharing, showToast } = useShare(shareText);

	return (
		<>
			<Nav />

			<div className="page-narrow page-container py-6">
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
					<StatCard label="Гульняў" value={stats.gamesPlayed} />
					<div className="sm:col-span-2 lg:col-span-1">
						<StatCard label="Перамог %" value={winRate} />
					</div>
					<StatCard label="Серыя" value={stats.currentStreak} />
					<StatCard label="Макс." value={stats.maxStreak} />
				</div>

				<SectionTitle>Размеркаванне спроб</SectionTitle>
				<DistributionChart distribution={stats.distribution} />

				<SectionTitle>Гісторыя гульняў</SectionTitle>
				<div className="bg-card ring-1 ring-rule rounded-2xl px-4">
					{history.length === 0 ? (
						<div className="py-6 text-center text-sm text-ink-muted">
							Пакуль няма гісторыі гульняў
						</div>
					) : (
						history.map((game) => (
							<HistoryItem key={game.dayIndex} game={game} />
						))
					)}
				</div>

				<div className="mt-8 flex justify-center relative">
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
							className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-ink text-paper text-xs font-medium whitespace-nowrap shadow-lg"
						>
							Скапіравана!
						</div>
					)}
				</div>
			</div>
		</>
	);
}
