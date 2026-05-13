export default function RulesComponent({
	inline = false,
}: {
	inline?: boolean;
}) {
	if (inline) {
		return (
			<div className="bg-card ring-1 ring-rule rounded-2xl p-7 animate-fade-in-up">
				<h2 className="font-display text-xl font-medium text-ink mb-4">
					Як гуляць
				</h2>
				<p className="text-sm text-ink-muted leading-relaxed mb-4">
					Згадайце схаванае слова па яго сэнсе. Уводзьце беларускія словы —
					кожнае атрымае ранг. Чым меншы ранг, тым бліжэй вы да адгадкі.
					<strong className="text-ink"> Ранг 1 — перамога.</strong>
				</p>

				<div className="grid grid-cols-5 gap-2 text-center text-[10px]">
					{[
						{ color: "var(--sly-rank-1)", label: "Мэта", rank: "1" },
						{ color: "var(--sly-rank-10)", label: "Гарача", rank: "≤10" },
						{ color: "var(--sly-rank-100)", label: "Цёпла", rank: "≤100" },
						{ color: "var(--sly-rank-1000)", label: "Холадна", rank: "≤1000" },
						{ color: "var(--sly-rank-default)", label: "Далёка", rank: ">1000" },
					].map((item) => (
						<div key={item.label} className="flex flex-col items-center gap-1">
							<div
								className="w-6 h-2 rounded-full"
								style={{ backgroundColor: item.color }}
							/>
							<span className="text-ink-soft font-medium">{item.label}</span>
							<span className="text-ink-muted">{item.rank}</span>
						</div>
					))}
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
				Падказка: націсніце на любое слова ў спісе, каб адкрыць яго ў
				слоўніку.
			</p>
		</div>
	);
}
