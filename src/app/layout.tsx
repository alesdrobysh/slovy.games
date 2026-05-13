import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Literata, Wix_Madefor_Text } from "next/font/google";
import { BannerProvider } from "@/shared/components/BannerContext";
import CookieBanner from "@/shared/components/CookieBanner";
import { Footer } from "@/shared/components/Footer";
import { GameNavProvider } from "@/shared/components/GameNavContext";
import { HubNav } from "@/shared/components/HubNav";
import { ThemeProvider } from "@/shared/hooks/useTheme";
import { PostHogProvider } from "@/shared/lib/analytics";
import "./globals.css";

const wixMadeforText = Wix_Madefor_Text({
	subsets: ["latin", "cyrillic"],
	style: ["normal", "italic"],
	variable: "--font-sans",
	display: "swap",
});

const literata = Literata({
	subsets: ["latin", "cyrillic"],
	style: ["normal", "italic"],
	variable: "--font-display",
	display: "swap",
});

export const metadata: Metadata = {
	title: {
		template: "%s | Словы",
		default: "Словы — Беларускія слоўныя гульні",
	},
	description:
		"Валошка і Побач — штодзённыя беларускія слоўныя гульні. Складайце словы і здагадвайцеся па сэнсе.",
	openGraph: {
		title: "Словы — Беларускія слоўныя гульні",
		description: "Валошка і Побач — штодзённыя беларускія слоўныя гульні.",
		type: "website",
	},
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');var dark=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(dark)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="be"
			suppressHydrationWarning
			className={`${wixMadeforText.variable} ${literata.variable}`}
		>
			<body className="min-h-screen flex flex-col bg-paper text-ink">
				<meta name="theme-color" content="#f5f0e8" />
				<script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
				<ThemeProvider>
					<PostHogProvider>
						<BannerProvider>
							<GameNavProvider>
								<HubNav />
								<main className="flex-1">{children}</main>
							</GameNavProvider>
							<Footer />
							<CookieBanner />
							<Analytics />
						</BannerProvider>
					</PostHogProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
