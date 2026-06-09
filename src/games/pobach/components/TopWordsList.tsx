"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { TopWord } from "@/games/pobach/core/entities/game";
import DictionaryLink from "@/shared/components/DictionaryLink";
import { ErrorMessage } from "@/shared/components/ui/ErrorMessage";
import { Typography } from "@/shared/components/ui/Typography";

type TopWordsListProps = {
	dayIndex: number;
};

export default function TopWordsList({ dayIndex }: TopWordsListProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [topWords, setTopWords] = useState<TopWord[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	const toggleExpanded = async () => {
		if (!isExpanded && !topWords) {
			await loadTopWords();
		}
		setIsExpanded(!isExpanded);
	};

	const loadTopWords = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/pobach/top-words?dayIndex=${dayIndex}`);
			if (!response.ok) {
				throw new Error("Failed to load top words");
			}
			const data: TopWord[] = await response.json();
			setTopWords(data);
		} catch (err) {
			console.error("Failed to load top words:", err);
			setError("Не ўдалося загрузіць спіс слоў");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="border-t border-rule">
			<button
				onClick={toggleExpanded}
				aria-expanded={isExpanded}
				aria-controls="top-words-list"
				type="button"
				className="w-full flex items-center justify-between px-inset-lg py-inset-sm text-ink-muted hover:text-ink hover:bg-rule/30 transition-colors"
			>
				<Typography variant="body" as="span">
					Паказаць бліжэйшыя словы
				</Typography>
				<ChevronDown
					size={16}
					className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
				/>
			</button>

			{isExpanded && (
				<div id="top-words-list" className="px-inset-lg pb-inset-md">
					{isLoading && (
						<div className="space-y-flow-sm">
							{Array.from({ length: 10 }, (_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
								<div key={`skeleton-${i}`} className="flex gap-flow-md animate-pulse">
									<div className="h-4 w-8 bg-rule rounded" />
									<div className="h-4 w-24 bg-rule rounded" />
								</div>
							))}
						</div>
					)}

					{error && (
						<div>
							<ErrorMessage message="Не атрымалася загрузіць спіс." />
							<button
								type="button"
								onClick={loadTopWords}
								className="underline hover:no-underline text-ink text-sm"
							>
								Паспрабаваць зноў
							</button>
						</div>
					)}

					{topWords && (
						<table className="w-full">
							<thead>
								<tr className="text-left border-b border-rule">
									<th className="pb-flow-sm font-normal w-24">
										<Typography variant="overline" as="span" style={{ color: "var(--fg-2)" }}>
											Месца
										</Typography>
									</th>
									<th className="pb-flow-sm font-normal">
										<Typography variant="overline" as="span" style={{ color: "var(--fg-2)" }}>
											Слова
										</Typography>
									</th>
								</tr>
							</thead>
							<tbody>
								{topWords.map((word) => (
									<tr
										key={word.rank}
										className={`border-b border-rule/50 last:border-0 ${word.rank === 1 ? "font-semibold" : ""}`}
										style={{ color: word.rank === 1 ? "var(--rank-1)" : "var(--fg)" }}
									>
										<td className="py-flow-sm">
											<Typography
												variant="overline"
												as="span"
												style={{ color: "var(--fg-2)", fontVariantNumeric: "tabular-nums" }}
											>
												#{word.rank}
											</Typography>
										</td>
										<td className="py-flow-sm">
											<DictionaryLink word={word.word} />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			)}
		</div>
	);
}
