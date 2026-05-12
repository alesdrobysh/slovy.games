import Link from "next/link";

export function Footer() {
	return (
		<footer className="mt-24 border-t border-rule">
			<div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
				<p className="font-display italic text-ink-muted">
					З любоўю да мовы і сэнсу.
				</p>
				<nav className="flex items-center gap-4">
					<Link
						href="/about"
						className="text-xs text-ink-muted hover:text-ink transition-colors"
					>
						Пра праект
					</Link>
					<Link
						href="/privacy"
						className="text-xs text-ink-muted hover:text-ink transition-colors"
					>
						Прыватнасць
					</Link>
				</nav>
				<p className="text-[10px] uppercase tracking-[0.22em] text-ink-soft">
					© {new Date().getFullYear()} Словы
				</p>
			</div>
		</footer>
	);
}
