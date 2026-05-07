"use client";

import type { HintState } from "@/games/valoshka/types";

interface HintDisplayProps {
	hint: HintState;
	onCancel: () => void;
}

export function HintDisplay({ hint, onCancel }: HintDisplayProps) {
	if (!hint.targetWord || !hint.isActive) return null;

	const word = hint.targetWord;
	const length = word.length;

	const chars = word.split("").map((char, idx) => ({
		char: char.toUpperCase(),
		revealed: hint.revealedIndices.includes(idx),
		isLast: idx === word.length - 1,
	}));

	return (
		<div
			className="flex items-center gap-2 px-3 py-1.5 w-full max-w-sm"
			style={{
				background: "var(--hint-bg, rgba(91, 111, 168, 0.06))",
				border: "1px solid var(--cornflower-border-subtle)",
				borderRadius: "10px",
			}}
		>
			<div className="flex items-baseline gap-1.5 min-w-0 flex-1">
				<div className="flex items-baseline gap-[2px]">
					{chars.map((c, idx) =>
						c.revealed || c.isLast ? (
							<span
								key={`${idx}-${c.char}`}
								className="font-serif text-sm font-semibold"
								style={{ color: "var(--text)", letterSpacing: "0.03em" }}
							>
								{c.char}
							</span>
						) : (
							<span
								key={`${idx}-blank`}
								className="inline-block"
								style={{
									width: "8px",
									height: "1px",
									background: "var(--text-muted)",
									opacity: 0.4,
									borderRadius: "1px",
									marginBottom: "3px",
									marginInline: "1px",
								}}
							/>
						)
					)}
				</div>
				<span
					style={{
						color: "var(--text-muted)",
						opacity: 0.55,
						fontSize: "9px",
						letterSpacing: "0.06em",
						textTransform: "uppercase",
					}}
				>
					{length}л
				</span>
			</div>

			<div className="flex gap-1 shrink-0">
				<button
					type="button"
					onClick={onCancel}
					title="скасаваць"
					className="flex items-center justify-center transition-all"
					style={{
						width: "24px",
						height: "24px",
						borderRadius: "50%",
						background: "transparent",
						border: "1px solid var(--border)",
						color: "var(--text-muted)",
						cursor: "pointer",
						opacity: 0.6,
					}}
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={1.75}
						strokeLinecap="round"
						strokeLinejoin="round"
						style={{ width: "10px", height: "10px" }}
					>
						<title>скасаваць</title>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			</div>
		</div>
	);
}
