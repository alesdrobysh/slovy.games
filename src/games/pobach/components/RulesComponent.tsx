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
				<ul className="space-y-2 text-sm text-ink-muted leading-relaxed">
					<li>• Уводзьце любыя беларускія словы.</li>
					<li>
						• Кожнае слова атрымае{" "}
						<span className="text-ink font-medium">ранг</span> — наколькі яно
						блізкае па сэнсе да схаванага.
					</li>
					<li>
						• Чым меншы лік — тым бліжэй. Ранг{" "}
						<span className="text-pobach font-semibold">1</span> — перамога.
					</li>
					<li>• Колькасць спроб неабмежаваная. Можна ўзяць падказку.</li>
				</ul>

				<div className="mt-5 grid grid-cols-5 gap-2 text-center text-[10px] text-ink-soft">
					<div className="flex flex-col items-center gap-1.5">
						<div
							className="w-6 h-2 rounded-full"
							style={{ backgroundColor: "var(--sly-rank-1)" }}
						/>
						Мэта
					</div>
					<div className="flex flex-col items-center gap-1.5">
						<div
							className="w-6 h-2 rounded-full"
							style={{ backgroundColor: "var(--sly-rank-10)" }}
						/>
						Гарача
					</div>
					<div className="flex flex-col items-center gap-1.5">
						<div
							className="w-6 h-2 rounded-full"
							style={{ backgroundColor: "var(--sly-rank-100)" }}
						/>
						Цёпла
					</div>
					<div className="flex flex-col items-center gap-1.5">
						<div
							className="w-6 h-2 rounded-full"
							style={{ backgroundColor: "var(--sly-rank-1000)" }}
						/>
						Холадна
					</div>
					<div className="flex flex-col items-center gap-1.5">
						<div
							className="w-6 h-2 rounded-full"
							style={{ backgroundColor: "var(--sly-rank-default)" }}
						/>
						Далёка
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-3 text-sm text-ink leading-relaxed">
			<p>
				Знайдзіце загаданае слова па яго <strong>сэнсе</strong>, а не па
				напісанні.
			</p>
			<p>
				Напрыклад, загадана слова: <strong className="text-pobach">ЛЕС</strong>
			</p>

			<ul className="space-y-2 mt-3">
				<li className="flex items-start gap-3">
					<span
						className="shrink-0 w-3 h-3 rounded-sm mt-0.5"
						style={{ backgroundColor: "var(--sly-rank-1)" }}
					/>
					<span>
						Лес — <strong>перамога</strong> (№1)
					</span>
				</li>
				<li className="flex items-start gap-3">
					<span
						className="shrink-0 w-3 h-3 rounded-sm mt-0.5"
						style={{ backgroundColor: "var(--sly-rank-10)" }}
					/>
					<span>
						Дрэва — <strong>вельмі блізка</strong> (№4)
					</span>
				</li>
				<li className="flex items-start gap-3">
					<span
						className="shrink-0 w-3 h-3 rounded-sm mt-0.5"
						style={{ backgroundColor: "var(--sly-rank-100)" }}
					/>
					<span>
						Птушка — <strong>блізка</strong> (№45)
					</span>
				</li>
				<li className="flex items-start gap-3">
					<span
						className="shrink-0 w-3 h-3 rounded-sm mt-0.5"
						style={{ backgroundColor: "var(--sly-rank-1000)" }}
					/>
					<span>
						Грыб — <strong>трохі далей</strong> (№215)
					</span>
				</li>
				<li className="flex items-start gap-3">
					<span
						className="shrink-0 w-3 h-3 rounded-sm mt-0.5"
						style={{ backgroundColor: "var(--sly-rank-default)" }}
					/>
					<span>
						Аўтамабіль — <strong>вельмі далёка</strong> (№15000)
					</span>
				</li>
			</ul>

			<p className="pt-1">Чым меншы нумар, тым бліжэй вы да адгадкі.</p>
			<p>
				Слова пад нумарам <strong>1</strong> — гэта перамога!
			</p>
			<p>
				Калі захраснеце — бярыце <strong>падказку</strong>.
			</p>
			<p className="text-ink-muted">
				Націсніце на любое слова ў спісе, каб убачыць яго ў слоўніку.
			</p>
		</div>
	);
}
