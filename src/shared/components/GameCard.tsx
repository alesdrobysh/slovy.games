"use client";

import Link from "next/link";
import type { GameInfo } from "@/shared/types";
import { Typography } from "@/shared/components/ui/Typography";

export type GameCardStatus = "not_started" | "in_progress" | "won" | "given_up";

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

function GameIllustration({ gameId, className }: { gameId: string; className?: string }) {
	if (gameId === "valoshka") {
		return (
			<svg viewBox="0 0 100 100" className={`${className} opacity-[0.07] dark:opacity-[0.15]`} fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M50 10 L58 35 L85 42 L65 60 L70 85 L50 72 L30 85 L35 60 L15 42 L42 35 Z" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" className="text-valoshka" />
				<circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" className="text-valoshka" />
				<path d="M50 20 V80 M20 50 H80" stroke="currentColor" strokeWidth="0.3" className="text-valoshka" />
			</svg>
		);
	}
	if (gameId === "pobach") {
		return (
			<svg viewBox="0 0 100 100" className={`${className} opacity-[0.07] dark:opacity-[0.15]`} fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" className="text-pobach" />
				<circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 6" className="text-pobach" />
				<path d="M50 5 L50 15 M95 50 L85 50 M50 95 L50 85 M5 50 L15 50" stroke="currentColor" strokeWidth="1" className="text-pobach" />
				<path d="M30 30 L70 70 M70 30 L30 70" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1 3" className="text-pobach" />
			</svg>
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
	const isPobach = game.id === "pobach";
	const accentBg = isPobach ? "bg-pobach" : "bg-valoshka";
	const accentText = isPobach ? "text-pobach" : "text-valoshka";

	return (
		<Link
			href={game.path}
			className="group relative flex flex-col bg-card ring-1 ring-rule/50 rounded-4xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-ink/10 hover:ring-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/30 focus-visible:ring-offset-4 focus-visible:ring-offset-paper animate-fade-in-up no-underline h-full"
			style={{ animationDelay: `${delay}ms` }}
		>
			<div className="absolute inset-0 bg-paper/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

			<div className="relative flex flex-col h-full bg-card ring-1 ring-rule/30 rounded-3xl overflow-hidden transition-transform duration-500 group-hover:scale-[0.99]">
				{/* Background Illustration */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden">
					<GameIllustration gameId={game.id} className="w-[120%] h-[120%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-2000 ease-out group-hover:scale-110 group-hover:rotate-6" />
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
								game={isPobach ? "pobach" : "valoshka"}
								className="text-ink-muted max-w-[45ch] overflow-hidden"
							>
								{game.description}
							</Typography>
						</div>
					</div>

					<div className="border-t border-rule/20 pt-inset-lg">
						<div className="mb-inset-xl flex items-center justify-between">
							<div className="flex flex-col gap-flow-sm">
								<Typography variant="overline" as="span" className="text-ink-soft">
									{isCompleted ? "Вынік" : "Статус"}
								</Typography>
								<Typography variant="body" as="span" className="text-ink">
									{progressText}
								</Typography>
							</div>
							{isCompleted && (
								<span className={`w-3 h-3 rounded-full ${accentBg} shadow-sm ${accentBg === "bg-valoshka" ? "shadow-valoshka/30" : "shadow-pobach/30"}`} />
							)}
						</div>

						<span
							className={`flex items-center justify-center w-full px-inset-xl py-flow-lg rounded-2xl text-sm font-bold tracking-widest uppercase transition-all duration-300 border-2 ${
								isCompleted
									? "bg-secondary/50 border-rule text-ink hover:bg-rule"
									: `${isPobach ? "border-pobach text-pobach hover:bg-pobach hover:text-white" : "border-valoshka text-valoshka hover:bg-valoshka hover:text-white"}`
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
