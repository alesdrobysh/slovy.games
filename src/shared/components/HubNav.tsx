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
		"w-9 h-9 flex items-center justify-center rounded-full hover:bg-rule transition-colors text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

	return (
		<header ref={menuRef} className="sticky top-0 z-30 border-b border-rule bg-paper/80 backdrop-blur-sm">
			<div className="mx-auto flex max-w-screen-xl items-center h-14 sm:h-16 px-3 sm:px-8 gap-2">
				{game ? (
					/* ── Game mode ── */
					<>
						{/* Back arrow */}
						<div className="flex items-center shrink-0">
							<Link
								href="/"
								aria-label="Усе гульні"
								className={iconClass}
							>
								<ChevronLeft size={20} />
							</Link>
						</div>

						{/* Game title — centered */}
						<span
							className={`flex-1 text-center font-display text-lg sm:text-xl font-semibold tracking-tight leading-none ${game.accentClass}`}
						>
							{game.title}
						</span>

						{/* Game actions */}
						<div className="flex items-center gap-0.5 shrink-0">
							{extraActions}
							{onHelpClick && (
								<button
									type="button"
									onClick={onHelpClick}
									aria-label="Як гуляць?"
									className={iconClass}
								>
									<HelpCircle size={18} />
								</button>
							)}
							<Link
								href={game.statsHref}
								aria-label="Статыстыка"
								className={iconClass}
							>
								<BarChart2 size={18} />
							</Link>
							<button
								onClick={toggleTheme}
								type="button"
								aria-label={
									theme === "light"
										? "Пераключыць на цёмную тэму"
										: "Пераключыць на светлую тэму"
								}
								className={iconClass}
							>
								{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
							</button>
							{/* Hamburger */}
							<button
								type="button"
								onClick={() => setMenuOpen((v) => !v)}
								aria-label="Меню"
								aria-expanded={menuOpen}
								className={iconClass}
							>
								{menuOpen ? <X size={18} /> : <Menu size={18} />}
							</button>
						</div>
					</>
				) : (
					/* ── Hub mode ── */
					<>
						<div className="flex items-center gap-6 flex-1">
							<Link
								href="/"
								className="font-display text-2xl font-semibold tracking-tight leading-none text-ink no-underline"
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

						<div className="flex items-center gap-0.5">
							<button
								onClick={toggleTheme}
								type="button"
								aria-label={
									theme === "light"
										? "Пераключыць на цёмную тэму"
										: "Пераключыць на светлую тэму"
								}
								className={iconClass}
							>
								{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
							</button>
							<button
								type="button"
								onClick={() => setMenuOpen((v) => !v)}
								aria-label="Меню"
								aria-expanded={menuOpen}
								className={iconClass}
							>
								{menuOpen ? <X size={18} /> : <Menu size={18} />}
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
