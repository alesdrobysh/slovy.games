"use client";

import { GameCard } from "@/shared/components/GameCard";
import { Footer } from "@/shared/components/Footer";
import { useHubState } from "@/shared/hooks/useHubState";
import { GAMES } from "@/shared/types";

function dayOrdinal(n: number): string {
	if (n === 1) return "дзень";
	if (n >= 2 && n <= 4) return "дні";
	return "дзён";
}

export default function HubPage() {
	const hub = useHubState(GAMES);
	const games = GAMES.filter((g) => g.enabled);

	return (
		<div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
			<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-16">
				{/* ── Hero: date + streak ── */}
				<div className="mb-8 sm:mb-12 text-center">
					{hub.todayLabel && (
						<p
							className="text-xs sm:text-sm font-semibold tracking-wider uppercase mb-4"
							style={{
								color: "var(--color-text-muted)",
								fontFamily: "var(--font-sans)",
							}}
						>
							{hub.todayLabel}
						</p>
					)}

					<h1
						className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight"
						style={{
							fontFamily: "var(--font-display)",
							color: "var(--color-accent)",
						}}
					>
						Словы
					</h1>

					<p
						className="text-sm sm:text-base max-w-md mx-auto mb-4"
						style={{
							color: "var(--color-text-muted)",
							fontFamily: "var(--font-sans)",
						}}
					>
						Штодзённыя беларускія слоўныя гульні
					</p>

					{/* Streak + total badge */}
					{hub.totalPlayed > 0 && (
						<div
							className="inline-flex items-center gap-3 text-xs sm:text-sm rounded-full px-4 py-1.5"
							style={{
								background: "var(--color-bg-surface)",
								color: "var(--color-text-muted)",
								fontFamily: "var(--font-sans)",
							}}
						>
							{hub.currentStreak > 0 ? (
								<>
									<span
										style={{
											color: "var(--color-accent)",
											fontWeight: 700,
										}}
									>
										🔥 {hub.currentStreak}{" "}
										{dayOrdinal(hub.currentStreak)}
									</span>
									<span>·</span>
								</>
							) : null}
							<span>
								{hub.totalPlayed}{" "}
								{hub.totalPlayed === 1
									? "гульня згуляна"
									: `${hub.totalPlayed} гульні згуляна`}
							</span>
						</div>
					)}
				</div>

				{/* ── Game cards ── */}
				<div className="grid gap-4 sm:gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
					{games.map((game) => {
						const status = hub.statuses.get(game.id);
						return (
							<GameCard
								key={game.id}
								game={game}
								hasPlayedToday={status?.hasPlayedToday ?? false}
								progressText={status?.progressText}
								ctaLabel={status?.ctaLabel}
							/>
						);
					})}
					{games.length === 0 && (
						<p
							className="text-center text-sm"
							style={{ color: "var(--color-text-muted)" }}
						>
							Хутка тут з’явяцца новыя гульні.
						</p>
					)}
				</div>
			</div>
			<Footer />
		</div>
	);
}
