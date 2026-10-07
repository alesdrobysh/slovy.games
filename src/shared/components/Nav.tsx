"use client";

import {
	BarChart2,
	ChevronLeft,
	HelpCircle,
	Info,
	type LucideIcon,
	Moon,
	MoreHorizontal,
	Sun,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { Typography } from "@/shared/components/ui/Typography";
import { useTheme } from "@/shared/hooks/useTheme";
import { formatToday } from "@/shared/lib/formatDate";

type GameKey = "pobach" | "valoshka" | "sakretna";

const GAME_ROUTES: Record<
	GameKey,
	{
		route: string;
		title: string;
		accentClass: string;
		dotClass: string;
		statsHref: string;
	}
> = {
	pobach: {
		route: "/pobach",
		title: "Побач",
		accentClass: "text-pobach",
		dotClass: "bg-pobach",
		statsHref: "/pobach/stats",
	},
	valoshka: {
		route: "/valoshka",
		title: "Валошка",
		accentClass: "text-valoshka",
		dotClass: "bg-valoshka",
		statsHref: "/valoshka/stats",
	},
	sakretna: {
		route: "/sakretna",
		title: "Сакрэтна",
		accentClass: "text-sakretna",
		dotClass: "bg-sakretna",
		statsHref: "/sakretna/stats",
	},
};

const GAME_KEYS = Object.keys(GAME_ROUTES) as GameKey[];

/**
 * Scroll distance after which the masthead collapses to one line. Collapsing
 * shrinks the header and shifts content up, so expanding uses a lower
 * threshold to avoid flip-flopping around a single boundary.
 */
const COMPACT_AFTER_PX = 80;
const EXPAND_BEFORE_PX = 10;

function getGameKey(pathname: string | null): GameKey | null {
	if (!pathname) return null;
	return (
		GAME_KEYS.find((key) => pathname.startsWith(GAME_ROUTES[key].route)) ?? null
	);
}

export interface NavMenuItem {
	label: string;
	icon?: LucideIcon;
	onSelect: () => void;
}

function useCompactOnScroll() {
	const [compact, setCompact] = useState(false);
	useEffect(() => {
		const update = () =>
			setCompact((prev) =>
				prev
					? window.scrollY > EXPAND_BEFORE_PX
					: window.scrollY > COMPACT_AFTER_PX
			);
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);
	return compact;
}

function useSakretnaVisible(currentGame: GameKey | null) {
	const [visible, setVisible] = useState(currentGame === "sakretna");
	useEffect(() => {
		setVisible(
			currentGame === "sakretna" ||
				document.cookie.split("; ").includes("sakretna_beta=1")
		);
	}, [currentGame]);
	return visible;
}

function MenuRow({
	icon: Icon,
	children,
	trailing,
	href,
	onClick,
	current,
}: {
	icon?: LucideIcon;
	children: ReactNode;
	trailing?: ReactNode;
	href?: string;
	onClick?: () => void;
	current?: boolean;
}) {
	const className = `flex w-full items-center gap-flow-lg min-h-(--control-min-height) px-inset-sm rounded-xl text-left text-ink no-underline transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) ${current ? "bg-secondary" : ""}`;
	const content = (
		<>
			{Icon && <Icon size={20} aria-hidden="true" className="text-ink-muted" />}
			<span className="flex-1">{children}</span>
			{trailing}
		</>
	);
	if (href) {
		return (
			<Link
				href={href}
				onClick={onClick}
				className={className}
				aria-current={current ? "page" : undefined}
			>
				{content}
			</Link>
		);
	}
	return (
		<button type="button" onClick={onClick} className={className}>
			{content}
		</button>
	);
}

export function Nav({
	onHelpClick,
	menuItems,
	pathname: pathnameOverride,
}: {
	onHelpClick?: (() => void) | null;
	/** Game-specific entries for the "⋯" menu, e.g. yesterday's answers. */
	menuItems?: NavMenuItem[];
	pathname?: string;
} = {}) {
	const routerPathname = usePathname();
	const pathname = pathnameOverride ?? routerPathname;
	const { theme, toggleTheme } = useTheme();
	const compact = useCompactOnScroll();
	const [menuOpen, setMenuOpen] = useState(false);

	const gameKey = getGameKey(pathname);
	const game = gameKey ? GAME_ROUTES[gameKey] : null;
	const sakretnaVisible = useSakretnaVisible(gameKey);
	const segments = (pathname ?? "/").split("/");
	segments.pop();
	const backHref = segments.join("/") || "/";

	const closeMenu = () => setMenuOpen(false);
	const runAndClose = (action: () => void) => () => {
		setMenuOpen(false);
		action();
	};

	const iconButtonClass = "rounded-full shrink-0";

	return (
		<header
			data-compact={compact}
			className={`masthead sticky top-0 z-40 bg-paper/85 backdrop-blur-md transition-shadow max-md:short:static max-md:keyboard:invisible ${compact ? "border-b border-rule shadow-lg shadow-ink/5" : ""}`}
		>
			<div
				className={`mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-flow-sm sm:px-inset-md transition-[height] duration-200 ${compact ? "h-13" : "h-20 sm:h-28"}`}
			>
				<div className="flex">
					{game && (
						<Button
							as={Link}
							href={backHref}
							variant="ghost"
							color="neutral"
							size="lg"
							className={iconButtonClass}
							aria-label="Усе гульні"
							startIcon={<ChevronLeft strokeWidth={2.25} />}
						/>
					)}
				</div>

				<div className="flex min-w-0 flex-col items-center gap-flow-sm">
					{game ? (
						<Typography
							variant="masthead"
							aria-current="page"
							className={game.accentClass}
						>
							{game.title}
						</Typography>
					) : (
						<Link href="/" className="no-underline text-ink hover:opacity-80">
							<Typography variant="masthead">Словы</Typography>
						</Link>
					)}
					{!compact && (
						<Typography
							variant="dateline"
							className="text-ink-muted"
							suppressHydrationWarning
						>
							{formatToday()}
						</Typography>
					)}
				</div>

				<div className="flex justify-end">
					<Button
						variant="ghost"
						color="neutral"
						size="lg"
						className={iconButtonClass}
						onClick={() => setMenuOpen(true)}
						aria-label="Меню"
						startIcon={<MoreHorizontal />}
					/>
				</div>
			</div>

			{!compact && (
				<div className="mx-auto max-w-7xl px-flow-lg sm:px-inset-lg">
					<div className="border-b-3 border-double border-(--muted)" />
				</div>
			)}

			<Modal
				isOpen={menuOpen}
				onClose={closeMenu}
				placement="sheet"
				maxWidth="420px"
			>
				<nav aria-label="Меню" className="flex flex-col gap-flow-xs">
					{game && onHelpClick && (
						<MenuRow icon={HelpCircle} onClick={runAndClose(onHelpClick)}>
							Як гуляць
						</MenuRow>
					)}
					{game && (
						<MenuRow icon={BarChart2} href={game.statsHref} onClick={closeMenu}>
							Статыстыка
						</MenuRow>
					)}
					{menuItems?.map((item) => (
						<MenuRow
							key={item.label}
							icon={item.icon}
							onClick={runAndClose(item.onSelect)}
						>
							{item.label}
						</MenuRow>
					))}

					<div className="my-flow-sm border-t border-rule" />
					<Typography
						variant="overline"
						as="span"
						className="px-inset-sm text-ink-muted"
					>
						Гульні
					</Typography>
					{GAME_KEYS.filter((key) => key !== "sakretna" || sakretnaVisible).map(
						(key) => (
							<MenuRow
								key={key}
								href={GAME_ROUTES[key].route}
								onClick={closeMenu}
								current={key === gameKey}
							>
								<span className="flex items-center gap-flow-lg">
									<span
										aria-hidden="true"
										className={`mt-1 size-2.5 rounded-full ${GAME_ROUTES[key].dotClass}`}
									/>
									<Typography variant="displaySm" as="span">
										{GAME_ROUTES[key].title}
									</Typography>
								</span>
							</MenuRow>
						)
					)}

					<div className="my-flow-sm border-t border-rule" />
					<MenuRow icon={theme === "light" ? Moon : Sun} onClick={toggleTheme}>
						{theme === "light" ? "Цёмная тэма" : "Светлая тэма"}
					</MenuRow>
					<MenuRow icon={Info} href="/about" onClick={closeMenu}>
						Пра праект
					</MenuRow>
				</nav>
			</Modal>
		</header>
	);
}
