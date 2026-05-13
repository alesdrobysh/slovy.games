"use client";

import Link from "next/link";
import type { GameInfo } from "@/shared/types";

interface GameCardProps {
	game: GameInfo;
	hasPlayedToday: boolean;
	progressText?: string;
	ctaLabel?: string;
	delay?: number;
}

export function GameCard({
	game,
	hasPlayedToday,
	progressText,
	ctaLabel = "Гуляць",
	delay = 0,
}: GameCardProps) {
	const isCompleted = ctaLabel === "Вынік";
	const isPobach = game.id === "pobach";
	const accentBg = isPobach ? "bg-pobach" : "bg-valoshka";
	const accentText = isPobach ? "text-pobach" : "text-valoshka";
	const accentSoft = isPobach ? "bg-pobach-soft" : "bg-valoshka-soft";

	return (
		<Link
			href={game.path}
			className="group relative flex flex-col bg-card ring-1 ring-rule rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:ring-ink/20 animate-fade-in-up no-underline"
			style={{ animationDelay: `${delay}ms` }}
		>
			<div className={`h-1.5 ${accentBg}`} aria-hidden />

			<div className="p-8 sm:p-10 flex flex-col flex-1">
				<div className="flex items-start justify-between gap-4 mb-6">
					<div>
						<h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-ink">
							{game.nameBel}
						</h2>
						<p
							className={`text-xs uppercase tracking-[0.2em] mt-2 ${accentText} font-semibold`}
						>
							{game.descriptionBel}
						</p>
					</div>
					{isCompleted && (
						<span
							className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold ${accentSoft} ${accentText}`}
						>
							Скончана
						</span>
					)}
				</div>

				<p className="text-base text-ink-muted leading-relaxed mb-10 max-w-[42ch]">
					{game.description}
				</p>

				<div className="mt-auto pt-6 border-t border-rule flex items-end justify-between gap-4">
					<div className="flex flex-col min-w-0">
						<span className="text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-1.5 font-medium">
							{hasPlayedToday ? "Сёння" : "Статус"}
						</span>
						<span className="font-display text-base sm:text-lg font-medium text-ink truncate">
							{progressText || "Чакае вас"}
						</span>
					</div>
					<span
						className={`shrink-0 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
							isCompleted
								? "bg-secondary text-ink"
								: `${isPobach ? "bg-pobach" : "bg-valoshka"} text-white hover:brightness-105`
						}`}
					>
						{ctaLabel}
					</span>
				</div>
			</div>
		</Link>
	);
}
