import Link from "next/link";

export default function PrivacyPage() {
	return (
		<div className="page-narrow page-container page-section">
				<Link
					href="/"
					className="text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-ink transition-colors mb-6 inline-block no-underline"
				>
					← Назад
				</Link>

				<h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-ink mb-8">
					Прыватнасць
				</h1>

				<div className="space-y-8 text-sm leading-relaxed text-ink-muted">
					<section>
						<h2 className="font-display text-xl font-semibold text-ink mb-3">
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
						<h2 className="font-display text-xl font-semibold text-ink mb-3">
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
						<h2 className="font-display text-xl font-semibold text-ink mb-3">
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
						<h2 className="font-display text-xl font-semibold text-ink mb-3">
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
						<h2 className="font-display text-xl font-semibold text-ink mb-3">
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
						<h2 className="font-display text-xl font-semibold text-ink mb-3">
							Кантакт
						</h2>
						<p>
							Калі ў вас ёсць пытанні пра прыватнасць або вы хочаце выдаліць
							свае дадзеныя, звяжыцеся з намі па пошце{" "}
							<a
								href="mailto:support@pobach.app"
								className="text-valoshka hover:underline"
							>
								support@pobach.app
							</a>
							.
						</p>
					</section>
				</div>
		</div>
	);
}
