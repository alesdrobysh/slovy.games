"use client";

import { GameCard } from "@/shared/components/GameCard";
import { Nav } from "@/shared/components/Nav";
import { Typography } from "@/shared/components/ui/Typography";
import { useHubState } from "@/shared/hooks/useHubState";
import { wrappedYearFor } from "@/shared/lib/wrapped/window";
import { GAMES } from "@/shared/types";

interface HubPageClientProps {
	sakretnaUnlocked: boolean;
	wrappedVisible: boolean;
}

export function HubPageClient({
	sakretnaUnlocked,
	wrappedVisible,
}: HubPageClientProps) {
	const hub = useHubState(GAMES);
	const games = GAMES.filter(
		(g) => g.enabled && (g.id !== "sakretna" || sakretnaUnlocked)
	);

	return (
		<>
			<Nav />
			<div className="page-container page-section relative">
				{/* Editorial Header */}
				<div className="mb-section-gap animate-fade-in-up">
					<div className="max-w-3xl flex flex-col">
						<Typography variant="titleHero" as="h1">
							Штодзённыя беларускія слоўныя галаваломкі
						</Typography>
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

				{wrappedVisible && (
					<section aria-label="Год у Словах" className="mt-section-gap">
						<a
							href="/wrapped"
							className="flex flex-col gap-flow-xs rounded-2xl p-inset-lg bg-card ring-1 ring-rule hover:ring-rule-strong"
						>
							<Typography variant="overline" className="text-ink-muted">
								Год у Словах
							</Typography>
							<Typography variant="heading">Твой {wrappedYearFor()}</Typography>
							<Typography variant="caption" className="text-ink-muted">
								Паглядзі, як ты гуляў цэлы год
							</Typography>
						</a>
					</section>
				)}

				{/* Editorial SEO block */}
				<section className="mt-section-gap page-narrow flex flex-col gap-section-gap">
					<div className="flex flex-col gap-flow-lg">
						<Typography variant="heading" as="h2">
							Беларускія гульні ў словы анлайн
						</Typography>
						<Typography variant="body" as="p">
							«Словы» — бясплатныя штодзённыя слоўныя гульні па-беларуску. Тут
							можна адгадваць словы паводле сэнсу ў «Побач» і складаць словы з
							літар у «Валошцы». Новыя заданні з'яўляюцца кожны дзень.
							Рэгістрацыя не патрэбная.
						</Typography>
					</div>
					<div className="flex flex-col gap-flow-lg">
						<Typography variant="subheading" as="h3">
							Якія беларускія слоўныя гульні тут ёсць?
						</Typography>
						<Typography variant="body" as="p">
							«Побач» — адгадайце схаванае слова па сэнсавай блізкасці.
							«Валошка» — складзіце як мага больш слоў з літар.
						</Typography>
					</div>
					<div className="flex flex-col gap-flow-lg">
						<Typography variant="subheading" as="h3">
							Ці можна гуляць бясплатна?
						</Typography>
						<Typography variant="body" as="p">
							Так, усе гульні цалкам бясплатныя. Рэгістрацыя і ўсталёўка
							дадатковых праграм не патрэбныя — гуляйце адразу ў браўзеры.
						</Typography>
					</div>
					<div className="flex flex-col gap-flow-lg">
						<Typography variant="subheading" as="h3">
							Калі з'яўляецца новае заданне?
						</Typography>
						<Typography variant="body" as="p">
							Новыя заданні з'яўляюцца кожны дзень, таму вы можаце вяртацца
							штодня і атрымліваць свежую галаваломку.
						</Typography>
					</div>
				</section>
			</div>
		</>
	);
}
