"use client";

import Link from "next/link";
import type { GameInfo } from "@/shared/types";

interface GameCardProps {
	game: GameInfo;
	hasPlayedToday: boolean;
}

export function GameCard({ game, hasPlayedToday }: GameCardProps) {
	return (
		<Link
			href={game.path}
			className="group relative block no-underline rounded-2xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
			style={{
				background: "var(--color-bg-card)",
				borderColor: "var(--color-border)",
			}}
		>
			<div className="p-6 sm:p-8">
				<div className="flex items-start justify-between mb-4">
					<div
						className="flex items-center justify-center rounded-xl"
						style={{
							width: "48px",
							height: "48px",
							background: `${game.color}18`,
							fontSize: "24px",
						}}
					>
						{game.icon}
					</div>
					{hasPlayedToday && (
						<span
							className="text-xs font-bold uppercase tracking-wider rounded-full px-2.5 py-1"
							style={{
								background: "var(--color-accent-subtle)",
								color: "var(--color-accent)",
								border: "1px solid var(--color-accent-border)",
							}}
						>
							✓ Сёння
						</span>
					)}
				</div>

				<h2
					className="text-2xl font-bold mb-2"
					style={{
						fontFamily: "var(--font-display)",
						color: game.color,
					}}
				>
					{game.nameBel}
				</h2>
				<p
					className="text-sm leading-relaxed"
					style={{
						color: "var(--color-text-muted)",
						fontFamily: "var(--font-sans)",
					}}
				>
					{game.descriptionBel}
				</p>

				<div className="mt-6">
					<span
						className="inline-flex items-center gap-1 text-sm font-semibold rounded-full px-4 py-2 transition-colors"
						style={{
							background: game.color,
							color: "#fff",
						}}
					>
						Гуляць
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Гуляць</title>
							<line x1="5" y1="12" x2="19" y2="12" />
							<polyline points="12 5 19 12 12 19" />
						</svg>
					</span>
				</div>
			</div>
		</Link>
	);
}
