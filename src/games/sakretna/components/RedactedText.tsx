"use client";

import { useEffect, useRef } from "react";
import type { ArticleToken } from "../types";

interface RedactedTextProps {
	tokens: ArticleToken[];
	foundLemmas: ReadonlySet<string>;
	highlighted?: string | null;
	revealTitle?: boolean;
	title?: string;
}

export function RedactedText({
	tokens,
	foundLemmas,
	highlighted,
	revealTitle,
	title,
}: RedactedTextProps) {
	const containerRef = useRef<HTMLParagraphElement>(null);

	// When highlighted changes, scroll to the first matching highlighted span
	useEffect(() => {
		if (!highlighted || !containerRef.current) return;
		const el = containerRef.current.querySelector(".bg-sakretna");
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}, [highlighted]);

	const isVisible = (token: ArticleToken) =>
		token.isFree || foundLemmas.has(token.lemma ?? "");

	return (
		<div className="font-display text-ink leading-relaxed text-base sm:text-lg">
			{revealTitle && title && (
				<p className="mb-flow-md">
					<span className="text-ink-soft text-xs sm:text-sm uppercase tracking-widest">
						Артыкул:{" "}
					</span>
					<strong className="text-sakretna">{title}</strong>
				</p>
			)}
			<p ref={containerRef} className="break-words hyphens-auto">
				{tokens.map((token, i) => {
					const key = `${token.type}-${i}-${token.text}`;
					if (token.type === "sep") {
						return <span key={key}>{token.text}</span>;
					}
					if (isVisible(token)) {
						const isHighlighted = token.lemma === highlighted;
						return (
							<span
								key={key}
								className={
									isHighlighted
										? "bg-sakretna text-paper px-0.5 rounded-sm"
										: "text-ink"
								}
							>
								{token.text}
							</span>
						);
					}
					return (
						<span
							key={key}
							aria-hidden="true"
							className="inline-flex align-baseline bg-ink/85 rounded-sm"
							style={{
								width: `${token.text.length * 0.6}em`,
								height: "0.9em",
								marginLeft: "0.1em",
								marginRight: "0.1em",
							}}
						/>
					);
				})}
			</p>
		</div>
	);
}

export function ProgressLine({
	foundLemmas,
	totalLemmas,
}: {
	foundLemmas: number;
	totalLemmas: number;
}) {
	return (
		<p className="text-ink-muted text-sm">
			Расшыфравана {foundLemmas} з {totalLemmas} слоў
		</p>
	);
}
