import Link from "next/link";

export default function PrivacyPage() {
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
					Прыватнасць
				</h1>

				<div
					className="space-y-8 text-sm leading-relaxed"
					style={{ color: "var(--color-text-muted)" }}
				>
					<section>
						<h2
							className="font-serif text-xl font-semibold mb-3"
							style={{ color: "var(--color-text)" }}
						>
							Збор дадзеных
						</h2>
						<p className="mb-3">
							Мы збіраем толькі мінімальныя дадзеныя, неабходныя для працы
							гульні:
						</p>
						<ul className="space-y-1 ml-4 list-disc">
							<li>Ідэнтыфікатар сесіі (для захавання прагрэсу)</li>
							<li>Гісторыя вашых спробаў і здагадак</li>
							<li>Статыстыка гульні (колькасць спробаў, час)</li>
						</ul>
						<p className="mt-3">
							Усе дадзеныя захоўваюцца ананімна і не змяшчаюць асабістай
							інфармацыі.
						</p>
					</section>

					<section>
						<h2
							className="font-serif text-xl font-semibold mb-3"
							style={{ color: "var(--color-text)" }}
						>
							Мэта выкарыстання
						</h2>
						<p className="mb-3">Дадзеныя выкарыстоўваюцца выключна для:</p>
						<ul className="space-y-1 ml-4 list-disc">
							<li>Захавання вашага прагрэсу ў гульні</li>
							<li>Паказу статыстыкі і дасягненняў</li>
							<li>Аналізу папулярнасці слоў для паляпшэння слоўніка</li>
							<li>Тэхнічнай падтрымкі працы сайта</li>
						</ul>
					</section>

					<section>
						<h2
							className="font-serif text-xl font-semibold mb-3"
							style={{ color: "var(--color-text)" }}
						>
							Аналітыка
						</h2>
						<p className="mb-3">
							Мы выкарыстоўваем Vercel Analytics для збору агульнай статыстыкі
							наведванняў сайта. Гэта дазваляе нам разумець, як карыстальнікі
							выкарыстоўваюць гульню, і паляпшаць яе.
						</p>
						<p className="mb-3">
							Vercel Analytics не збірае асабістых дадзеных і не выкарыстоўвае
							cookies.
						</p>
						<p>
							Мы таксама выкарыстоўваем PostHog для аналізу гульнявой
							актыўнасці: колькасць спробаў, выкарыстанне падказак, водгукі пра
							словы. Усе дадзеныя ананімныя і не ўтрымліваюць асабістай
							інфармацыі.
						</p>
					</section>

					<section>
						<h2
							className="font-serif text-xl font-semibold mb-3"
							style={{ color: "var(--color-text)" }}
						>
							Доступ да дадзеных
						</h2>
						<p className="mb-3">
							Вашы дадзеныя не перадаюцца трэцім асобам. Мы не выкарыстоўваем
							рэкламу і не прадаем інфармацыю знешнім сэрвісам.
						</p>
						<p>
							Толькі адміністратары сайта маюць доступ да тэхнічных дадзеных для
							падтрымкі працы сістэмы.
						</p>
					</section>

					<section>
						<h2
							className="font-serif text-xl font-semibold mb-3"
							style={{ color: "var(--color-text)" }}
						>
							Захаванне дадзеных
						</h2>
						<p className="mb-3">
							Дадзеныя захоўваюцца ананімна без IP-адрасоў або іншай
							ідэнтыфікуючай інфармацыі. Вы можаце ачысціць свой прагрэс у любы
							момант праз налады браўзера.
						</p>
						<p className="mb-3">
							Мы не захоўваем IP-адрасы, геалакацыю або іншую тэхнічную
							інфармацыю пра карыстальнікаў.
						</p>
						<p>
							Мы не збіраем дакладную геалакацыю (GPS). Мы вызначаем толькі
							прыблізнае месцазнаходжанне (Краіна, Горад) на аснове IP-адраса
							для агульнай статыстыкі. Самі IP-адрасы мы не захоўваем.
						</p>
					</section>

					<section>
						<h2
							className="font-serif text-xl font-semibold mb-3"
							style={{ color: "var(--color-text)" }}
						>
							Кантакт
						</h2>
						<p>
							Калі ў вас ёсць пытанні пра прыватнасць або вы хочаце выдаліць
							свае дадзеныя, звяжыцеся з намі па пошце{" "}
							<a
								href="mailto:support@pobach.app"
								className="hover:underline"
								style={{ color: "var(--color-accent)" }}
							>
								support@pobach.app
							</a>
							.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
