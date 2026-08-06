"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { CornflowerContour } from "@/shared/components/CornflowerContour";
import { PobachContour } from "@/shared/components/PobachContour";
import { SakretnaContour } from "@/shared/components/SakretnaContour";
import { Typography } from "@/shared/components/ui/Typography";
import type { GameCardStatus, GameInfo } from "@/shared/types";

const CTA_LABEL: Record<GameCardStatus, string> = {
	not_started: "Гуляць",
	in_progress: "Працягнуць",
	won: "Вынік",
	given_up: "Вынік",
};

interface GameCardProps {
	game: GameInfo;
	status: GameCardStatus;
	progressText?: string;
	delay?: number;
}

function GameIllustration({
	gameId,
	className,
}: {
	gameId: string;
	className?: string;
}) {
	if (gameId === "valoshka") {
		return (
			<CornflowerContour
				className={`${className} opacity-[0.07] dark:opacity-[0.15] text-valoshka`}
			/>
		);
	}
	if (gameId === "pobach") {
		return (
			<PobachContour
				className={`${className} opacity-[0.07] dark:opacity-[0.15] text-pobach`}
			/>
		);
	}
	if (gameId === "sakretna") {
		return (
			<SakretnaContour
				className={`${className} opacity-[0.07] dark:opacity-[0.15] text-sakretna`}
			/>
		);
	}
	return null;
}

export function GameCard({
	game,
	status,
	progressText = "Чакае вас",
	delay = 0,
}: GameCardProps) {
	const isCompleted = status === "won" || status === "given_up";
	const ctaLabel = CTA_LABEL[status];
	const _isPobach = game.id === "pobach";
	const accentBg =
		game.id === "pobach"
			? "bg-pobach"
			: game.id === "sakretna"
				? "bg-sakretna"
				: "bg-valoshka";
	const accentText =
		game.id === "pobach"
			? "text-pobach"
			: game.id === "sakretna"
				? "text-sakretna"
				: "text-valoshka";
	const accentRing =
		accentBg === "bg-valoshka"
			? "shadow-valoshka/30"
			: accentBg === "bg-sakretna"
				? "shadow-sakretna/30"
				: "shadow-pobach/30";
	const gameKey =
		game.id === "pobach"
			? "pobach"
			: game.id === "sakretna"
				? "sakretna"
				: "valoshka";
	const accentBorderClass =
		game.id === "pobach"
			? "border-pobach text-pobach hover:bg-pobach hover:text-white"
			: game.id === "sakretna"
				? "border-sakretna text-sakretna hover:bg-sakretna hover:text-white"
				: "border-valoshka text-valoshka hover:bg-valoshka hover:text-white";

	return (
		<Link
			href={game.path}
			onClick={() =>
				posthog.capture("game_card_clicked", { game: game.id, status })
			}
			className="group relative flex flex-col bg-card ring-1 ring-rule/50 rounded-4xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-ink/10 hover:ring-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-4 focus-visible:ring-offset-paper animate-fade-in-up no-underline h-full"
			style={{ animationDelay: `${delay}ms` }}
		>
			<div className="absolute inset-0 bg-paper/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

			<div className="relative flex flex-col h-full bg-card ring-1 ring-rule/30 rounded-3xl overflow-hidden transition-transform duration-500 group-hover:scale-[0.99]">
				{/* Background Illustration */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden">
					<GameIllustration
						gameId={game.id}
						className="w-[120%] h-[120%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-2000 ease-out group-hover:scale-110 group-hover:rotate-6"
					/>
				</div>

				<div className="p-inset-xl sm:p-inset-2xl flex flex-col h-full relative z-10">
					<div className="flex-1 min-w-0 pb-inset-lg">
						<div className="flex items-center gap-flow-lg mb-flow-lg">
							<span className={`w-8 h-0.5 ${accentBg}`} />
							<Typography variant="overline" as="span" className={accentText}>
								{game.name}
							</Typography>
						</div>

						<div className="flex flex-col gap-inset-lg">
							<Typography
								variant="title"
								as="h2"
								className="text-ink group-hover:text-ink transition-colors"
							>
								{game.nameBel}
							</Typography>

							<Typography
								variant="caption"
								as="p"
								dropCap
								game={gameKey}
								className="text-ink-muted max-w-[45ch] overflow-hidden"
							>
								{game.description}
							</Typography>
						</div>
					</div>

					<div className="pt-inset-lg">
						<div className="mb-inset-xl flex items-center justify-between">
							<div className="flex flex-col gap-flow-sm">
								<Typography
									variant="overline"
									as="span"
									className="text-ink-soft"
								>
									{isCompleted ? "Вынік" : "Статус"}
								</Typography>
								<Typography variant="body" as="span" className="text-ink">
									{progressText}
								</Typography>
							</div>
							{isCompleted && (
								<span
									className={`w-3 h-3 rounded-full ${accentBg} shadow-sm ${accentRing}`}
								/>
							)}
						</div>

						<span
							className={`flex items-center justify-center w-full px-inset-xl py-flow-lg rounded-2xl text-sm font-bold tracking-widest uppercase transition-all duration-300 border-2 ${
								isCompleted
									? "bg-secondary/50 border-rule text-ink hover:bg-rule"
									: accentBorderClass
							} hover:shadow-lg active:scale-95`}
						>
							{ctaLabel}
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
