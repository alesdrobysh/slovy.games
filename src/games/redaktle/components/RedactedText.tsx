"use client";

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
	return (
		<div className="font-display text-ink leading-relaxed text-base sm:text-lg">
			{revealTitle && title && (
				<p className="mb-flow-md">
					<span className="text-ink-soft text-xs sm:text-sm uppercase tracking-widest">
						Артыкул:{" "}
					</span>
					<strong className="text-redaktle">{title}</strong>
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
					return (
						<span
							key={key}
							role="img"
							aria-label={`${token.text.length} схаваных літар`}
							className="inline-block align-baseline bg-ink/85 rounded-sm"
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
			Расшыфравана {foundLemmas} з {totalLemmas}{" "}
			{pluralize(totalLemmas, "слова")}
		</p>
	);
}
