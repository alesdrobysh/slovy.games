"use client";

import { useEffect, useRef } from "react";
import { buildArticleBlocks } from "../lib/articleStructure";
import type { ArticleToken } from "../types";

interface RedactedTextProps {
	tokens: ArticleToken[];
	titleTokens: ArticleToken[];
	foundLemmas: ReadonlySet<string>;
	highlighted?: string | null;
}

export function RedactedText({
	tokens,
	titleTokens,
	foundLemmas,
	highlighted,
}: RedactedTextProps) {
	const containerRef = useRef<HTMLDivElement>(null);

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
	const renderTokens = (blockTokens: ArticleToken[], forceVisible = false) =>
		blockTokens.map((token, index) => {
			const key = `${token.type}-${index}-${token.text}`;
			if (token.type === "sep") return <span key={key}>{token.text}</span>;
			if (forceVisible || isVisible(token)) {
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
		});
	const blocks = buildArticleBlocks(tokens);

	return (
		<div className="font-display text-ink leading-relaxed text-base sm:text-lg">
			{titleTokens.length > 0 && (
				<header
					className="sticky top-16 z-20 -mx-inset-md sm:-mx-inset-lg -mt-inset-md sm:-mt-inset-lg mb-flow-lg px-inset-md sm:px-inset-lg py-flow-md bg-card/95 backdrop-blur-sm border-b border-rule"
					aria-label="Зашыфраваная назва артыкула"
				>
					<p className="text-ink-soft text-xs uppercase tracking-widest mb-flow-xs">
						Зашыфраваны артыкул
					</p>
					<h1 className="text-2xl sm:text-3xl font-bold leading-tight flex flex-wrap items-baseline gap-x-2 gap-y-1">
						{titleTokens.map((token, i) => {
							const key = `title-${token.type}-${i}-${token.text}`;
							if (token.type === "sep") return null;
							if (isVisible(token)) return <span key={key}>{token.text}</span>;
							return (
								<span
									key={key}
									role="img"
									aria-label={`${token.text.length} схаваных літар`}
									className="inline-flex items-baseline gap-1"
								>
									<span
										aria-hidden="true"
										className="inline-block align-baseline bg-ink/85 rounded-sm h-[0.8em]"
										style={{ width: `${token.text.length * 0.6}em` }}
									/>
									<span aria-hidden="true" className="text-xs font-normal text-ink-muted">
										{token.text.length}
									</span>
								</span>
							);
						})}
					</h1>
				</header>
			)}
			<div
				ref={containerRef}
				className="break-words hyphens-auto space-y-flow-md"
			>
				{blocks.map((block, index) => {
					if (block.kind === "heading") {
						const Heading = block.level === 2 ? "h2" : "h3";
						return (
							<Heading
								key={`heading-${index}`}
								className="font-semibold text-ink mt-flow-lg"
							>
								{renderTokens(block.tokens, true)}
							</Heading>
						);
					}
					if (block.kind === "list") {
						return (
							<ul
								key={`list-${index}`}
								className="list-disc pl-inset-lg space-y-flow-xs"
							>
								{block.items.map((item, itemIndex) => (
									<li key={`item-${itemIndex}`}>{renderTokens(item)}</li>
								))}
							</ul>
						);
					}
					return <p key={`paragraph-${index}`}>{renderTokens(block.tokens)}</p>;
				})}
			</div>
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
