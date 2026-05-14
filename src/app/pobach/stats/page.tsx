"use client";

import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "@/games/pobach/components/Header";
import type { HistoryRecord } from "@/games/pobach/core/entities/game";
import { formatRelativeDate } from "@/games/pobach/lib/stats";
import { getHistory, getStats } from "@/games/pobach/lib/storage";
import {
	pluralize,
	pluralizeAttemptsNominative,
} from "@/games/pobach/lib/utils";
import { Button } from "@/shared/components/ui/Button";

type StatCardData = {
	label: string;
	value: string | number;
};

function StatCard({
	label,
	value,
	featured = false,
}: StatCardData & { featured?: boolean }) {
	return (
		<div
			className={`bg-card ring-1 ring-rule rounded-2xl p-5 text-center sm:text-left ${featured ? "sm:col-span-2 lg:col-span-1" : ""}`}
		>
			<div
				className={`font-display font-medium text-ink leading-none mb-1.5 ${featured ? "text-4xl" : "text-3xl"}`}
			>
				{value}
			</div>
			<div className="text-[10px] text-ink-soft font-medium uppercase tracking-[0.2em] leading-tight">
				{label}
			</div>
		</div>
	);
}

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<h2 className="font-display text-lg font-medium text-ink mt-8 mb-4">
			{children}
		</h2>
	);
}

type DistributionRange = {
	label: string;
	min: number;
	max: number;
	color: string;
};

const DISTRIBUTION_RANGES: DistributionRange[] = [
	{ label: "1", min: 1, max: 1, color: "var(--sly-attempts-1)" },
	{ label: "2–10", min: 2, max: 10, color: "var(--sly-attempts-10)" },
	{ label: "11–50", min: 11, max: 50, color: "var(--sly-attempts-50)" },
	{ label: "51–100", min: 51, max: 100, color: "var(--sly-attempts-100)" },
	{ label: "100+", min: 101, max: Infinity, color: "var(--sly-attempts-many)" },
];

function getCountForRange(
	distribution: Record<number, number>,
	min: number,
	max: number
): number {
	let count = 0;
	for (const [attempts, value] of Object.entries(distribution)) {
		const num = Number(attempts);
		if (num >= min && num <= max) count += value;
	}
	return count;
}

function DistributionChart({
	distribution,
}: {
	distribution: Record<number, number>;
}) {
	const rangeCounts = DISTRIBUTION_RANGES.map((range) => ({
		...range,
		count: getCountForRange(distribution, range.min, range.max),
	}));
	const maxCount = Math.max(...rangeCounts.map((r) => r.count), 1);

	return (
		<div className="space-y-2">
			{rangeCounts.map((range) => {
				const percentage =
					range.count > 0
						? Math.max(Math.round((range.count / maxCount) * 100), 8)
						: 0;

				return (
					<div key={range.label} className="flex items-center gap-3 text-sm">
						<div className="w-14 text-right text-ink-muted shrink-0 whitespace-nowrap font-display tabular-nums">
							{range.label}
						</div>
						<div className="flex-1 h-10 bg-rule rounded-lg overflow-hidden relative">
							{range.count > 0 ? (
								<div
									className="h-full min-w-12 rounded-lg flex items-center justify-end pr-3 transition-all duration-500"
									style={{
										width: `${percentage}%`,
										backgroundColor: range.color,
									}}
									role="progressbar"
									aria-valuenow={range.count}
									aria-valuemin={0}
									aria-valuemax={maxCount}
								>
									<span className="text-white font-bold text-sm font-display">
										{range.count}
									</span>
								</div>
							) : (
								<div
									className="h-full w-12 rounded-lg flex items-center justify-center"
									style={{ backgroundColor: range.color }}
								>
									<span className="text-white font-bold text-sm font-display">
										0
									</span>
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
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

async function handleShare(
	text: string
): Promise<"share" | "clipboard" | false> {
	if (navigator.share) {
		try {
			await navigator.share({ text });
			return "share";
		} catch (err) {
			if (err instanceof Error && err.name === "AbortError") return false;
		}
	}

	try {
		await navigator.clipboard.writeText(text);
		return "clipboard";
	} catch {
		return false;
	}
}

export default function PobachStatsPage() {
	const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);
	const [history, setHistory] = useState<HistoryRecord[]>([]);
	const [showToast, setShowToast] = useState(false);
	const [isSharing, setIsSharing] = useState(false);

	useEffect(() => {
		setStats(getStats());
		setHistory(getHistory().slice(0, 10).reverse());
	}, []);

	if (!stats) return null;

	const winRate =
		stats.gamesPlayed > 0
			? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
			: 0;

	const onShareStats = async () => {
		if (isSharing) return;
		setIsSharing(true);

		const text = [
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

		const result = await handleShare(text);
		if (result === "clipboard") {
			setShowToast(true);
			setTimeout(() => setShowToast(false), 2000);
		}
		setIsSharing(false);
	};

	return (
		<>
			<Header />

			<div className="page-narrow page-container py-6">
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
					<StatCard label="Гульняў" value={stats.gamesPlayed} />
					<StatCard label="Перамог %" value={winRate} featured />
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
						onClick={onShareStats}
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
