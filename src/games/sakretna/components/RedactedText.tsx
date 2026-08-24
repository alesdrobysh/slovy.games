"use client";

import { useEffect, useRef, useState } from "react";
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
	const [peeked, setPeeked] = useState<ReadonlySet<number>>(new Set());

	// When highlighted changes, scroll to the first matching highlighted span
	useEffect(() => {
		if (!highlighted || !containerRef.current) return;
		const el = containerRef.current.querySelector(".bg-sakretna");
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}, [highlighted]);
	const togglePeek = (index: number) => {
		setPeeked((prev) => {
			const next = new Set(prev);
			if (next.has(index)) next.delete(index);
			else next.add(index);
			return next;
		});
	};

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
					if (token.isFree || foundLemmas.has(token.lemma ?? "")) {
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
					const isPeeked = peeked.has(i);
					return (
						<button
							key={key}
							type="button"
							aria-label={
								isPeeked
									? `Схавана, ${token.text.length} літар`
									: `${token.text.length} схаваных літар, паказаць колькасць`
							}
							onClick={() => togglePeek(i)}
							className="relative appearance-none border-0 p-0 inline-flex items-center justify-center align-baseline bg-ink/85 rounded-sm cursor-pointer text-paper text-[0.6em] leading-none font-sans after:absolute after:size-(--control-min-height) after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2"
							style={{
								width: `${token.text.length * 0.6}em`,
								height: "0.9em",
								marginLeft: "0.1em",
								marginRight: "0.1em",
							}}
						>
							{isPeeked ? token.text.length : ""}
						</button>
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
