"use client";

import { CheckCircle2, Frown, Share2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Typography } from "@/shared/components/ui/Typography";
import { SAKRETNA_EPOCH_DATE } from "@/shared/config";
import { useShare } from "@/shared/hooks/useShare";
import { dayIndexForDate } from "@/shared/lib/timezone";
import type { Article, SavedProgress } from "../types";

interface FinishCardProps {
	mode: "win" | "lose";
	article: Article;
	progress: SavedProgress;
	onPlayAnother?: () => void;
}

function shareDuration(progress: SavedProgress): string {
	if (!progress.startedAt || !progress.finishedAt) return "—";
	const seconds = Math.max(
		0,
		Math.round(
			(new Date(progress.finishedAt).getTime() -
				new Date(progress.startedAt).getTime()) /
				1000
		)
	);
	return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function buildShareText(
	mode: "win" | "lose",
	_article: Article,
	progress: SavedProgress
): string {
	const guesses = progress.guesses.length;
	const daily = /^\d{4}-\d{2}-\d{2}$/.test(progress.date);
	const number = daily
		? dayIndexForDate(SAKRETNA_EPOCH_DATE, progress.date) + 1
		: null;
	const patternCount = Math.min(guesses, 12);
	const overflow = guesses > patternCount ? `+${guesses - patternCount}` : "";
	const pattern = `${"🟧".repeat(patternCount)}${overflow}${mode === "win" ? "🟩" : "⬜"}`;
	const link = daily
		? `https://slovy.games/sakretna/day/${progress.date}`
		: "https://slovy.games/sakretna";
	return [
		`Сакрэтна ${number ? `#${number}` : "· вольная гульня"} · ${progress.date}`,
		pattern,
		`${mode === "win" ? "Здагадана" : "Здача"} · ${guesses} спроб · падказка: ${progress.hintsUsed > 0 ? "так" : "не"} · ${shareDuration(progress)}`,
		link,
	].join("\n");
}

export function FinishCard({
	mode,
	article,
	progress,
	onPlayAnother,
}: FinishCardProps) {
	const shareText = buildShareText(mode, article, progress);
	const { share, isSharing, shareFeedback } = useShare(shareText, {
		game: "sakretna",
		context: "finish",
	});

	const Icon = mode === "win" ? CheckCircle2 : Frown;
	const accent = mode === "win" ? "text-sakretna" : "text-ink-muted";
	const title = mode === "win" ? "Так, гэта была правільная назва!" : "Адказ";

	return (
		<section className="bg-card ring-1 ring-rule rounded-2xl p-inset-lg flex flex-col gap-flow-md">
			<div className="flex items-center gap-flow-sm">
				<Icon className={accent} size={28} aria-hidden="true" />
				<div className={accent}>
					<Typography variant="heading" as="h2">
						{title}
					</Typography>
				</div>
			</div>
			<div>
				<div className="text-ink-muted mb-flow-xs">
					<Typography variant="overline" as="p">
						Артыкул
					</Typography>
				</div>
				<div className="text-sakretna">
					<Typography variant="subheading" as="p">
						{article.title}
					</Typography>
				</div>
			</div>
			<div className="text-ink-muted text-sm">
				<a
					href={article.source}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex min-h-(--control-min-height) items-center text-sakretna underline hover:opacity-80"
				>
					Адкрыць у Вікіпедыі
				</a>
				{article.author && (
					<span className="block mt-1 text-xs text-ink-soft">
						Крыніца: {article.author}, CC BY-SA 4.0
					</span>
				)}
			</div>
			<div className="flex flex-wrap items-center gap-flow-sm pt-flow-sm">
				<Button
					variant="solid"
					color="primary"
					size="md"
					startIcon={<Share2 size={16} />}
					onClick={() => share()}
					disabled={isSharing}
				>
					Падзяліцца
				</Button>
				{onPlayAnother && (
					<Button
						variant="ghost"
						color="neutral"
						size="md"
						onClick={onPlayAnother}
					>
						Іншы артыкул
					</Button>
				)}
			</div>
			{shareFeedback && (
				<p
					className={
						shareFeedback === "failed"
							? "text-(--color-destructive) text-sm"
							: "text-sakretna text-sm"
					}
					role="status"
				>
					{shareFeedback === "shared"
						? "Адпраўлена"
						: shareFeedback === "copied"
							? "Скапіявана ў буфер абмену"
							: "Не атрымалася падзяліцца. Паспрабуйце яшчэ раз."}
				</p>
			)}
		</section>
	);
}
