"use client";

import Header from "@/games/pobach/components/Header";
import { Footer } from "@/games/pobach/components/Footer";

export default function PobachAboutPage() {
	return (
		<main style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
			<Header title="Пра гульню" />
			<div
				className="mx-auto max-w-[600px] px-4 py-8 text-sm leading-relaxed"
				style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}
			>
				<h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
					Што такое Побач?
				</h2>
				<p className="mb-4">
					Побач — гэта штодзённая гульня, у якой трэба адгадаць слова па сэнсавай блізкасці.
					Кожны дзень новае слова. Чым бліжэй ваша здагадка да мэтавага слова — тым вышэй яна ў рэйтынгу.
				</p>

				<h3 className="text-lg font-bold mb-2">Як гуляць</h3>
				<ul className="list-disc pl-5 mb-4 space-y-2">
					<li>Увядзіце беларускае слова і націсніце Enter.</li>
					<li>Гульня пакажа, наколькі яно блізкае да мэтавага слова.</li>
					<li>Ранг паказвае пазіцыю сярод усіх слоў слоўніка.</li>
					<li>Працягвайце ўводзіць новыя словы, пакуль не здагадаецеся.</li>
				</ul>

				<h3 className="text-lg font-bold mb-2">Крыніцы</h3>
				<p className="mb-4">
					Натхнёна гульнямі Contexto і Semantle. Слоўнік на аснове GrammarDB і verbum.by/slouniki.
					Аўтар: <a href="https://alesdrobysh.com" style={{ color: "var(--color-accent)" }}>alesdrobysh</a>.
					Сувязь: <a href="mailto:support@pobach.app" style={{ color: "var(--color-accent)" }}>support@pobach.app</a>.
				</p>
			</div>
			<Footer />
		</main>
	);
}
