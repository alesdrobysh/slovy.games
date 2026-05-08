"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
	const pathname = usePathname();

	const isPobach = pathname?.startsWith("/pobach");
	const isValoshka = pathname?.startsWith("/valoshka");
	const themeClass = isPobach ? "theme-pobach" : isValoshka ? "theme-valoshka" : "";

	if (isPobach) {
		return (
			<footer
				className={`${themeClass} w-full border-t pt-6 mt-12 mb-8 text-center text-sm`}
				style={{
					borderColor: "color-mix(in srgb, var(--color-accent) 20%, transparent)",
					color: "var(--color-text-muted)",
				}}
			>
				<p className="mb-3">Зроблена з ❤️ да роднай мовы</p>
				<nav className="flex justify-center flex-wrap">
					<span className="flex items-center">
						<Link href="/pobach/about" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>
							Пра гульню
						</Link>
					</span>
					<span className="flex items-center">
						<span className="mx-2">/</span>
						<Link href="/pobach/privacy" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>
							Прыватнасць
						</Link>
					</span>
					<span className="flex items-center">
						<span className="mx-2">/</span>
						<Link href="/pobach/stats" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>
							Статыстыка
						</Link>
					</span>
				</nav>
			</footer>
		);
	}

	if (isValoshka) {
		return null;
	}

	return (
		<footer className="w-full border-t mt-auto" style={{ borderColor: "var(--color-border)" }}>
			<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 text-xs sm:text-sm">
				<span style={{ color: "var(--color-text-muted)" }}>
					Зроблена з ❤️ да роднай мовы
				</span>
			</div>
		</footer>
	);
}
