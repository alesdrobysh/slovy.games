"use client";

import Link from "next/link";
import posthog from "posthog-js";

interface TryOtherGamesLinkProps {
	className?: string;
	fromGame: string;
}

export function TryOtherGamesLink({ className = "", fromGame }: TryOtherGamesLinkProps) {
	return (
		<Link
			href="/"
			onClick={() => posthog.capture("try_other_games_clicked", { from_game: fromGame })}
			className={`text-sm underline underline-offset-4 transition-colors hover:opacity-80 ${className}`}
		>
			Паспрабуйце іншыя гульні →
		</Link>
	);
}
