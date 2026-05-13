"use client";

import { Flame } from "lucide-react";
import Link from "next/link";
import type { Guess } from "@/games/pobach/core/entities/game";
import { getCurrentDayIndex, getStats } from "@/games/pobach/lib/storage";
import {
	pluralize,
	pluralizeHintsAccusative,
	pluralizeHintsInstrumental,
	pluralizeStreak,
} from "@/games/pobach/lib/utils";
import { useCountdown } from "@/shared/hooks/useCountdown";
import DictionaryLink from "./DictionaryLink";
import ShareButton from "./ShareButton";
import TopWordsList from "./TopWordsList";

type FinishCardProps = {
	dayIndex: number;
	sessionDayIndex: number | null;
	guesses: Guess[];
	mode: "win" | "lose";
	targetWord?: string;
};

export default function FinishCard({
	dayIndex,
	sessionDayIndex,
	guesses,
	mode,
	targetWord,
}: FinishCardProps) {
	const countdown = useCountdown();
	const attempts = guesses.length;
	const hintsCount = guesses.filter((g) => g.isHint).length;
	const streak = mode === "win" ? getStats().currentStreak : 0;
	const currentDayIndex = getCurrentDayIndex();
	const isNewDayAvailable =
		sessionDayIndex !== null && currentDayIndex > sessionDayIndex;
	const isWin = mode === "win";

	return (
		<div
			data-testid="finish-card"
			className={`rounded-2xl p-8 sm:p-10 ring-1 my-6 animate-fade-in-up ${
				isWin ? "bg-pobach-soft ring-pobach/30" : "bg-card ring-rule"
			}`}
		>
			<h2 className="font-display text-3xl font-medium mb-2 text-ink">
				{isWin ? "Адгадана 🎉" : "Заўтра — новае слова"}
			</h2>
			<p className="text-ink-muted mb-4">
				{isWin
					? `Вы знайшлі слова за ${attempts} ${pluralize(attempts)}${hintsCount > 0 ? ` з ${hintsCount} ${pluralizeHintsInstrumental(hintsCount)}` : ""}.`
					: `Нічога страшнага — заўтра новае слова.${hintsCount > 0 ? ` Выкарыстана ${hintsCount} ${pluralizeHintsAccusative(hintsCount)}.` : ""}`}
			</p>

			{!isWin && targetWord && (
				<p className="text-sm text-ink mb-3">
					Правільнае слова:{" "}
					<strong className="text-pobach font-semibold">
						<DictionaryLink word={targetWord} />
					</strong>
				</p>
			)}

			{/* Share */}
			<div className="mb-4">
				<ShareButton dayIndex={dayIndex} guesses={guesses} won={isWin} />
			</div>

			{/* Streak */}
			{isWin && streak > 0 && (
				<Link
					href="/stats"
					className="inline-flex items-center gap-1.5 text-pobach text-sm font-medium hover:opacity-80 transition-opacity no-underline"
				>
					<Flame size={16} />
					{streak} {pluralizeStreak(streak)}
				</Link>
			)}

			{/* Countdown / new day */}
			<div className="mt-4 text-sm text-ink-muted">
				{isNewDayAvailable ? (
					<button
						onClick={() => window.location.reload()}
						type="button"
						className="btn-primary bg-pobach"
					>
						Даступна новае слова!
					</button>
				) : (
					<div className="flex items-center gap-2">
						<span>Наступнае слова праз</span>
						<span className="font-mono tabular-nums text-ink">{countdown}</span>
					</div>
				)}
			</div>

			<TopWordsList dayIndex={dayIndex} mode={mode} />
		</div>
	);
}
