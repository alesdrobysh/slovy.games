"use client";

import Footer from "@/games/pobach/components/Footer";
import Header from "@/games/pobach/components/Header";

export default function PobachAboutPage() {
	return (
		<main className="min-h-screen flex flex-col">
			<Header />

			<div className="flex-1 w-full max-w-[600px] mx-auto px-4 py-8 space-y-8">
				<section>
					<h2 className="font-serif text-xl font-semibold text-[var(--text)] mb-3">
						Як гэта працуе?
					</h2>
					<p className="text-sm text-[var(--text-muted)] leading-relaxed">
						Побач выкарыстоўвае алгарытмы машыннага навучання для вызначэння
						семантычнай блізкасці слоў. Мадэль аналізуе, як часта словы
						ўжываюцца разам у тэкстах, і будуе &ldquo;карту&rdquo; іх сэнсаў.
					</p>
				</section>

				<section>
					<h2 className="font-serif text-xl font-semibold text-[var(--text)] mb-3">
						Стваральнік
					</h2>
					<p className="text-sm text-[var(--text-muted)] mb-2">
						Зроблена з ❤️ да роднай мовы
					</p>
					<p className="text-sm text-[var(--text-muted)] mb-2">
						Натхненнем сталі{" "}
						<a
							href="https://contexto.me"
							target="_blank"
							rel="noopener noreferrer"
							className="text-[var(--accent)] hover:underline"
						>
							Contexto
						</a>{" "}
						і{" "}
						<a
							href="https://semantle.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-[var(--accent)] hover:underline"
						>
							Semantle
						</a>
					</p>
					<p className="text-sm text-[var(--text-muted)] mb-3">
						Аўтар:{" "}
						<a
							href="https://github.com/alesdrobysh"
							target="_blank"
							rel="noopener noreferrer"
							className="text-[var(--accent)] hover:underline"
						>
							alesdrobysh
						</a>
					</p>
					<p className="text-sm text-[var(--text-muted)] mb-2">База слоў:</p>
					<ul className="text-sm text-[var(--text-muted)] space-y-1 ml-4">
						<li>
							<a
								href="https://github.com/Belarus/GrammarDB"
								target="_blank"
								rel="noopener noreferrer"
								className="text-[var(--accent)] hover:underline"
							>
								Belarus/GrammarDB
							</a>
						</li>
						<li>
							<a
								href="https://github.com/verbumby/slouniki"
								target="_blank"
								rel="noopener noreferrer"
								className="text-[var(--accent)] hover:underline"
							>
								verbumby/slouniki
							</a>
						</li>
					</ul>
				</section>

				<section>
					<h2 className="font-serif text-xl font-semibold text-[var(--text)] mb-3">
						Кантакт
					</h2>
					<p className="text-sm text-[var(--text-muted)]">
						Маеце пытанні або прапановы? Напішыце нам па пошце{" "}
						<a
							href="mailto:support@pobach.app"
							className="text-[var(--accent)] hover:underline"
						>
							support@pobach.app
						</a>
					</p>
				</section>
			</div>

			<div className="w-full max-w-[600px] mx-auto px-4">
				<Footer />
			</div>
		</main>
	);
}
