"use client";

import { CheckCircle2, Frown, Share2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Typography } from "@/shared/components/ui/Typography";
import { useShare } from "@/shared/hooks/useShare";
import type { Article, SavedProgress } from "../types";

interface FinishCardProps {
	mode: "win" | "lose";
	article: Article;
	progress: SavedProgress;
	onPlayAnother?: () => void;
}

function buildShareText(
	mode: "win" | "lose",
	_article: Article,
	progress: SavedProgress
): string {
	const head = mode === "win" ? "Рэдактле: здагадаўся!" : "Рэдактле: здаўся";
	const guesses = progress.guesses.length;
	const hintFlag = progress.hintsUsed > 0 ? " (з падказкай)" : "";
	return `${head}${hintFlag} — ${guesses} спроб, ${progress.foundLemmas.length} расшыфраваных слоў. slovy.games/redaktle`;
}

export function FinishCard({
	mode,
	article,
	progress,
	onPlayAnother,
}: FinishCardProps) {
	const shareText = buildShareText(mode, article, progress);
	const { share, showToast } = useShare(shareText, {
		game: "redaktle",
		context: "finish",
	});

	const Icon = mode === "win" ? CheckCircle2 : Frown;
	const accent = mode === "win" ? "text-redaktle" : "text-ink-muted";
	const title = mode === "win" ? "Так, гэта была правільная назва!" : "Адказ";

	return (
		<section className="bg-card ring-1 ring-rule rounded-2xl p-inset-lg flex flex-col gap-flow-md">
			<div className="flex items-center gap-flow-sm">
				<Icon className={accent} size={28} aria-hidden="true" />
				<Typography variant="heading" as="h2" className={accent}>
					{title}
				</Typography>
			</div>
			<div>
				<Typography
					variant="overline"
					as="p"
					className="text-ink-soft mb-flow-xs"
				>
					Артыкул
				</Typography>
				<Typography variant="subheading" as="p" className="text-redaktle">
					{article.title}
				</Typography>
			</div>
			<div className="text-ink-muted text-sm">
				<a
					href={article.source}
					target="_blank"
					rel="noopener noreferrer"
					className="text-redaktle underline hover:opacity-80"
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
			{showToast && (
				<p className="text-redaktle text-sm" role="status">
					Скапіявана ў буфер абмену
				</p>
			)}
		</section>
	);
}
