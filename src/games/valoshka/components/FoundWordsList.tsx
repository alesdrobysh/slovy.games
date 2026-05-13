"use client";

interface FoundWordsListProps {
	words: string[];
	pangrams: string[];
	lastFoundWord: string | null;
}

export function FoundWordsList({
	words,
	pangrams,
	lastFoundWord,
}: FoundWordsListProps) {
	const sorted = [...words].sort((a, b) => a.localeCompare(b, "be"));
	const count = words.length;

	return (
		<aside className="bg-card ring-1 ring-rule rounded-2xl p-5 max-h-[60vh] overflow-y-auto">
			<div className="flex items-baseline justify-between mb-4">
				<h2 className="font-display text-lg font-medium text-ink">
					{count === 0
						? "Пакуль нічога"
						: count === 1
							? "1 слова"
							: `${count} слоў`}
				</h2>
				{count > 0 && (
					<span className="text-xs text-ink-muted">
						{count} {count === 1 ? "слова" : "слоў"}
					</span>
				)}
			</div>

			{count === 0 ? (
				<p className="text-sm text-ink-soft">Пачніце ўводзіць словы...</p>
			) : (
				<ul className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-sm font-display">
					{sorted.map((word) => {
						const isPangram = pangrams.includes(word);
						const isNew = word === lastFoundWord;
						return (
							<li
								key={word}
								className={`${
									isNew ? "word-pop" : ""
								} flex items-center gap-1.5 ${
									isPangram ? "text-valoshka font-semibold" : "text-ink"
								}`}
							>
								{word}
								{isPangram && (
									<span className="text-[9px] bg-valoshka-soft text-valoshka rounded px-1 py-px font-bold uppercase tracking-wider">
										панг
									</span>
								)}
							</li>
						);
					})}
				</ul>
			)}
		</aside>
	);
}
