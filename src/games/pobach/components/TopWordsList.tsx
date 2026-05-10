"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { TopWord } from "@/games/pobach/core/entities/game";
import DictionaryLink from "./DictionaryLink";

type TopWordsListProps = {
	dayIndex: number;
	mode: "win" | "lose";
};

export default function TopWordsList({
	dayIndex,
	mode: _mode,
}: TopWordsListProps) {
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
			const response = await fetch(`/api/top-words?dayIndex=${dayIndex}`);
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
		<div className="border-t border-[var(--sly-border)]">
			<button
				onClick={toggleExpanded}
				aria-expanded={isExpanded}
				aria-controls="top-words-list"
				type="button"
				className="w-full flex items-center justify-between px-6 py-3 text-sm text-[var(--sly-text-muted)] hover:text-[var(--sly-text)] hover:bg-[var(--sly-border)]/30 transition-colors"
			>
				Паказаць бліжэйшыя словы
				<ChevronDown
					size={16}
					className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
				/>
			</button>

			{isExpanded && (
				<div id="top-words-list" className="px-6 pb-4">
					{isLoading && (
						<div className="space-y-2">
							{Array.from({ length: 10 }, (_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
								<div key={`skeleton-${i}`} className="flex gap-3 animate-pulse">
									<div className="h-4 w-8 bg-[var(--sly-border)] rounded" />
									<div className="h-4 w-24 bg-[var(--sly-border)] rounded" />
								</div>
							))}
						</div>
					)}

					{error && <div className="text-sm text-red-500">{error}</div>}

					{topWords && (
						<table className="w-full text-sm">
							<thead>
								<tr className="text-left text-xs text-[var(--sly-text-muted)] border-b border-[var(--sly-border)]">
									<th className="pb-2 font-medium w-12">Месца</th>
									<th className="pb-2 font-medium">Слова</th>
								</tr>
							</thead>
							<tbody>
								{topWords.map((word) => (
									<tr
										key={word.rank}
										className={`border-b border-[var(--sly-border)]/50 last:border-0 ${word.rank === 1 ? "text-[var(--sly-rank-1)] font-semibold" : "text-[var(--sly-text)]"}`}
									>
										<td className="py-1.5 text-[var(--sly-text-muted)] font-mono text-xs">
											#{word.rank}
										</td>
										<td className="py-1.5">
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
