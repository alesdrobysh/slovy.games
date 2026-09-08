import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Побач — адгадай беларускае слова па сэнсе",
	description:
		"Адгадайце беларускае слова па сэнсе ў штодзённай гульні «Побач». Бясплатна, анлайн і без рэгістрацыі.",
	openGraph: {
		title: "Побач — адгадай беларускае слова па сэнсе | Словы",
		description:
			"Адгадайце беларускае слова па сэнсе ў штодзённай гульні «Побач». Бясплатна, анлайн і без рэгістрацыі.",
	},
};

export default function PobachLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="theme-pobach">{children}</div>;
}
