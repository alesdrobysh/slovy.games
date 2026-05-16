"use client";

import { GameCard } from "@/shared/components/GameCard";
import { Nav } from "@/shared/components/Nav";
import { Typography } from "@/shared/components/ui/Typography";
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
				<div className="mb-section-gap animate-fade-in-up">
					<div className="max-w-3xl flex flex-col">
						<Typography variant="titleHero" as="h1">
							Штодзённыя інтэлектуальныя гульні
						</Typography>
						<div className="flex flex-wrap items-center gap-x-inset-lg gap-y-flow-md">
							<Typography variant="caption" className="text-ink-muted">
								{formatToday()}
							</Typography>
						</div>
					</div>
				</div>

				{/* Staggered Game Grid */}
				<section
					aria-label="Сённяшнія гульні"
					className="grid grid-cols-1 lg:grid-cols-12 gap-section-gap"
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
						<div className="col-span-12 py-page-py text-center border-2 border-dashed border-rule rounded-3xl">
							<Typography variant="caption" className="text-ink-muted">
								Новыя выклікі рыхтуюцца для вас...
							</Typography>
						</div>
					)}
				</section>
			</div>
		</>
	);
}
