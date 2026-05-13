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
						<span className="hidden sm:block w-px h-6 bg-rule" />
						<p className="text-sm uppercase tracking-[0.2em] font-bold text-success flex items-center gap-2">
							<span className="w-2 h-2 rounded-full bg-current animate-pulse" />
							Даступна зараз
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
					const isFirst = i === 0;
					return (
						<div
							key={game.id}
							className={`${
								isFirst
									? "lg:col-span-8 lg:aspect-[16/9]"
									: "lg:col-span-4 lg:mt-24"
							}`}
						>
							<GameCard
								game={game}
								hasPlayedToday={status?.hasPlayedToday ?? false}
								progressText={status?.progressText}
								ctaLabel={status?.ctaLabel}
								delay={i * 150}
								featured={isFirst}
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

			{/* Secondary Actions / Footer-ish */}
			<div className="mt-32 pt-12 border-t-2 border-ink/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 animate-fade-in-up">
				<Link
					href="/stats"
					className="group flex items-center gap-4 no-underline"
				>
					<div className="w-12 h-12 rounded-full border border-rule flex items-center justify-center group-hover:bg-ink group-hover:text-paper transition-all">
						<span className="text-lg">📈</span>
					</div>
					<div>
						<span className="block text-xs uppercase tracking-[0.2em] font-bold text-ink-soft mb-0.5">
							Ваш прагрэс
						</span>
						<span className="block text-lg font-display font-semibold text-ink group-hover:translate-x-1 transition-transform">
							Агульная статыстыка →
						</span>
					</div>
				</Link>

				<div className="hidden lg:block text-right">
					<p className="text-[10px] uppercase tracking-[0.3em] font-bold text-ink-soft mb-2">
						Беларуская мова · Культура · Розум
					</p>
					<p className="text-sm text-ink-muted italic font-display">
						Створана з любоўю да кожнага слова.
					</p>
				</div>
			</div>
		</div>
	);
}
