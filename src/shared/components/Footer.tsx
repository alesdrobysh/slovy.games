"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const POABACH_LINKS = [
	{ href: "/about", label: "Пра гульню" },
	{ href: "/privacy", label: "Прыватнасць" },
	{ href: "/pobach/stats", label: "Статыстыка" },
];

export function Footer() {
	const pathname = usePathname();

	const isPobach = pathname?.startsWith("/pobach");
	const isValoshka = pathname?.startsWith("/valoshka");
	const isHub = pathname === "/";

	if (isPobach) {
		const links = POABACH_LINKS.filter((l) => l.href !== pathname);
		return (
			<footer className="border-t border-[var(--sly-accent)]/20 pt-6 mt-12 mb-8 text-center text-sm text-[var(--sly-text-muted)]">
				<p className="mb-3">Зроблена з ❤️ да роднай мовы</p>
				<nav className="flex justify-center flex-wrap">
					{links.map((l, i) => (
						<span key={l.href} className="flex items-center">
							{i > 0 && <span className="mx-2">/</span>}
							<Link
								href={l.href}
								className="hover:text-[var(--sly-accent)] transition-colors"
							>
								{l.label}
							</Link>
						</span>
					))}
				</nav>
			</footer>
		);
	}

	if (isValoshka) {
		return null;
	}

	return (
		<footer
			className="w-full border-t mt-auto text-xs sm:text-sm"
			style={{
				borderColor: "var(--sly-border)",
				color: "var(--sly-text-muted)",
			}}
		>
			<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
				<span>Зроблена з ❤️ да роднай мовы</span>
				{isHub && (
					<nav className="flex items-center gap-3">
						<Link
							href="/about"
							className="hover:text-[var(--sly-accent)] transition-colors"
						>
							Пра гульні
						</Link>
						<Link
							href="/privacy"
							className="hover:text-[var(--sly-accent)] transition-colors"
						>
							Прыватнасць
						</Link>
					</nav>
				)}
			</div>
		</footer>
	);
}
