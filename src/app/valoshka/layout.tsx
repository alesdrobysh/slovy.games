import type { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		absolute: "Валошка — Слоўная гульня",
	},
	description:
		"Складайце словы з 7 прапанаваных літар. Штодзённая беларуская слоўная гульня.",
	openGraph: {
		title: "Валошка — Слоўная гульня",
		description:
			"Складайце словы з 7 прапанаваных літар. Штодзённая беларуская слоўная гульня.",
	},
};

export default function ValoshkaLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="theme-valoshka">{children}</div>;
}
