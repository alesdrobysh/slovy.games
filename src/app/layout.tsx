import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { EB_Garamond, Manrope, Roboto_Slab } from "next/font/google";
import { BannerProvider } from "@/shared/components/BannerContext";
import CookieBanner from "@/shared/components/CookieBanner";
import { ConditionalHubNav } from "@/shared/components/ConditionalHubNav";
import { Footer } from "@/shared/components/Footer";
import { ThemeProvider } from "@/shared/hooks/useTheme";
import { PostHogProvider } from "@/shared/lib/analytics";
import "./globals.css";

const manrope = Manrope({
	subsets: ["latin", "cyrillic"],
	variable: "--font-manrope",
	display: "swap",
});

const ebGaramond = EB_Garamond({
	subsets: ["latin", "cyrillic"],
	weight: ["400", "700"],
	style: ["normal", "italic"],
	variable: "--font-eb-garamond",
	display: "swap",
});

const robotoSlab = Roboto_Slab({
	subsets: ["latin", "cyrillic"],
	variable: "--font-roboto-slab",
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

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="be"
			suppressHydrationWarning
			className={`${manrope.variable} ${ebGaramond.variable} ${robotoSlab.variable}`}
		>
			<body className="min-h-screen flex flex-col">
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var t=localStorage.getItem('theme');var dark=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(dark)document.documentElement.classList.add('dark');}catch(e){}})();`,
					}}
				/>
				<ThemeProvider>
					<PostHogProvider>
						<BannerProvider>
							<ConditionalHubNav />
							<main className="flex-1">{children}</main>
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
