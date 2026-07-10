import type { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		absolute: "Сакрэтна — Зашыфраваныя артыкулы Вікіпедыі",
	},
	description:
		"Здагадайцеся, пра які артыкул беларускай Вікіпедыі ідзе гаворка, расшыфроўваючы схаваныя словы. Штодзённая беларуская слоўная гульня.",
	openGraph: {
		title: "Сакрэтна — Зашыфраваныя артыкулы Вікіпедыі",
		description:
			"Здагадайцеся, пра які артыкул беларускай Вікіпедыі ідзе гаворка, расшыфроўваючы схаваныя словы.",
	},
};

export default function SakretnaLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="theme-sakretna">{children}</div>;
}
