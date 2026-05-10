"use client";

import Link from "next/link";
import type { GameInfo } from "@/shared/types";

interface GameCardProps {
	game: GameInfo;
	hasPlayedToday: boolean;
	/** Optional progress line shown below description, e.g. "12 слоў знойдзена" */
	progressText?: string;
	/** Custom CTA label, defaults to "Гуляць" */
	ctaLabel?: string;
}

export function GameCard({
	game,
	hasPlayedToday,
	progressText,
	ctaLabel = "Гуляць",
}: GameCardProps) {
	const isCompleted = ctaLabel === "Вынік";

	return (
		<Link
			href={game.path}
			className="group relative block no-underline rounded-2xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
			style={{
				background: "var(--sly-bg-card)",
				borderColor: "var(--sly-border)",
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
								background: "var(--sly-accent-subtle)",
								color: "var(--sly-accent)",
								border: "1px solid var(--sly-accent-border)",
							}}
						>
							✓ Сёння
						</span>
					)}
				</div>

				<h2
					className="text-2xl font-bold mb-2"
					style={{
						fontFamily: "var(--sly-font-display)",
						color: game.color,
					}}
				>
					{game.nameBel}
				</h2>
				<p
					className="text-sm leading-relaxed"
					style={{
						color: "var(--sly-text-muted)",
						fontFamily: "var(--sly-font-sans)",
					}}
				>
					{game.descriptionBel}
				</p>

				{progressText && (
					<div
						className="mt-3 text-sm font-medium"
						style={{ color: "var(--sly-text-muted)" }}
					>
						{progressText}
					</div>
				)}

				<div className="mt-6">
					<span
						className="inline-flex items-center gap-1 text-sm font-semibold rounded-full px-4 py-2 transition-colors"
						style={{
							background: isCompleted ? "var(--sly-bg-surface)" : game.color,
							color: isCompleted ? "var(--sly-text)" : "#fff",
						}}
					>
						{ctaLabel}
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<line x1="5" y1="12" x2="19" y2="12" />
							<polyline points="12 5 19 12 12 19" />
						</svg>
					</span>
				</div>
			</div>
		</Link>
	);
}
