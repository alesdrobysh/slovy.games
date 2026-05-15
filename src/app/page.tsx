"use client";

import { GameCard } from "@/shared/components/GameCard";
import { Nav } from "@/shared/components/Nav";
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
		<>
		<Nav />
		<div className="page-container page-section relative">
			{/* Editorial Header */}
			<div className="mb-16 sm:mb-24 animate-fade-in-up">
				<div className="max-w-3xl">
					<h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight text-ink mb-6">
						Штодзённыя інтэлектуальныя гульні
					</h1>
					<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
						<p className="text-xl text-ink-muted italic font-display">
							{formatToday()}
						</p>
					</div>
				</div>
			</div>

			{/* Staggered Game Grid */}
			<section
				aria-label="Сённяшнія гульні"
				className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-20"
			>
				{games.map((game, i) => {
					const status = hub.statuses.get(game.id);
					return (
						<div key={game.id} className="lg:col-span-6">
							<GameCard
								game={game}
								status={status?.status ?? "not_started"}
								progressText={status?.progressText}
								delay={i * 150}
							/>
						</div>
					);
				})}
				{games.length === 0 && (
					<div className="col-span-12 py-20 text-center border-2 border-dashed border-rule rounded-3xl">
						<p className="text-xl font-display italic text-ink-muted">
							Новыя выклікі рыхтуюцца для вас...
						</p>
					</div>
				)}
			</section>
		</div>
		</>
	);
}
