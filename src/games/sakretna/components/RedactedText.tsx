"use client";

import { useEffect, useRef } from "react";
import { scrollIntoVisualViewport } from "@/shared/lib/scrollIntoVisualViewport";
import { buildArticleBlocks } from "../lib/articleStructure";
import type { ArticleToken } from "../types";

interface RedactedTextProps {
	tokens: ArticleToken[];
	titleTokens: ArticleToken[];
	foundLemmas: ReadonlySet<string>;
	highlighted?: string | null;
	stickyTitle?: boolean;
	autoScroll?: boolean;
	showLetterCounts?: boolean;
}

export function RedactedText({
	tokens,
	titleTokens,
	foundLemmas,
	highlighted,
	stickyTitle = true,
	autoScroll = true,
	showLetterCounts = true,
}: RedactedTextProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	// When highlighted changes, scroll to the first matching highlighted span
	useEffect(() => {
		if (!autoScroll || !highlighted || !containerRef.current) return;
		const el = containerRef.current.querySelector(".bg-sakretna");
		if (el) scrollIntoVisualViewport(el);
	}, [autoScroll, highlighted]);

	const isVisible = (token: ArticleToken) =>
		token.isFree || foundLemmas.has(token.lemma ?? "");
	const renderTokens = (blockTokens: ArticleToken[]) =>
		blockTokens.map((token, index) => {
			const key = `${token.type}-${index}-${token.text}`;
			if (token.type === "sep") return <span key={key}>{token.text}</span>;
			if (isVisible(token)) {
				const isHighlighted = token.lemma === highlighted;
				return (
					<span
						key={key}
						data-sakretna-lemma={token.lemma || undefined}
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
					className="inline-flex items-baseline gap-0.5 mx-[0.1em]"
				>
					<span
						className="inline-block bg-ink/85 rounded-sm h-[0.9em]"
						style={{ width: `${token.text.length * 0.6}em` }}
					/>
					{showLetterCounts && (
						<span className="text-[0.65em] text-ink-muted">
							{token.text.length}
						</span>
					)}
				</span>
			);
		});
	const blocks = buildArticleBlocks(tokens);

	return (
		<div
			id="sakretna-article-top"
			className="font-display text-ink leading-relaxed text-base sm:text-lg scroll-mt-20"
		>
			{titleTokens.length > 0 && (
				<header
					className={`${stickyTitle ? "sticky top-16 max-md:short:top-0 z-20" : ""} -mx-inset-md sm:-mx-inset-lg -mt-inset-md sm:-mt-inset-lg mb-flow-lg px-inset-md sm:px-inset-lg py-flow-md max-md:short:py-flow-sm bg-card/95 backdrop-blur-sm border-b border-rule`}
				>
					<p className="text-ink-muted text-xs uppercase tracking-widest mb-flow-xs max-md:short:hidden">
						Зашыфраваны артыкул
					</p>
					<h1 className="text-2xl sm:text-3xl max-md:short:text-lg font-bold leading-tight flex flex-wrap items-baseline gap-x-2 gap-y-1">
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
									{showLetterCounts && (
										<span
											aria-hidden="true"
											className="text-xs font-normal text-ink-muted"
										>
											{token.text.length}
										</span>
									)}
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
				{blocks.map((block) => {
					const blockKey =
						block.kind === "list"
							? block.items
									.flat()
									.map((token) => token.text)
									.join("")
							: block.tokens.map((token) => token.text).join("");
					if (block.kind === "heading") {
						const Heading = block.level === 2 ? "h2" : "h3";
						return (
							<Heading
								key={`heading-${blockKey}`}
								className="font-semibold text-ink mt-flow-lg"
							>
								{renderTokens(block.tokens)}
							</Heading>
						);
					}
					if (block.kind === "list") {
						return (
							<ul
								key={`list-${blockKey}`}
								className="list-disc pl-inset-lg space-y-flow-xs"
							>
								{block.items.map((item) => (
									<li key={item.map((token) => token.text).join("")}>
										{renderTokens(item)}
									</li>
								))}
							</ul>
						);
					}
					return (
						<p key={`paragraph-${blockKey}`}>{renderTokens(block.tokens)}</p>
					);
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
