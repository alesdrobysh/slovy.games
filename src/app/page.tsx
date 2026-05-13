"use client";

import Link from "next/link";
import { GameCard } from "@/shared/components/GameCard";
import { useHubState } from "@/shared/hooks/useHubState";
import { GAMES } from "@/shared/types";

const MONTHS = [
	"студзеня", "лютага", "сакавіка", "красавіка",
	"траўня", "чэрвеня", "ліпеня", "жніўня",
	"верасня", "кастрычніка", "лістапада", "снежня",
];

const WEEKDAYS = ["нд", "пн", "аў", "ср", "чц", "пт", "сб"];

function formatToday(): string {
	const now = new Date();
	return `${WEEKDAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]}`;
}

export default function HubPage() {
	const hub = useHubState(GAMES);
	const games = GAMES.filter((g) => g.enabled);

	return (
		<div className="page-container page-section">
			{/* Date header */}
			<div className="mb-8 animate-fade-in-up">
				<p className="text-sm text-ink-muted">
					Сённяшнія гульні · {formatToday()}
				</p>
			</div>

			{/* Game cards */}
			<section
				aria-label="Сённяшнія гульні"
				className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10"
			>
				{games.map((game, i) => {
					const status = hub.statuses.get(game.id);
					return (
						<GameCard
							key={game.id}
							game={game}
							hasPlayedToday={status?.hasPlayedToday ?? false}
							progressText={status?.progressText}
							ctaLabel={status?.ctaLabel}
							delay={i * 100}
						/>
					);
				})}
				{games.length === 0 && (
					<p className="text-center text-sm text-ink-muted col-span-2">
						Хутка тут з&rsquo;явяцца новыя гульні.
					</p>
				)}
			</section>

			{/* Stats link */}
			<div className="mt-12 pt-8 border-t border-rule animate-fade-in-up">
				<Link
					href="/stats"
					className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-ink-muted hover:text-ink transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm"
				>
					Статыстыка
					<span className="transition-transform group-hover:translate-x-0.5">
						→
					</span>
				</Link>
			</div>
		</div>
	);
}
