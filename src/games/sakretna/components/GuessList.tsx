"use client";

import { pluralize } from "@/shared/lib/pluralize";
import { lemmaOf } from "../lib/lemmatize";
import type { ArticleToken } from "../types";

interface GuessListProps {
	guesses: string[];
	tokens?: ArticleToken[];
	highlighted?: string | null;
	onSelect?: (lemma: string) => void;
}

interface GuessRecord {
	input: string;
	lemma: string;
	hits: number;
}

function GuessRow({
	record,
	highlighted,
	onSelect,
}: {
	record: GuessRecord;
	highlighted?: string | null;
	onSelect?: (lemma: string) => void;
}) {
	const result = record.hits > 0 ? `✓ ${record.hits}` : "× 0";
	const label =
		record.hits > 0
			? `${record.input}: раскрыта ${record.hits}`
			: `${record.input}: няма ў артыкуле`;
	const content = (
		<>
			<span className="truncate">{record.input}</span>
			<span
				className={
					record.hits > 0
						? "shrink-0 font-semibold text-sakretna"
						: "shrink-0 font-semibold text-ink-muted"
				}
				aria-hidden={record.hits > 0 ? true : undefined}
			>
				{result}
			</span>
		</>
	);

	if (record.hits === 0) {
		return (
			<span className="flex min-w-0 min-h-(--control-min-height) items-center justify-between gap-flow-sm rounded-lg bg-secondary px-inset-sm py-flow-xs text-xs text-ink-muted">
				{content}
			</span>
		);
	}

	return (
		<button
			type="button"
			onClick={() => onSelect?.(record.lemma)}
			aria-label={label}
			aria-pressed={record.lemma === highlighted}
			className={
				record.lemma === highlighted
					? "flex min-w-0 min-h-(--control-min-height) items-center justify-between gap-flow-sm rounded-lg bg-sakretna text-paper px-inset-sm py-flow-xs text-xs font-sans cursor-pointer"
					: "flex min-w-0 min-h-(--control-min-height) items-center justify-between gap-flow-sm rounded-lg bg-secondary text-ink-muted px-inset-sm py-flow-xs text-xs font-sans cursor-pointer hover:bg-secondary/80"
			}
		>
			{content}
		</button>
	);
}

export function GuessList({
	guesses,
	tokens = [],
	highlighted,
	onSelect,
}: GuessListProps) {
	if (guesses.length === 0) return null;
	const hitCounts = new Map<string, number>();
	for (const token of tokens) {
		if (token.type === "word" && token.lemma) {
			hitCounts.set(token.lemma, (hitCounts.get(token.lemma) ?? 0) + 1);
		}
	}
	const records = guesses.map((input) => {
		const lemma = lemmaOf(input);
		return { input, lemma, hits: hitCounts.get(lemma) ?? 0 };
	});
	const recent = [...records].reverse().slice(0, 3);
	const all = [...records].reverse();

	return (
		<div className="w-full">
			<p className="text-ink-muted uppercase tracking-widest text-[10px] font-medium mb-flow-xs">
				Спроб ({guesses.length} {pluralize(guesses.length, "спроба")})
			</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-flow-xs">
				{recent.map((record) => (
					<GuessRow
						key={record.input}
						record={record}
						highlighted={highlighted}
						onSelect={onSelect}
					/>
				))}
			</div>
			{records.length > recent.length && (
				<details className="mt-flow-xs">
					<summary className="min-h-(--control-min-height) flex items-center cursor-pointer text-xs font-medium text-ink-muted">
						Уся гісторыя ({records.length})
					</summary>
					<ol className="mt-flow-xs max-h-[40vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-flow-xs">
						{all.map((record) => (
							<li key={record.input}>
								<GuessRow
									record={record}
									highlighted={highlighted}
									onSelect={onSelect}
								/>
							</li>
						))}
					</ol>
				</details>
			)}
		</div>
	);
}
