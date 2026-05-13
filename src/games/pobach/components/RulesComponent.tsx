export default function RulesComponent({
	inline = false,
}: {
	inline?: boolean;
}) {
	if (inline) {
		return (
			<div className="bg-card ring-1 ring-rule rounded-2xl p-7 animate-fade-in-up">
				<h2 className="font-display text-2xl font-bold text-ink mb-5">
					Як гуляць?
				</h2>
				<div className="space-y-4 text-sm text-ink leading-relaxed">
					<p>
						Знайдзіце загаданае слова па яго <strong>сэнсе</strong>, а не па
						напісанні.
					</p>
					<div>
						<p className="mb-2">
							Напрыклад, загадана слова:{" "}
							<strong className="text-pobach">ЛЕС</strong>
						</p>
						<ul className="space-y-2">
							{[
								{ color: "var(--sly-rank-1)", word: "Лес", label: "перамога", rank: "№1" },
								{ color: "var(--sly-rank-10)", word: "Дрэва", label: "вельмі блізка", rank: "№4" },
								{ color: "var(--sly-rank-100)", word: "Птушка", label: "блізка", rank: "№45" },
								{ color: "var(--sly-rank-1000)", word: "Грыб", label: "трохі далей", rank: "№215" },
								{ color: "var(--sly-rank-default)", word: "Аўтамабіль", label: "вельмі далёка", rank: "№15000" },
							].map((item) => (
								<li key={item.word} className="flex items-start gap-3">
									<span
										className="shrink-0 w-3 h-3 rounded-sm mt-0.5"
										aria-hidden="true"
										style={{ backgroundColor: item.color }}
									/>
									<span>
										{item.word} — <strong>{item.label}</strong> ({item.rank})
									</span>
								</li>
							))}
						</ul>
					</div>
					<p>Чым меншы нумар, тым бліжэй вы да адгадкі.</p>
					<p>
						Слова пад нумарам <strong>1</strong> — гэта перамога!
					</p>
					<p>
						Калі захраснеце — бярыце <strong>падказку</strong>.
					</p>
					<p className="text-ink-muted text-xs">
						Націсніце на любое слова ў спісе, каб убачыць яго ў слоўніку.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4 text-sm text-ink leading-relaxed">
			<p>
				Знайдзіце схаванае слова па яго <strong>сэнсе</strong>, а не па
				напісанні.
			</p>

			<div
				className="p-3 rounded-xl"
				style={{
					background: "var(--sly-accent-subtle)",
					border: "1px solid var(--sly-accent-border)",
				}}
			>
				<p className="text-xs text-ink-muted mb-2">Напрыклад, калі слова:</p>
				<p className="font-display text-lg text-pobach mb-2">ЛЕС</p>
				<ul className="space-y-1.5">
					<li className="flex items-center gap-2">
						<span
							className="shrink-0 w-2.5 h-2.5 rounded-sm"
							style={{ backgroundColor: "var(--sly-rank-1)" }}
						/>
						<span>
							Лес — <strong>перамога</strong> (ранг 1)
						</span>
					</li>
					<li className="flex items-center gap-2">
						<span
							className="shrink-0 w-2.5 h-2.5 rounded-sm"
							style={{ backgroundColor: "var(--sly-rank-10)" }}
						/>
						<span>Дрэва — вельмі блізка (ранг 4)</span>
					</li>
					<li className="flex items-center gap-2">
						<span
							className="shrink-0 w-2.5 h-2.5 rounded-sm"
							style={{ backgroundColor: "var(--sly-rank-100)" }}
						/>
						<span>Птушка — блізка (ранг 45)</span>
					</li>
					<li className="flex items-center gap-2">
						<span
							className="shrink-0 w-2.5 h-2.5 rounded-sm"
							style={{ backgroundColor: "var(--sly-rank-1000)" }}
						/>
						<span>Грыб — далёка (ранг 215)</span>
					</li>
					<li className="flex items-center gap-2">
						<span
							className="shrink-0 w-2.5 h-2.5 rounded-sm"
							style={{ backgroundColor: "var(--sly-rank-default)" }}
						/>
						<span>Аўтамабіль — вельмі далёка (ранг 15000)</span>
					</li>
				</ul>
			</div>

			<p>Чым меншы нумар, тым бліжэй вы да адгадкі.</p>
			<p>
				Спробаў неабмежавана. Калі захраснеце — скарыстайце{" "}
				<strong>падказку</strong>.
			</p>
			<p className="text-ink-muted text-xs">
				Падказка: націсніце на любое слова ў спісе, каб адкрыць яго ў слоўніку.
			</p>
		</div>
	);
}
