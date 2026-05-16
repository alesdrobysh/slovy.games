import Link from "next/link";
import { Nav } from "@/shared/components/Nav";
import { Typography } from "@/shared/components/ui/Typography";

export default function PrivacyPage() {
	return (
		<>
		<Nav />
		<div className="page-narrow page-container page-section">
			<Link
				href="/"
				className="text-ink-soft hover:text-ink transition-colors mb-inset-lg inline-block no-underline"
			>
				<Typography variant="overline" as="span">← Назад</Typography>
			</Link>

			<Typography variant="title" as="h1" className="mb-inset-xl">
				Прыватнасць
			</Typography>

			<div className="space-y-inset-xl">
				<section className="space-y-flow-md">
					<Typography variant="heading" as="h2">
						Збор даных
					</Typography>
					<Typography variant="body">
						Мы збіраем толькі мінімальныя даныя, неабходныя для працы гульні:
					</Typography>
					<ul className="space-y-flow-xs ml-flow-lg list-disc">
						<Typography variant="body" as="li">Ідэнтыфікатар сесіі (для захавання прагрэсу)</Typography>
						<Typography variant="body" as="li">Гісторыя вашых спробаў і здагадак</Typography>
						<Typography variant="body" as="li">Статыстыка гульні (колькасць спробаў, час)</Typography>
					</ul>
					<Typography variant="body">
						Усе даныя захоўваюцца ананімна і не змяшчаюць асабістай
						інфармацыі.
					</Typography>
				</section>

				<section className="space-y-flow-md">
					<Typography variant="heading" as="h2">
						Мэта выкарыстання
					</Typography>
					<Typography variant="body">Даныя выкарыстоўваюцца выключна для:</Typography>
					<ul className="space-y-flow-xs ml-flow-lg list-disc">
						<Typography variant="body" as="li">Захавання вашага прагрэсу ў гульні</Typography>
						<Typography variant="body" as="li">Паказу статыстыкі і дасягненняў</Typography>
						<Typography variant="body" as="li">Аналізу папулярнасці слоў для паляпшэння слоўніка</Typography>
						<Typography variant="body" as="li">Тэхнічнай падтрымкі працы сайта</Typography>
					</ul>
				</section>

				<section className="space-y-flow-md">
					<Typography variant="heading" as="h2">
						Аналітыка
					</Typography>
					<Typography variant="body">
						Мы выкарыстоўваем Vercel Analytics для збору агульнай статыстыкі
						наведванняў сайта. Гэта дазваляе нам разумець, як карыстальнікі
						выкарыстоўваюць гульню, і паляпшаць яе.
					</Typography>
					<Typography variant="body">
						Vercel Analytics не збірае асабістых даных і не выкарыстоўвае
						cookies.
					</Typography>
					<Typography variant="body">
						Мы таксама выкарыстоўваем PostHog для аналізу гульнявой актыўнасці:
						колькасць спробаў, выкарыстанне падказак, водгукі пра словы. Усе
						даныя ананімныя і не ўтрымліваюць асабістай інфармацыі.
					</Typography>
				</section>

				<section className="space-y-flow-md">
					<Typography variant="heading" as="h2">
						Доступ да даных
					</Typography>
					<Typography variant="body">
						Вашы даныя не перадаюцца трэцім асобам. Мы не выкарыстоўваем
						рэкламу і не прадаем інфармацыю знешнім сэрвісам.
					</Typography>
					<Typography variant="body">
						Толькі адміністратары сайта маюць доступ да тэхнічных даных для
						падтрымкі працы сістэмы.
					</Typography>
				</section>

				<section className="space-y-flow-md">
					<Typography variant="heading" as="h2">
						Захаванне даных
					</Typography>
					<Typography variant="body">
						Даныя захоўваюцца ананімна без IP-адрасоў або іншай
						ідэнтыфікуючай інфармацыі. Вы можаце ачысціць свой прагрэс у любы
						момант праз налады браўзера.
					</Typography>
					<Typography variant="body">
						Мы не захоўваем IP-адрасы, геалакацыю або іншую тэхнічную інфармацыю
						пра карыстальнікаў.
					</Typography>
					<Typography variant="body">
						Мы не збіраем дакладную геалакацыю (GPS). Мы вызначаем толькі
						прыблізнае месцазнаходжанне (Краіна, Горад) на аснове IP-адраса для
						агульнай статыстыкі. Самі IP-адрасы мы не захоўваем.
					</Typography>
				</section>

				<section className="space-y-flow-md">
					<Typography variant="heading" as="h2">
						Кантакт
					</Typography>
					<Typography variant="body">
						Калі ў вас ёсць пытанні пра прыватнасць або вы хочаце выдаліць свае
						даныя, звяжыцеся з намі па пошце{" "}
						<a
							href="mailto:support@slovy.games"
							className="text-valoshka hover:underline"
						>
							support@slovy.games
						</a>
						.
					</Typography>
				</section>
			</div>
		</div>
		</>
	);
}
