"use client";

import { GameCard } from "@/shared/components/GameCard";
import { Footer } from "@/shared/components/Footer";
import { GAMES } from "@/shared/types";

export default function HubPage() {
	return (
		<div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
			<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-16">
				<div className="mb-8 sm:mb-12 text-center">
					<h1
						className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight"
						style={{
							fontFamily: "var(--font-display)",
							color: "var(--color-accent)",
						}}
					>
						Словы
					</h1>
					<p
						className="text-sm sm:text-base max-w-md mx-auto"
						style={{
							color: "var(--color-text-muted)",
							fontFamily: "var(--font-sans)",
						}}
					>
						Штодзённыя беларускія слоўныя гульні. Выберыце гульню і пачніце.
					</p>
				</div>

				<div className="grid gap-4 sm:gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
					{GAMES.filter((g) => g.enabled).map((game) => (
						<GameCard key={game.id} game={game} hasPlayedToday={false} />
					))}
				</div>
			</div>
			<Footer />
		</div>
	);
}
