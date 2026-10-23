"use client";

import { lemmasOf } from "../lib/lemmatize";
import type { ArticleToken } from "../types";

interface GuessListProps {
	articleId?: string;
	guesses: string[];
	tokens?: ArticleToken[];
	highlighted?: readonly string[];
	onSelect?: (lemmas: string[]) => void;
}

interface GuessRecord {
	input: string;
	/** The guess's lemmas that occur in the article. */
	lemmas: string[];
	hits: number;
	attempt: number;
}

function GuessRow({
	record,
	highlighted = [],
	onSelect,
}: {
	record: GuessRecord;
	highlighted?: readonly string[];
	onSelect?: (lemmas: string[]) => void;
}) {
	const selected =
		record.lemmas.length > 0 &&
		record.lemmas.length === highlighted.length &&
		record.lemmas.every((lemma) => highlighted.includes(lemma));
	const result = record.hits > 0 ? `✓ ${record.hits}` : "× 0";
	const label =
		record.hits > 0
			? `${record.input}: раскрыта ${record.hits}`
			: `${record.input}: няма ў артыкуле`;
	const content = (
		<>
			<span className="w-8 shrink-0 text-right tabular-nums text-ink-muted">
				#{record.attempt}
			</span>
			<span className="min-w-0 flex-1 truncate text-left">{record.input}</span>
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
			<output
				className="flex w-full min-w-0 min-h-(--control-compact-height) items-center gap-flow-sm px-inset-xs text-sm text-ink-muted"
				aria-label={label}
			>
				{content}
			</output>
		);
	}

	return (
		<button
			type="button"
			onClick={() => onSelect?.(record.lemmas)}
			aria-label={label}
			aria-pressed={selected}
			className={
				selected
					? "flex w-full min-w-0 min-h-(--control-min-height) items-center gap-flow-sm bg-sakretna-soft text-sakretna px-inset-sm py-flow-xs text-sm font-sans cursor-pointer"
					: "flex w-full min-w-0 min-h-(--control-min-height) items-center gap-flow-sm text-ink-muted px-inset-sm py-flow-xs text-sm font-sans cursor-pointer hover:bg-secondary"
			}
		>
			{content}
		</button>
	);
}

export function GuessList({
	articleId,
	guesses,
	tokens = [],
	highlighted,
	onSelect,
}: GuessListProps) {
	const hitCounts = new Map<string, number>();
	for (const token of tokens) {
		if (token.type === "word" && token.lemma) {
			hitCounts.set(token.lemma, (hitCounts.get(token.lemma) ?? 0) + 1);
		}
	}
	const records = guesses.map((input, index) => {
		const lemmas = lemmasOf(input, articleId).filter((l) => hitCounts.has(l));
		return {
			input,
			lemmas,
			hits: lemmas.reduce((sum, l) => sum + (hitCounts.get(l) ?? 0), 0),
			attempt: index + 1,
		};
	});
	const all = [...records].reverse();
	return (
		<section className="w-full" aria-label="Гісторыя спроб">
			{all.length === 0 ? (
				<p className="flex min-h-(--control-compact-height) items-center px-inset-xs text-sm text-ink-muted">
					Спробы з’явяцца тут
				</p>
			) : (
				<ol
					key={guesses.length}
					className="max-h-(--panel-history-max-height) max-md:short:max-h-(--panel-history-emergency-height) overflow-y-auto overscroll-contain divide-y divide-rule"
				>
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
			)}
		</section>
	);
}
