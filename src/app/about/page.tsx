import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/shared/components/Nav";
import { Typography } from "@/shared/components/ui/Typography";

export const metadata: Metadata = {
	title: "Пра праект | Словы",
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
						<span className="font-display text-ink">Словы</span> — гэта платформа
						штодзённых беларускіх слоўных гульняў. Дзве галаваломкі кожны дзень:{" "}
						<em>Побач</em> і <em>Валошка</em>.
					</Typography>
					<Typography variant="body">
						Мы натхняемся выдавецкай якасцю NYT Games і інтэлектуальнай глыбінёй
						Contexto.me — але робім гэта на беларускай мове, з беларускімі словамі
						і беларускім светапоглядам.
					</Typography>
					<Typography variant="body">
						Праект бясплатны і не збірае пра вас даных. Усе гульнявыя станы і
						статыстыка захоўваюцца лакальна на вашым прыстасаванні.
					</Typography>
				</section>

				<div className="border-t border-rule" />

				<section className="space-y-flow-md">
					<Typography variant="heading" as="h2">
						Як гэта працуе?
					</Typography>
					<Typography variant="body">
						Побач выкарыстоўвае алгарытмы машыннага навучання для вызначэння
						семантычнай блізкасці слоў. Мадэль аналізуе, як часта словы
						ўжываюцца разам у тэкстах, і будуе &ldquo;карту&rdquo; іх сэнсаў.
					</Typography>
				</section>

				<section className="space-y-flow-md">
					<Typography variant="heading" as="h2">
						Credits
					</Typography>
					<Typography variant="body">
						База слоў:{" "}
						<a
							href="https://github.com/Belarus/GrammarDB"
							target="_blank"
							rel="noopener noreferrer"
							className="text-valoshka hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm"
						>
							Belarus/GrammarDB
						</a>{" "}
						і{" "}
						<a
							href="https://github.com/verbumby/slouniki"
							target="_blank"
							rel="noopener noreferrer"
							className="text-valoshka hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm"
						>
							verbumby/slouniki
						</a>
						.
					</Typography>
				</section>

				<section className="space-y-flow-md">
					<Typography variant="heading" as="h2">
						Кантакт
					</Typography>
					<Typography variant="body">
						Маеце пытанні або прапановы?{" "}
						<a
							href="mailto:slovy.games"
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
