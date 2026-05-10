"use client";

import { BarChart2, HelpCircle, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/shared/hooks/useTheme";

interface HeaderIconButtonsProps {
	onHelpClick?: () => void;
	statsHref: string;
}

/**
 * Standard header icon buttons shared across games:
 * - How to play (optional)
 * - Stats
 * - Theme toggle (dark/light)
 */
export function HeaderIconButtons({
	onHelpClick,
	statsHref,
}: HeaderIconButtonsProps) {
	const { theme, toggleTheme } = useTheme();

	return (
		<div className="flex items-center gap-1">
			{onHelpClick && (
				<button
					type="button"
					onClick={onHelpClick}
					aria-label="Як гуляць?"
					className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--sly-border)] transition-colors text-[var(--sly-text)]"
				>
					<HelpCircle size={18} />
				</button>
			)}
			<Link
				href={statsHref}
				aria-label="Статыстыка"
				className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--sly-border)] transition-colors text-[var(--sly-text)]"
			>
				<BarChart2 size={18} />
			</Link>
			<button
				onClick={toggleTheme}
				aria-label={`Пераключыць на ${theme === "light" ? "цёмную" : "светлую"} тэму`}
				type="button"
				className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--sly-border)] transition-colors text-[var(--sly-text)]"
			>
				{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
			</button>
		</div>
	);
}
