import type { Metadata } from "next";
import { BannerProvider } from "@/games/pobach/providers/BannerContext";

export const metadata: Metadata = {
	title: "Побач",
	description: "Здагадайцеся слова па сэнсавай блізкасці. Штодзённая беларуская слоўная гульня.",
};

export default function PobachLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="theme-pobach">
			<BannerProvider>
				{children}
			</BannerProvider>
		</div>
	);
}
