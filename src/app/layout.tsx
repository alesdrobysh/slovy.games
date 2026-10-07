import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Literata, Wix_Madefor_Text } from "next/font/google";
import { Footer } from "@/app/Footer";
import { BannerProvider } from "@/shared/components/BannerContext";
import CookieBanner from "@/shared/components/CookieBanner";
import ServiceWorkerRegistration from "@/shared/components/ServiceWorkerRegistration";
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
		default: "Словы — беларускія слоўныя гульні анлайн",
	},
	description:
		"Беларускія слоўныя гульні анлайн: складайце словы з літар у «Валошцы» і адгадвайце словы па сэнсе ў «Побач». Бясплатна, штодня, без рэгістрацыі.",
	openGraph: {
		title: "Словы — беларускія слоўныя гульні анлайн",
		description:
			"Беларускія слоўныя гульні анлайн: складайце словы ў «Валошцы» і адгадвайце па сэнсе ў «Побач».",
		type: "website",
	},
};

// Let Android shrink the layout viewport under the on-screen keyboard so
// fixed controls rise above it. iOS ignores this; see useVirtualKeyboard.
export const viewport: Viewport = {
	interactiveWidget: "resizes-content",
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');var dark=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(dark)document.documentElement.dataset.theme='dark';}catch(e){}})();`;

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
				<meta name="theme-color" content="#f8f7f4" />
				<script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
				<ThemeProvider>
					<PostHogProvider>
						<BannerProvider>
							<div className="flex-1">{children}</div>
							<Footer />
							<CookieBanner />
							<ServiceWorkerRegistration />
							<Analytics />
						</BannerProvider>
					</PostHogProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
