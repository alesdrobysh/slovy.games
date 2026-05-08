import Link from "next/link";

export default function AboutPage() {
	return (
		<div
			className="min-h-screen flex flex-col"
			style={{ background: "var(--color-bg)" }}
		>
			<div className="mx-auto w-full max-w-[600px] px-4 py-8 flex-1">
				<Link
					href="/"
					className="inline-flex items-center gap-1 text-sm mb-6 hover:opacity-70 transition-opacity"
					style={{ color: "var(--color-text-muted)" }}
				>
					← Назад
				</Link>

				<h1
					className="text-2xl font-bold mb-8"
					style={{
						fontFamily: "var(--font-display)",
						color: "var(--color-text)",
					}}
				>
					Пра гульні
				</h1>

				<div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
					<section>
						<h2
							className="font-serif text-xl font-semibold mb-3"
							style={{ color: "var(--color-text)" }}
						>
							Што такое Словы?
						</h2>
						<p className="mb-3">
							Словы — гэта збор штодзённых беларускіх слоўных гульняў. Кожная
							гульня прапануе свой унікальны спосаб праверыць вашы веды і
							інтуіцыю.
						</p>
						<ul className="space-y-2 ml-4 list-disc">
							<li>
								<strong>Валошка</strong> — складзіце як мага больш слоў з
								пераблытаных літар.
							</li>
							<li>
								<strong>Побач</strong> — здагадайцеся слова па сэнсавай
								блізкасці.
							</li>
						</ul>
					</section>

					<section>
						<h2
							className="font-serif text-xl font-semibold mb-3"
							style={{ color: "var(--color-text)" }}
						>
							Як гэта працуе?
						</h2>
						<p>
							Побач выкарыстоўвае алгарытмы машыннага навучання для вызначэння
							семантычнай блізкасці слоў. Мадэль аналізуе, як часта словы
							ўжываюцца разам у тэкстах, і будуе &ldquo;карту&rdquo; іх сэнсаў.
						</p>
					</section>

					<section>
						<h2
							className="font-serif text-xl font-semibold mb-3"
							style={{ color: "var(--color-text)" }}
						>
							Стваральнік
						</h2>
						<p className="mb-2">Зроблена з ❤️ да роднай мовы</p>
						<p className="mb-2">
							Натхненнем сталі{" "}
							<a
								href="https://contexto.me"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline"
								style={{ color: "var(--color-accent)" }}
							>
								Contexto
							</a>{" "}
							і{" "}
							<a
								href="https://semantle.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline"
								style={{ color: "var(--color-accent)" }}
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
								className="hover:underline"
								style={{ color: "var(--color-accent)" }}
							>
								alesdrobysh
							</a>
						</p>
						<p className="mb-2">База слоў:</p>
						<ul className="space-y-1 ml-4">
							<li>
								<a
									href="https://github.com/Belarus/GrammarDB"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:underline"
									style={{ color: "var(--color-accent)" }}
								>
									Belarus/GrammarDB
								</a>
							</li>
							<li>
								<a
									href="https://github.com/verbumby/slouniki"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:underline"
									style={{ color: "var(--color-accent)" }}
								>
									verbumby/slouniki
								</a>
							</li>
						</ul>
					</section>

					<section>
						<h2
							className="font-serif text-xl font-semibold mb-3"
							style={{ color: "var(--color-text)" }}
						>
							Кантакт
						</h2>
						<p>
							Маеце пытанні або прапановы? Напішыце нам па пошце{" "}
							<a
								href="mailto:support@pobach.app"
								className="hover:underline"
								style={{ color: "var(--color-accent)" }}
							>
								support@pobach.app
							</a>
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
