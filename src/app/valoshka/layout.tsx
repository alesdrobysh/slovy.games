import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Валошка — складай беларускія словы з літар",
	description:
		"Складайце беларускія словы з сямі літар у штодзённай гульні «Валошка». Бясплатна, анлайн і без рэгістрацыі.",
	openGraph: {
		title: "Валошка — складай беларускія словы з літар | Словы",
		description:
			"Складайце беларускія словы з сямі літар у штодзённай гульні «Валошка». Бясплатна, анлайн і без рэгістрацыі.",
	},
};

export default function ValoshkaLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="theme-valoshka">{children}</div>;
}
