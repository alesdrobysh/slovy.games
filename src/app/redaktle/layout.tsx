import type { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		absolute: "Рэдактле — Зашыфраваныя артыкулы Вікіпедыі",
	},
	description:
		"Здагадайцеся, пра які артыкул беларускай Вікіпедыі ідзе гаворка, расшыфроўваючы схаваныя словы. Штодзённая беларуская слоўная гульня.",
	openGraph: {
		title: "Рэдактле — Зашыфраваныя артыкулы Вікіпедыі",
		description:
			"Здагадайцеся, пра які артыкул беларускай Вікіпедыі ідзе гаворка, расшыфроўваючы схаваныя словы.",
	},
};

export default function RedaktleLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="theme-redaktle">{children}</div>;
}
