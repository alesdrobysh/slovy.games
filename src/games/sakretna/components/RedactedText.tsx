"use client";

import { useState } from "react";
import { pluralize } from "@/shared/lib/pluralize";
import type { ArticleToken } from "../types";

interface RedactedTextProps {
	tokens: ArticleToken[];
	foundLemmas: ReadonlySet<string>;
	revealTitle?: boolean;
	title?: string;
}

export function RedactedText({
	tokens,
	foundLemmas,
	revealTitle,
	title,
}: RedactedTextProps) {
	const [peeked, setPeeked] = useState<ReadonlySet<number>>(new Set());
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
			<p className="break-words hyphens-auto">
				{tokens.map((token, i) => {
					const key = `${token.type}-${i}-${token.text}`;
					if (token.type === "sep") {
						return <span key={key}>{token.text}</span>;
					}
					if (token.isFree || foundLemmas.has(token.lemma ?? "")) {
						return (
							<span key={key} className="text-ink">
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
							className="appearance-none border-0 p-0 inline-flex items-center justify-center align-baseline bg-ink/85 rounded-sm cursor-pointer text-paper text-[0.6em] leading-none font-sans"
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
			Расшыфравана {foundLemmas} з {totalLemmas}{" "}
			{pluralize(totalLemmas, "слова")}
		</p>
	);
}
