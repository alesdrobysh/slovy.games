"use client";

import { pluralize } from "@/shared/lib/pluralize";

interface GuessListProps {
	guesses: string[];
}

export function GuessList({ guesses }: GuessListProps) {
	if (guesses.length === 0) return null;
	const recent = [...guesses].reverse().slice(0, 30);
	return (
		<div className="w-full">
			<p className="text-ink-soft uppercase tracking-widest text-[10px] font-medium mb-flow-xs">
				Спроб ({guesses.length} {pluralize(guesses.length, "спроба")})
			</p>
			<div className="flex flex-wrap gap-1.5">
				{recent.map((g) => (
					<span
						key={g}
						className="rounded-full bg-secondary text-ink-muted px-flow-sm py-0.5 text-xs font-sans"
					>
						{g}
					</span>
				))}
			</div>
		</div>
	);
}
