"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderIconButtons } from "@/shared/components/HeaderIconButtons";

export default function Header({ onHelpClick }: { onHelpClick?: () => void }) {
	const pathname = usePathname();
	const isHome = pathname === "/pobach";
	const title = pathname === "/pobach/stats" ? "Статыстыка" : "ПОБАЧ";

	return (
		<header className="border-b border-[var(--sly-border)] bg-[var(--sly-bg)]">
			<div className="flex items-center justify-between px-4 py-3 max-w-[600px] mx-auto">
				{!isHome ? (
					<div className="flex items-center gap-2">
						<Link
							href="/"
							aria-label="Назад"
							className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--sly-border)] transition-colors text-[var(--sly-text)]"
						>
							<ArrowLeft size={18} />
						</Link>
						<span className="font-serif font-bold text-[var(--sly-text)] tracking-wide text-xl leading-none">
							{title}
						</span>
					</div>
				) : (
					<span className="font-serif font-bold text-[var(--sly-accent)] tracking-wider text-[1.75rem] leading-none">
						{title}
					</span>
				)}

				<HeaderIconButtons
					onHelpClick={onHelpClick}
					statsHref="/pobach/stats"
				/>
			</div>
		</header>
	);
}
