import Link from "next/link";
import { Typography } from "@/shared/components/ui/Typography";

export function Footer() {
	return (
		<footer className="border-t border-rule mt-section-gap">
			<div className="page-container py-page-py flex flex-col sm:flex-row items-center sm:items-start justify-between gap-inset-lg">
				<Typography variant="caption" className="font-display text-ink-muted">
					Зроблена з вялікай любоўю да кожнага слова.
				</Typography>
				<div className="flex flex-col items-center sm:items-end gap-inset-sm">
					<nav className="flex items-center gap-flow-lg">
						<Typography variant="overline" as={Link} href="/about">
							Пра праект
						</Typography>
						<Typography variant="overline" as={Link} href="/privacy">
							Прыватнасць
						</Typography>
					</nav>
					<Typography variant="overline" as="p" className="text-ink-soft">
						© {new Date().getFullYear()} Словы
					</Typography>
				</div>
			</div>
		</footer>
	);
}
