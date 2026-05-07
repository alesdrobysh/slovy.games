import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Валошка",
	description:
		"Складайце словы з 7 прапанаваных літар. Штодзённая беларуская слоўная гульня.",
};

export default function ValoshkaLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="theme-valoshka">{children}</div>;
}
