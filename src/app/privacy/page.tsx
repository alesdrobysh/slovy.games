import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/shared/components/Nav";
import { Typography } from "@/shared/components/ui/Typography";

export const metadata: Metadata = {
	title: "Прыватнасць",
};

export default function PrivacyPage() {
	return (
		<>
			<Nav />
			<div className="page-narrow page-container page-section">
				<Link
					href="/"
					className="text-ink-soft hover:text-ink transition-colors mb-inset-lg inline-block no-underline"
				>
					<Typography variant="overline" as="span">
						Да гульняў
					</Typography>
				</Link>

				<Typography variant="title" as="h1" className="mb-inset-xl">
					Прыватнасць
				</Typography>

				<div className="space-y-inset-xl">
					<section className="space-y-flow-md">
						<Typography variant="body">
							Прыватнасць карыстальнікаў — наш прыярытэт. Мы не збіраем
							асабістых даных і не выкарыстоўваем іх для рэкламы.
						</Typography>
					</section>

					<section className="space-y-flow-md">
						<Typography variant="heading" as="h2">
							Гульнявы прагрэс
						</Typography>
						<Typography variant="body">
							Вашы вынікі і статыстыка захоўваюцца толькі на вашым тэлефоне ці
							камп’ютары. Мы не маем доступу да гэтай інфармацыі.
						</Typography>
					</section>

					<section className="space-y-flow-md">
						<Typography variant="heading" as="h2">
							Аналітыка
						</Typography>
						<Typography variant="body">
							Каб рабіць гульні лепшымі, мы можам збіраць агульныя ананімныя
							даныя (напрыклад, колькасць гульцоў за дзень), калі вы далі на
							гэта згоду.
						</Typography>
						<Typography variant="body">
							Мы не збіраем ніякай інфармацыі, якая магла б дапамагчы пазнаць
							вас ці вызначыць ваша дакладнае месцазнаходжанне.
						</Typography>
					</section>

					<section className="space-y-flow-md">
						<Typography variant="heading" as="h2">
							Кантакт
						</Typography>
						<Typography variant="body">
							Калі ў вас ёсць пытанні, пішыце нам:{" "}
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
