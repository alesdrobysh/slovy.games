import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Пра праект | Словы",
};

import Link from "next/link";

export default function AboutPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex-1 max-w-2xl mx-auto w-full px-5 sm:px-8 py-12 sm:py-20">
				<h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-ink mb-8 animate-fade-in-up">
					Пра праект
				</h1>

				<div className="text-ink-muted leading-relaxed space-y-5 animate-fade-in-up">
					<p className="text-lg">
						<span className="font-display text-ink">Словы</span> — гэта
						платформа штодзённых беларускіх слоўных гульняў. Дзве галаваломкі
						кожны дзень: <em>Побач</em> і <em>Валошка</em>.
					</p>
					<p className="text-lg">
						Мы натхняемся выдавецкай якасцю NYT Games і інтэлектуальнай
						глыбінёй Contexto.me — але робім гэта на беларускай мове, з
						беларускімі словамі і беларускім светапоглядам.
					</p>
					<p className="text-lg">
						Праект бясплатны і не збірае пра вас даных. Усе гульнявыя станы і
						статыстыка захоўваюцца лакальна на вашым прыстасаванні.
					</p>

					<div className="border-t border-rule my-8" />

					<section className="space-y-2">
						<h2 className="font-display text-xl font-semibold text-ink">
							Як гэта працуе?
						</h2>
						<p>
							Побач выкарыстоўвае алгарытмы машыннага навучання для вызначэння
							семантычнай блізкасці слоў. Мадэль аналізуе, як часта словы
							ўжываюцца разам у тэкстах, і будуе &ldquo;карту&rdquo; іх сэнсаў.
						</p>
					</section>

					<section className="space-y-2">
						<h2 className="font-display text-xl font-semibold text-ink">
							Стваральнік
						</h2>
						<p>
							Натхненнем сталі{" "}
							<a
								href="https://contexto.me"
								target="_blank"
								rel="noopener noreferrer"
								className="text-valoshka hover:underline"
							>
								Contexto
							</a>{" "}
							і{" "}
							<a
								href="https://semantle.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-valoshka hover:underline"
							>
								Semantle
							</a>
							. Аўтар:{" "}
							<a
								href="https://github.com/alesdrobysh"
								target="_blank"
								rel="noopener noreferrer"
								className="text-valoshka hover:underline"
							>
								alesdrobysh
							</a>
							.
						</p>
						<p>
							База слоў:{" "}
							<a
								href="https://github.com/Belarus/GrammarDB"
								target="_blank"
								rel="noopener noreferrer"
								className="text-valoshka hover:underline"
							>
								Belarus/GrammarDB
							</a>{" "}
							і{" "}
							<a
								href="https://github.com/verbumby/slouniki"
								target="_blank"
								rel="noopener noreferrer"
								className="text-valoshka hover:underline"
							>
								verbumby/slouniki
							</a>
							.
						</p>
					</section>

					<section className="space-y-2">
						<h2 className="font-display text-xl font-semibold text-ink">
							Кантакт
						</h2>
						<p>
							Маеце пытанні або прапановы?{" "}
							<a
								href="mailto:support@pobach.app"
								className="text-valoshka hover:underline"
							>
								support@pobach.app
							</a>
						</p>
					</section>
				</div>

				<div className="mt-12 pt-8 border-t border-rule flex items-center justify-between">
					<p className="font-display italic text-ink">З любоўю да мовы і сэнсу.</p>
					<Link
						href="/"
						className="text-sm font-medium text-ink-muted hover:text-ink transition-colors no-underline"
					>
						← Да гульняў
					</Link>
				</div>
			</div>
		</div>
	);
}
