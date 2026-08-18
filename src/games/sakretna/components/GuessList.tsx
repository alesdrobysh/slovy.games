"use client";

import { pluralize } from "@/shared/lib/pluralize";

interface GuessListProps {
	guesses: string[];
	highlighted?: string | null;
	onSelect?: (lemma: string) => void;
}

export function GuessList({ guesses, highlighted, onSelect }: GuessListProps) {
	if (guesses.length === 0) return null;
	const recent = [...guesses].reverse().slice(0, 30);
	const occurrences = new Map<string, number>();
	return (
		<div className="w-full">
			<p className="text-ink-soft uppercase tracking-widest text-[10px] font-medium mb-flow-xs">
				Спроб ({guesses.length} {pluralize(guesses.length, "спроба")})
			</p>
			<div className="flex flex-wrap gap-1.5">
				{recent.map((g) => {
					const occurrence = occurrences.get(g) ?? 0;
					occurrences.set(g, occurrence + 1);
					const isActive = g === highlighted;
					return (
						<button
							type="button"
							key={`${g}-${occurrence}`}
							onClick={() => onSelect?.(g)}
							className={
								isActive
									? "rounded-full bg-sakretna text-paper px-flow-sm py-0.5 text-xs font-sans cursor-pointer"
									: "rounded-full bg-secondary text-ink-muted px-flow-sm py-0.5 text-xs font-sans cursor-pointer hover:bg-secondary/80"
							}
						>
							{g}
						</button>
					);
				})}
			</div>
		</div>
	);
}
