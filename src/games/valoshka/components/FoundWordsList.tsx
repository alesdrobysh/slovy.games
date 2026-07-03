"use client";

import DictionaryLink from "@/shared/components/DictionaryLink";
import { Badge } from "@/shared/components/ui/Badge";
import { Typography } from "@/shared/components/ui/Typography";
import { pluralize } from "@/shared/lib/pluralize";

interface FoundWordsListProps {
	words: string[];
	pangrams: string[];
}

export function FoundWordsList({ words, pangrams }: FoundWordsListProps) {
	const sorted = [...words].sort((a, b) => a.localeCompare(b, "be"));
	const count = words.length;

	return (
		<aside className="bg-card ring-1 ring-rule rounded-2xl p-inset-md max-h-[60vh] overflow-y-auto">
			<div className="flex items-baseline justify-between mb-flow-lg">
				<Typography variant="subheading" as="h2">
					{count === 0
						? "Пакуль нічога"
						: `${count} ${pluralize(count, "слова")}`}
				</Typography>
			</div>

			{count === 0 ? (
				<Typography variant="body">Пачніце ўводзіць словы...</Typography>
			) : (
				<ul className="grid grid-cols-2 gap-y-flow-xs gap-x-flow-lg text-sm font-display">
					{sorted.map((word) => {
						const isPangram = pangrams.includes(word);
						return (
							<li key={word} className="flex items-center gap-flow-xs">
								<Typography
									variant="body"
									className={isPangram ? "text-valoshka" : ""}
								>
									<DictionaryLink word={word} />
								</Typography>
							</li>
						);
					})}
				</ul>
			)}
		</aside>
	);
}
