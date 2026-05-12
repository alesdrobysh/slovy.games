"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderIconButtons } from "@/shared/components/HeaderIconButtons";

export default function Header({ onHelpClick }: { onHelpClick?: () => void }) {
	const pathname = usePathname();
	const isHome = pathname === "/pobach";

	return (
		<div className="max-w-2xl mx-auto w-full px-5 sm:px-8 py-4 sm:py-6">
			<div className="mb-4 animate-fade-in-up">
				<Link
					href="/"
					className="text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-ink transition-colors no-underline"
				>
					← Усе гульні
				</Link>
				<div className="flex items-baseline justify-between mt-4 gap-4">
					<div>
						<h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-pobach">
							{isHome ? "Побач" : "Статыстыка"}
						</h1>
						{isHome && (
							<p className="text-sm text-ink-muted mt-2">
								Семантычнае адгадванне
							</p>
						)}
					</div>
					<HeaderIconButtons
						onHelpClick={onHelpClick}
						statsHref="/pobach/stats"
					/>
				</div>
			</div>
		</div>
	);
}
