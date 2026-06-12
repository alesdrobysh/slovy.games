"use client";

import { Typography } from "@/shared/components/ui/Typography";
import type { HintState } from "@/games/valoshka/types";

interface HintDisplayProps {
	hint: HintState;
}

export function HintDisplay({ hint }: HintDisplayProps) {
	if (!hint.targetWord || !hint.isActive) return null;

	const word = hint.targetWord;
	const length = word.length;

	const chars = word.split("").map((char, idx) => ({
		char: char.toUpperCase(),
		revealed: hint.revealedIndices.includes(idx),
		isLast: idx === word.length - 1,
	}));

	const letterLabel = length === 1 ? "літара" : length < 5 ? "літары" : "літар";

	return (
		<div
			className="flex items-center gap-flow-sm px-inset-sm py-flow-xs w-full max-w-sm"
			style={{
				background: "var(--valoshka-dim)",
				border: "1px solid var(--accent-border)",
				borderRadius: "10px",
			}}
		>
			<div className="flex items-baseline gap-flow-sm min-w-0 flex-1">
				<Typography
					variant="smallSerif"
					as="span"
					className="tracking-[0.2em]"
				>
					{chars.map((c, idx) =>
						c.revealed || c.isLast ? (
							<span key={`${idx}-${c.char}`}>{c.char}</span>
						) : (
							<span key={`${idx}-blank`}>_</span>
						)
					)}
				</Typography>
				<Typography variant="overline" as="span" className="text-(--muted)">
					{length} {letterLabel}
				</Typography>
			</div>
		</div>
	);
}
