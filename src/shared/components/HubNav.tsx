"use client";

import { BarChart2, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/shared/hooks/useTheme";

const NAV_LINKS = [
	{ href: "/", label: "Гульні" },
	{ href: "/stats", label: "Статыстыка" },
	{ href: "/about", label: "Пра праект" },
];

const MONTHS_GEN = [
	"студзеня",
	"лютага",
	"сакавіка",
	"красавіка",
	"траўня",
	"чэрвеня",
	"ліпеня",
	"жніўня",
	"верасня",
	"кастрычніка",
	"лістапада",
	"снежня",
];

const WEEKDAYS = [
	"Нядзеля",
	"Панядзелак",
	"Аўторак",
	"Серада",
	"Чацвер",
	"Пятніца",
	"Субота",
];

function formatTodayBe(): string {
	const d = new Date();
	const weekday = WEEKDAYS[d.getDay()];
	const month = MONTHS_GEN[d.getMonth()];
	return `${weekday}, ${d.getDate()} ${month}`;
}

export function HubNav() {
	const pathname = usePathname();
	const { theme, toggleTheme } = useTheme();

	return (
		<header className="sticky top-0 z-30 border-b border-rule bg-paper/80 backdrop-blur-sm">
			<div className="mx-auto flex max-w-screen-xl items-center justify-between px-5 sm:px-8 h-16 gap-4">
				<div className="flex items-center gap-8">
					<Link
						href="/"
						className="font-display text-2xl font-semibold tracking-tight text-ink no-underline"
					>
						Словы
					</Link>
					<nav className="hidden sm:flex items-center gap-6 text-sm">
						{NAV_LINKS.map((link) => {
							const active =
								link.href === "/"
									? pathname === "/"
									: pathname.startsWith(link.href);
							return (
								<Link
									key={link.href}
									href={link.href}
									className={`transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm ${
										active
											? "text-ink font-medium"
											: "text-ink-muted hover:text-ink"
									}`}
								>
									{link.label}
								</Link>
							);
						})}
					</nav>
				</div>

				<div className="flex items-center gap-3">
					<span className="hidden sm:block text-xs uppercase tracking-[0.18em] text-ink-soft font-medium">
						{formatTodayBe()}
					</span>
					<Link
						href="/stats"
						aria-label="Статыстыка"
						className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-rule transition-colors text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
					>
						<BarChart2 size={18} />
					</Link>
					<button
						onClick={toggleTheme}
						aria-label={
							theme === "light"
								? "Пераключыць на цёмную тэму"
								: "Пераключыць на светлую тэму"
						}
						type="button"
						className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-rule transition-colors text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
					>
						{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
					</button>
				</div>
			</div>
		</header>
	);
}
