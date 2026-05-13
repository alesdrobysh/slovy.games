"use client";

import { BarChart2, HelpCircle, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/shared/hooks/useTheme";

interface HeaderIconButtonsProps {
	onHelpClick?: () => void;
	statsHref: string;
}

export function HeaderIconButtons({
	onHelpClick,
	statsHref,
}: HeaderIconButtonsProps) {
	const { theme, toggleTheme } = useTheme();

	const btnClass =
		"w-10 h-10 flex items-center justify-center rounded-full hover:bg-rule/50 transition-all duration-300 text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-90";

	return (
		<div className="flex items-center gap-1">
			{onHelpClick && (
				<button
					type="button"
					onClick={onHelpClick}
					aria-label="Як гуляць?"
					className={btnClass}
				>
					<HelpCircle size={20} />
				</button>
			)}
			<Link
				href={statsHref}
				aria-label="Статыстыка"
				className={btnClass}
			>
				<BarChart2 size={20} />
			</Link>
			<button
				onClick={toggleTheme}
				aria-label={
					theme === "light"
						? "Пераключыць на цёмную тэму"
						: "Пераключыць на светлую тэму"
				}
				type="button"
				className={btnClass}
			>
				{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
			</button>
		</div>
	);
}
