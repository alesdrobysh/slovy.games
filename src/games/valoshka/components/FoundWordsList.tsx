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
		<div
			className="flex flex-col h-full"
			style={{
				background: "var(--sly-bg-card)",
				border: "1px solid var(--sly-border)",
				borderRadius: "14px",
				padding: "20px",
				minHeight: "200px",
			}}
		>
			{/* Header */}
			<div
				className="flex items-center gap-2 mb-4 pb-3"
				style={{ borderBottom: "1px solid var(--sly-border)" }}
			>
				<span
					className="text-sm font-semibold"
					style={{
						color: "var(--sly-text)",
						fontFamily: "var(--sly-font-sans)",
					}}
				>
					{count === 0
						? "Словы не знойдзены"
						: count === 1
							? "Знойдзена 1 слова"
							: `Знойдзена ${count} слоў`}
				</span>
				{count > 0 && (
					<span
						className="ml-auto rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums"
						style={{
							background: "var(--sly-cornflower)",
							color: "var(--sly-cell-letter-center)",
							fontFamily: "var(--sly-font-sans)",
						}}
					>
						{count}
					</span>
				)}
			</div>

			{/* Word list */}
			<div className="flex-1 overflow-y-auto">
				{count === 0 ? (
					<p
						className="text-sm italic"
						style={{
							color: "var(--sly-text-muted)",
							fontFamily: "var(--sly-font-sans)",
						}}
					>
						Пачніце ўводзіць словы...
					</p>
				) : (
					<ul>
						{sorted.map((word) => {
							const isPangram = pangrams.includes(word);
							const isNew = word === lastFoundWord;
							return (
								<li
									key={word}
									className={`${isNew ? "word-pop" : ""} group`}
									style={{
										fontFamily: "var(--sly-font-sans)",
										fontSize: "14px",
										fontWeight: isPangram ? "700" : "400",
										color: isPangram
											? "var(--sly-cornflower)"
											: "var(--sly-text)",
										padding: "5px 0",
										borderBottom: "1px solid var(--sly-border)",
										display: "flex",
										alignItems: "center",
										gap: "8px",
									}}
								>
									{word}
									{isPangram && (
										<span
											style={{
												fontSize: "9px",
												background: "var(--sly-cornflower-bg-subtle)",
												color: "var(--sly-cornflower)",
												border: "1px solid var(--sly-cornflower-border-subtle)",
												borderRadius: "4px",
												padding: "1px 6px",
												fontWeight: "700",
												letterSpacing: "0.08em",
												textTransform: "uppercase",
											}}
										>
											панграма
										</span>
									)}
									<a
										href={`https://verbum.by/tsblm2022/${encodeURIComponent(word)}`}
										target="_blank"
										rel="noreferrer"
										className="ml-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
										style={{
											color: "var(--sly-text-muted)",
											fontSize: "12px",
											lineHeight: 1,
											textDecoration: "none",
											flexShrink: 0,
										}}
										title={`Знайсці "${word}" у слоўніку`}
									>
										↗
									</a>
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</div>
	);
}
