import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Пра праект | Словы",
};

export default function AboutPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex-1 max-w-2xl mx-auto w-full px-5 sm:px-8 py-12 sm:py-20">
				<h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-ink mb-6 animate-fade-in-up">
					Пра праект
				</h1>

				<div className="prose prose-lg text-ink-muted leading-relaxed space-y-5 animate-fade-in-up">
					<p>
						<span className="font-display text-ink font-semibold">Словы</span> —
						гэта платформа штодзённых беларускіх слоўных гульняў. Дзве
						галаваломкі кожны дзень: <em>Побач</em> і <em>Валошка</em>.
					</p>
					<p>
						Мы натхняемся выдавецкай якасцю NYT Games і інтэлектуальнай глыбінёй
						Contexto.me — але робім гэта на беларускай мове, з беларускімі
						словамі і беларускім светапоглядам.
					</p>
					<p>
						Праект бясплатны і не збірае пра вас даных. Усе гульнявыя станы і
						статыстыка захоўваюцца лакальна на вашым прыстасаванні.
					</p>

					<section>
						<h2 className="font-display text-xl font-semibold text-ink mb-3">
							Як гэта працуе?
						</h2>
						<p>
							Побач выкарыстоўвае алгарытмы машыннага навучання для вызначэння
							семантычнай блізкасці слоў. Мадэль аналізуе, як часта словы
							ўжываюцца разам у тэкстах, і будуе &ldquo;карту&rdquo; іх сэнсаў.
						</p>
					</section>

					<section>
						<h2 className="font-display text-xl font-semibold text-ink mb-3">
							Стваральнік
						</h2>
						<p className="mb-2">Зроблена з ❤️ да роднай мовы</p>
						<p className="mb-2">
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
						</p>
						<p className="mb-3">
							Аўтар:{" "}
							<a
								href="https://github.com/alesdrobysh"
								target="_blank"
								rel="noopener noreferrer"
								className="text-valoshka hover:underline"
							>
								alesdrobysh
							</a>
						</p>
						<p className="mb-2">База слоў:</p>
						<ul className="space-y-1 ml-4 list-disc">
							<li>
								<a
									href="https://github.com/Belarus/GrammarDB"
									target="_blank"
									rel="noopener noreferrer"
									className="text-valoshka hover:underline"
								>
									Belarus/GrammarDB
								</a>
							</li>
							<li>
								<a
									href="https://github.com/verbumby/slouniki"
									target="_blank"
									rel="noopener noreferrer"
									className="text-valoshka hover:underline"
								>
									verbumby/slouniki
								</a>
							</li>
						</ul>
					</section>

					<section>
						<h2 className="font-display text-xl font-semibold text-ink mb-3">
							Кантакт
						</h2>
						<p>
							Маеце пытанні або прапановы? Напішыце нам па пошце{" "}
							<a
								href="mailto:support@pobach.app"
								className="text-valoshka hover:underline"
							>
								support@pobach.app
							</a>
						</p>
					</section>
				</div>

				<div className="mt-10">
					<p className="font-display italic text-ink">
						З любоўю да мовы і сэнсу.
					</p>
				</div>
			</div>
		</div>
	);
}
