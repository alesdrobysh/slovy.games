"use client";

import { Flame, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Guess } from "@/games/pobach/core/entities/game";
import { getCurrentDayIndex, getStats } from "@/games/pobach/lib/storage";
import {
	pluralize,
	pluralizeHintsAccusative,
	pluralizeHintsInstrumental,
	pluralizeStreak,
} from "@/games/pobach/lib/utils";
import { NextGameCountdown } from "@/shared/components/NextGameCountdown";
import { TryOtherGamesLink } from "@/shared/components/TryOtherGamesLink";
import { Button } from "@/shared/components/ui/Button";
import { Typography } from "@/shared/components/ui/Typography";
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
			className={`rounded-2xl p-inset-xl sm:p-inset-2xl ring-1 my-6 animate-fade-in-up ${
				isWin ? "bg-pobach-soft ring-pobach/30" : "bg-card ring-rule"
			}`}
		>
			{isWin ? (
				<Typography
					variant="title"
					as="h2"
					style={{
						marginBottom: "var(--space-flow-lg)",
						display: "flex",
						alignItems: "center",
						gap: "var(--space-flow-sm)",
					}}
				>
					Адгадана <Sparkles size={28} style={{ color: "var(--pobach)" }} />
				</Typography>
			) : (
				<>
					{targetWord && (
						<Typography
							variant="title"
							as="h2"
							style={{ color: "var(--pobach)", marginBottom: "var(--space-flow-lg)" }}
						>
							{targetWord}
						</Typography>
					)}
				</>
			)}

			<Typography
				variant="body"
				style={{ marginBottom: "var(--space-flow-sm)" }}
			>
				{isWin
					? `Вы адгадалі слова за ${attempts} ${pluralize(attempts)}${hintsCount > 0 ? ` з ${hintsCount} ${pluralizeHintsInstrumental(hintsCount)}` : ""}. Заўтра будзе новае слова.`
					: `Дзякуй за гульню.${hintsCount > 0 ? ` Выкарыстана ${hintsCount} ${pluralizeHintsAccusative(hintsCount)}.` : ""} Заўтра будзе новае слова.`
				}
			</Typography>

			{isWin && (
				<div style={{ marginBottom: "var(--space-flow-lg)" }}>
					<ShareButton dayIndex={dayIndex} guesses={guesses} won={isWin} />
				</div>
			)}

			{isWin && streak > 0 && (
				<Button variant="ghost" color="primary" as={Link} href="/pobach/stats">
					<Flame size={14} />
					{streak} {pluralizeStreak(streak)}
				</Button>
			)}

			<NextGameCountdown
				isNewDayAvailable={isNewDayAvailable}
				newGameLabel="Даступна новае слова!"
			/>

			<div className="mt-inset-lg">
				<TryOtherGamesLink className="text-pobach" />
			</div>

			<div style={{ marginTop: "var(--space-inset-md)", marginLeft: "calc(var(--space-inset-md) * -1)", marginRight: "calc(var(--space-inset-md) * -1)" }}>
				<TopWordsList dayIndex={dayIndex} />
			</div>
		</div>
	);
}
