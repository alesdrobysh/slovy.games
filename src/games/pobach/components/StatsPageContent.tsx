// src/games/pobach/components/StatsPageContent.tsx
"use client";

import { Share2 } from "lucide-react";
import { Nav } from "@/shared/components/Nav";
import type {
	GameStats,
	HistoryRecord,
} from "@/games/pobach/core/entities/game";
import { formatRelativeDate } from "@/games/pobach/lib/stats";
import { pluralize } from "@/shared/lib/pluralize";
import { useDictReady } from "@/shared/hooks/useDictReady";
import { Button } from "@/shared/components/ui/Button";
import { StatCard } from "@/shared/components/ui/StatCard";
import { Typography } from "@/shared/components/ui/Typography";
import { useShare } from "@/shared/hooks/useShare";
import { DistributionChart } from "./DistributionChart";

function HistoryItem({ game }: { game: HistoryRecord }) {
	"use no memo";
	return (
		<div className="flex items-center gap-flow-md py-flow-lg border-b border-rule last:border-0">
			<span
				className={`w-2.5 h-2.5 rounded-full shrink-0 ${
					game.won ? "bg-success" : "bg-destructive"
				}`}
			/>
			<Typography variant="body" as="div" className="flex-1 text-ink">
				<span className="font-display">#{game.dayIndex + 1}</span> Дзень
			</Typography>
			<Typography variant="caption" as="div" className="flex items-center gap-flow-md text-ink-muted">
				{game.won ? (
					<span>
						<span className="font-display tabular-nums">{game.attempts}</span>{" "}
						{pluralize(game.attempts, "спроба")}
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
			</Typography>
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
	"use no memo";
	useDictReady();
	const winRate =
		stats.gamesPlayed > 0
			? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
			: 0;

	const shareText = [
		"Мая статыстыка ў «Побач»:",
		`Перамог: ${stats.gamesWon}/${stats.gamesPlayed} (${winRate}%)`,
		`Макс. серыя: ${stats.maxStreak}`,
		stats.bestAttempts > 0
			? `Лепшы вынік: ${stats.bestAttempts} ${pluralize(stats.bestAttempts, "спроба")}`
			: null,
		"slovy.games",
	]
		.filter(Boolean)
		.join("\n");

	const { share, isSharing, showToast } = useShare(shareText, { game: "pobach", context: "stats" });

	return (
		<>
			<Nav />

			<div className="page-narrow page-container py-inset-lg flex flex-col gap-y-flow-lg">
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-flow-md">
					<StatCard label="Гульняў" value={stats.gamesPlayed} />
					<StatCard label="Перамог %" value={winRate} />
					<StatCard label="Серыя" value={stats.currentStreak} />
					<StatCard label="Макс." value={stats.maxStreak} />
				</div>

				<Typography variant="heading" as="h2" className="mt-inset-xl mb-flow-lg text-ink">Размеркаванне спроб</Typography>
				<DistributionChart distribution={stats.distribution} />

				<Typography variant="heading" as="h2" className="mt-inset-xl mb-flow-lg text-ink">Гісторыя гульняў</Typography>
				<div className="bg-card ring-1 ring-rule rounded-2xl px-flow-lg">
					{history.length === 0 ? (
						<Typography variant="body" as="div" className="py-inset-lg text-center text-ink-muted">
							Пакуль няма гісторыі гульняў
						</Typography>
					) : (
						history.map((game) => (
							<HistoryItem key={game.dayIndex} game={game} />
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
		</>
	);
}
