"use client";

import Link from "next/link";
import type { GameInfo } from "@/shared/types";

interface GameCardProps {
	game: GameInfo;
	hasPlayedToday: boolean;
	progressText?: string;
	ctaLabel?: string;
	delay?: number;
	featured?: boolean;
}

function GameIllustration({ gameId, className, featured }: { gameId: string; className?: string; featured?: boolean }) {
	const opacityClass = featured ? "opacity-10 dark:opacity-20" : "opacity-[0.07] dark:opacity-[0.15]";
	if (gameId === "valoshka") {
		return (
			<svg viewBox="0 0 100 100" className={`${className} ${opacityClass}`} fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M50 10 L58 35 L85 42 L65 60 L70 85 L50 72 L30 85 L35 60 L15 42 L42 35 Z" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" className="text-valoshka" />
				<circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" className="text-valoshka" />
				<path d="M50 20 V80 M20 50 H80" stroke="currentColor" strokeWidth="0.3" className="text-valoshka" />
			</svg>
		);
	}
	if (gameId === "pobach") {
		return (
			<svg viewBox="0 0 100 100" className={`${className} ${opacityClass}`} fill="none" xmlns="http://www.w3.org/2000/svg">
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
	hasPlayedToday,
	progressText,
	ctaLabel = "Гуляць",
	delay = 0,
	featured = false,
}: GameCardProps) {
	const isCompleted = ctaLabel === "Вынік";
	const isPobach = game.id === "pobach";
	const accentBg = isPobach ? "bg-pobach" : "bg-valoshka";
	const accentText = isPobach ? "text-pobach" : "text-valoshka";
	const accentSoft = isPobach ? "bg-pobach-soft" : "bg-valoshka-soft";

	return (
		<Link
			href={game.path}
			className={`group relative flex flex-col bg-card ring-1 ring-rule/50 rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-ink/10 hover:ring-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/30 focus-visible:ring-offset-4 focus-visible:ring-offset-paper animate-fade-in-up no-underline h-full ${
				featured ? "sm:p-4" : ""
			}`}
			style={{ animationDelay: `${delay}ms` }}
		>
			<div className="absolute inset-0 bg-paper/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
			
			<div className={`relative flex flex-col h-full bg-card ring-1 ring-rule/30 rounded-[1.8rem] overflow-hidden transition-transform duration-500 group-hover:scale-[0.99]`}>
				{/* Background Illustration */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden">
					<GameIllustration gameId={game.id} featured={featured} className={`w-[120%] h-[120%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-[2000ms] ease-out group-hover:scale-110 group-hover:rotate-6`} />
				</div>

				<div className={`p-8 sm:p-12 flex flex-col h-full relative z-10 ${featured ? "lg:flex-row lg:items-center lg:gap-16" : ""}`}>
					<div className={featured ? "lg:flex-1" : ""}>
						<div className="flex items-center gap-4 mb-4">
							<span className={`w-8 h-[2px] ${accentBg}`} />
							<span className={`text-[10px] uppercase tracking-[0.3em] font-bold ${accentText}`}>
								{game.id}
							</span>
						</div>
						
						<h2 className={`font-display font-bold tracking-tight text-ink mb-6 group-hover:text-ink transition-colors ${
							featured ? "text-5xl sm:text-6xl lg:text-7xl" : "text-3xl sm:text-4xl"
						}`}>
							{game.nameBel}
						</h2>

						<p className={`text-ink-muted leading-relaxed mb-12 max-w-[45ch] font-display italic ${
							featured ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
						}`}>
							{game.description}
						</p>
					</div>

					<div className={`mt-auto ${featured ? "lg:mt-0 lg:w-72 lg:shrink-0" : ""}`}>
						<div className="mb-8 flex items-center justify-between">
							<div className="flex flex-col">
								<span className="text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-1.5 font-bold">
									{hasPlayedToday ? "Ваш вынік" : "Даступны статус"}
								</span>
								<span className="font-display text-lg font-semibold text-ink">
									{progressText || "Чакае вас"}
								</span>
							</div>
							{isCompleted && (
								<span className={`w-3 h-3 rounded-full ${accentBg} shadow-[0_0_12px_rgba(0,0,0,0.1)] ${accentBg === "bg-valoshka" ? "shadow-valoshka/30" : "shadow-pobach/30"}`} />
							)}
						</div>

						<span
							className={`flex items-center justify-center w-full px-8 py-4 rounded-2xl text-sm font-bold tracking-widest uppercase transition-all duration-300 border-2 ${
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
