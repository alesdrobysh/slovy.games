"use client";

import {
	BarChart2,
	ChevronLeft,
	HelpCircle,
	Menu,
	Moon,
	Sun,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useGameNav } from "@/shared/components/GameNavContext";
import { useTheme } from "@/shared/hooks/useTheme";

const NAV_LINKS = [
	{ href: "/", label: "Гульні" },
	{ href: "/stats", label: "Статыстыка" },
	{ href: "/about", label: "Пра праект" },
];

const GAME_ROUTES: Record<
	string,
	{ title: string; accentClass: string; statsHref: string }
> = {
	"/pobach": {
		title: "Побач",
		accentClass: "text-pobach",
		statsHref: "/pobach/stats",
	},
	"/valoshka": {
		title: "Валошка",
		accentClass: "text-valoshka",
		statsHref: "/valoshka/stats",
	},
};

function getGameConfig(pathname: string) {
	return (
		Object.entries(GAME_ROUTES).find(([route]) =>
			pathname.startsWith(route),
		)?.[1] ?? null
	);
}

export function HubNav() {
	const pathname = usePathname();
	const { theme, toggleTheme } = useTheme();
	const { onHelpClick, extraActions } = useGameNav();
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLElement>(null);

	const game = getGameConfig(pathname);

	useEffect(() => {
		if (!menuOpen) return;
		function handleClickOutside(e: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setMenuOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [menuOpen]);

	// Close menu on navigation
	useEffect(() => {
		setMenuOpen(false);
	}, [pathname]);

	const iconClass =
		"w-10 h-10 flex items-center justify-center rounded-full hover:bg-rule/50 transition-all duration-300 text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/30 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-90";

	return (
		<header ref={menuRef} className="sticky top-0 z-30 border-b border-rule/60 bg-paper/70 backdrop-blur-md">
			<div className="mx-auto flex max-w-screen-xl items-center h-16 sm:h-20 px-4 sm:px-8 gap-4">
				{game ? (
					/* ── Game mode ── */
					<>
						<div className="flex items-center shrink-0">
							<Link
								href="/"
								aria-label="Усе гульні"
								className={iconClass}
							>
								<ChevronLeft size={22} strokeWidth={2.5} />
							</Link>
						</div>

						<span
							className={`flex-1 text-center font-display text-xl sm:text-2xl font-semibold tracking-tight leading-none ${game.accentClass}`}
						>
							{game.title}
						</span>

						<div className="flex items-center gap-1 shrink-0">
							{extraActions}
							{onHelpClick && (
								<button
									type="button"
									onClick={onHelpClick}
									aria-label="Як гуляць?"
									className={iconClass}
								>
									<HelpCircle size={20} />
								</button>
							)}
							<Link
								href={game.statsHref}
								aria-label="Статыстыка"
								className={iconClass}
							>
								<BarChart2 size={20} />
							</Link>
							<button
								onClick={toggleTheme}
								type="button"
								className={iconClass}
							>
								{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
							</button>
							<button
								type="button"
								onClick={() => setMenuOpen((v) => !v)}
								className={iconClass}
							>
								{menuOpen ? <X size={20} /> : <Menu size={20} />}
							</button>
						</div>
					</>
				) : (
					/* ── Hub mode: Editorial Masthead ── */
					<>
						<div className="flex-1 flex items-center gap-8">
							<Link
								href="/"
								className="font-display text-3xl sm:text-4xl font-bold tracking-tighter text-ink no-underline hover:opacity-80 transition-opacity"
							>
								Словы
							</Link>
							<nav className="hidden md:flex items-center gap-8">
								{NAV_LINKS.map((link) => {
									const active =
										link.href === "/"
											? pathname === "/"
											: pathname.startsWith(link.href);
									return (
										<Link
											key={link.href}
											href={link.href}
											className={`text-xs uppercase tracking-[0.2em] font-semibold transition-all no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/30 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm ${
												active
													? "text-ink border-b-2 border-ink pt-0.5"
													: "text-ink-muted hover:text-ink"
											}`}
										>
											{link.label}
										</Link>
									);
								})}
							</nav>
						</div>

						<div className="flex items-center gap-1">
							<button
								onClick={toggleTheme}
								type="button"
								className={iconClass}
							>
								{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
							</button>
							<button
								type="button"
								onClick={() => setMenuOpen((v) => !v)}
								className={iconClass}
							>
								{menuOpen ? <X size={20} /> : <Menu size={20} />}
							</button>
						</div>
					</>
				)}
			</div>

			{/* Mobile dropdown menu */}
			{menuOpen && (
				<div className="sm:hidden absolute top-full left-0 right-0 bg-paper border-b border-rule shadow-sm z-40">
					<nav className="flex flex-col px-4 py-3 gap-1">
						{NAV_LINKS.map((link) => {
							const active =
								link.href === "/"
									? pathname === "/"
									: pathname.startsWith(link.href);
							return (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setMenuOpen(false)}
									className={`py-2.5 text-sm no-underline transition-colors ${
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
			)}
		</header>
	);
}
