import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/shared/components/Nav";
import { Typography } from "@/shared/components/ui/Typography";

export const metadata: Metadata = {
	title: "Пра праект",
};

export default function AboutPage() {
	return (
		<>
		<Nav />
		<div className="page-narrow page-container page-section">
			<Link
				href="/"
				className="text-ink-soft hover:text-ink transition-colors mb-inset-lg inline-block no-underline"
			>
				<Typography variant="overline" as="span">← Да гульняў</Typography>
			</Link>

			<Typography variant="title" as="h1" className="mb-inset-xl">
				Пра праект
			</Typography>

			<div className="space-y-inset-xl">
				<section className="space-y-flow-md">
					<Typography variant="body">
						<span className="font-display text-ink">Словы</span> — гэта штодзённыя
						беларускія галаваломкі. Мы натхняемся найлепшымі ўзорамі слоўных гульняў
						і ствараем сваё — з беларускімі словамі.
					</Typography>
					<Typography variant="body">
						У «Побач» мы адгадваем слова праз яго блізкасць паводле сэнсу да іншых
						слоў, а ў «Валошцы» — складаем як мага больш слоў з выбраных літар.
					</Typography>
					<Typography variant="body">
						Праект цалкам бясплатны і беражэ вашу прыватнасць. Мы не збіраем
						ніякіх даных: увесь ваш прагрэс захоўваецца выключна на вашай прыладзе.
					</Typography>
				</section>

				<div className="border-t border-rule" />

				<section className="space-y-flow-md">
					<Typography variant="heading" as="h2">
						Падзякі і рэсурсы
					</Typography>
					<Typography variant="body">
						Для стварэння гульняў выкарыстоўваюцца адкрытыя лексічныя базы{" "}
						<a
							href="https://github.com/Belarus/GrammarDB"
							target="_blank"
							rel="noopener noreferrer"
							className="text-valoshka hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm"
						>
							GrammarDB
						</a>{" "}
						і{" "}
						<a
							href="https://github.com/verbumby/slouniki"
							target="_blank"
							rel="noopener noreferrer"
							className="text-valoshka hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm"
						>
							verbumby
						</a>
						.
					</Typography>
				</section>

				<section className="space-y-flow-md">
					<Typography variant="heading" as="h2">
						Кантакт
					</Typography>
					<Typography variant="body">
						Маеце пытанні ці прапановы? Пішыце нам:{" "}
						<a
							href="mailto:support@slovy.games"
							className="text-valoshka hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm"
						>
							support@slovy.games
						</a>
					</Typography>
				</section>
			</div>
		</div>
		</>
	);
}
