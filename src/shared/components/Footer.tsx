import Link from "next/link";

export function Footer() {
	return (
		<footer
			className="border-t border-rule"
			style={{ marginTop: "var(--sly-section-gap)" }}
		>
			<div className="page-container py-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
				<p className="font-display italic text-ink-muted">
					З любоўю да мовы і сэнсу.
				</p>
				<div className="flex flex-col items-center sm:items-end gap-3">
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
			</div>
		</footer>
	);
}
