"use client";

import Footer from "@/games/pobach/components/Footer";
import Header from "@/games/pobach/components/Header";

export default function PobachPrivacyPage() {
	return (
		<main style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
			<Header />
			<div
				className="mx-auto max-w-[600px] px-4 py-8 text-sm leading-relaxed"
				style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}
			>
				<h2
					className="text-xl font-bold mb-4"
					style={{ fontFamily: "var(--font-display)" }}
				>
					Палітыка прыватнасці
				</h2>
				<p className="mb-4">
					Мы збіраем мінімальныя дадзеныя для функцыянавання гульні:
					ідэнтыфікатар сесіі, гісторыю здагадак і статыстыку гульні.
				</p>

				<h3 className="text-lg font-bold mb-2">Якія дадзеныя збіраюцца</h3>
				<ul className="list-disc pl-5 mb-4 space-y-1">
					<li>Унікальны ідэнтыфікатар сесіі (згенераваны выпадкова)</li>
					<li>Гісторыя здагадак для бягучай гульні</li>
					<li>Статыстыка перамог і серый</li>
				</ul>

				<h3 className="text-lg font-bold mb-2">Як выкарыстоўваюцца дадзеныя</h3>
				<ul className="list-disc pl-5 mb-4 space-y-1">
					<li>Захаванне прагрэсу гульні ў браўзэры</li>
					<li>Паляпшэнне гульнявога досведу</li>
					<li>Аналітыка наведвання (Vercel Analytics + PostHog)</li>
				</ul>

				<h3 className="text-lg font-bold mb-2">Доступ да дадзеных</h3>
				<p className="mb-4">
					Усе дадзеныя захоўваюцца лакальна ў вашым браўзэры. Аналітычныя
					дадзеныя даступныя толькі распрацоўшчыку для аналізу выкарыстання.
				</p>

				<h3 className="text-lg font-bold mb-2">Захаванне дадзеных</h3>
				<p className="mb-4">
					Лакальныя дадзеныя захоўваюцца пакуль вы не ачысціце дадзеныя
					браўзэра. Вы можаце выдаліць іх праз налады браўзэра.
				</p>

				<p style={{ color: "var(--color-text-muted)" }}>
					Пытанні:{" "}
					<a
						href="mailto:support@pobach.app"
						style={{ color: "var(--color-accent)" }}
					>
						support@pobach.app
					</a>
				</p>
			</div>
			<Footer />
		</main>
	);
}
