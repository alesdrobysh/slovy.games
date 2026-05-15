import { Typography } from "@/shared/components/ui/Typography";

const RANK_ITEMS = [
	{ color: "var(--rank-1)", word: "Лес", label: "перамога", rank: 1 },
	{ color: "var(--rank-10)", word: "Дрэва", label: "вельмі блізка", rank: 4 },
	{ color: "var(--rank-100)", word: "Птушка", label: "блізка", rank: 45 },
	{ color: "var(--rank-1000)", word: "Грыб", label: "трохі далей", rank: 215 },
	{ color: "var(--rank-default)", word: "Аўтамабіль", label: "вельмі далёка", rank: 15078 },
];

function RulesContent() {
	return (
		<div className="space-y-flow-lg">
			<Typography variant="body">
				Знайдзіце загаданае слова па яго <strong>сэнсе</strong>, а не па
				напісанні.
			</Typography>
			<div>
				<Typography variant="body" style={{ marginBottom: "var(--space-flow-sm)" }}>
					Напрыклад, загадана слова:{" "}
					<strong className="text-pobach">ЛЕС</strong>
				</Typography>
				<ul className="space-y-flow-sm">
					{RANK_ITEMS.map((item) => (
						<li key={item.word} className="flex items-center gap-flow-md">
							<span
								className="shrink-0 w-3 h-3 rounded-sm"
								aria-hidden="true"
								style={{ backgroundColor: item.color }}
							/>
							<Typography variant="body" as="span" style={{ textAlign: "left", hyphens: "none" }}>
								{item.word} — <strong>{item.label}</strong> (&#8470;{item.rank})
							</Typography>
						</li>
					))}
				</ul>
			</div>
			<Typography variant="body">
				Чым меншы нумар, тым бліжэй вы да адгадкі.
			</Typography>
			<Typography variant="body">
				Слова пад нумарам <strong>1</strong> — гэта перамога!
			</Typography>
			<Typography variant="body">
				Калі захраснеце — бярыце <strong>падказку</strong>.
			</Typography>
			<Typography variant="caption" style={{ color: "var(--fg-2)" }}>
				Націсніце на любое слова ў спісе, каб убачыць яго ў слоўніку.
			</Typography>
		</div>
	);
}

export default function RulesComponent({
	inline = false,
}: {
	inline?: boolean;
}) {
	if (inline) {
		return (
			<div className="bg-card ring-1 ring-rule rounded-2xl p-inset-lg animate-fade-in-up">
				<Typography
					variant="heading"
					as="h2"
					style={{ color: "var(--fg)", marginBottom: "var(--space-inset-md)" }}
				>
					Як гуляць?
				</Typography>
				<RulesContent />
			</div>
		);
	}

	return <RulesContent />;
}
