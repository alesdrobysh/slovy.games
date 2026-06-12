"use client";

import {
	BarChart2,
	ChevronLeft,
	HelpCircle,
	Moon,
	Sun,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/shared/components/ui/Button";
import { Typography } from "@/shared/components/ui/Typography";
import { useTheme } from "@/shared/hooks/useTheme";


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

function getGameConfig(pathname: string | null) {
	if (!pathname) return null;
	return (
		Object.entries(GAME_ROUTES).find(([route]) =>
			pathname.startsWith(route),
		)?.[1] ?? null
	);
}

export function Nav({
	onHelpClick,
	extraActions,
	pathname: pathnameOverride,
}: {
	onHelpClick?: (() => void) | null;
	extraActions?: React.ReactNode;
	pathname?: string;
} = {}) {
	const routerPathname = usePathname();
	const pathname = pathnameOverride ?? routerPathname;
	const { theme, toggleTheme } = useTheme();

	const game = getGameConfig(pathname);

	const themeToggle = (
		<Button
			variant="ghost"
			color="neutral"
			size="lg"
			className="rounded-full shrink-0"
			onClick={toggleTheme}
			aria-label={theme === "light" ? "Цёмная тэма" : "Светлая тэма"}
			startIcon={theme === "light" ? <Moon /> : <Sun />}
		/>
	);

	return (
		<header className="border-b border-rule/60 bg-paper/70">
			<div className="mx-auto flex max-w-7xl items-center h-16 sm:h-20 px-flow-lg sm:px-inset-lg gap-flow-lg">
				{game ? (
					/* ── Game mode ── */
					<>
						<Button
							as={Link}
							href="/"
							variant="ghost"
							color="neutral"
							size="lg"
							className="rounded-full shrink-0"
							aria-label="Усе гульні"
							startIcon={<ChevronLeft strokeWidth={2.5} />}
						/>

						<Typography
							variant="heading"
							as="span"
							className={`flex-1 text-center ${game.accentClass}`}
						>
							{game.title}
						</Typography>

						<div className="flex items-center gap-flow-xs shrink-0">
							{extraActions}
							{onHelpClick && (
								<Button
									variant="ghost"
									color="neutral"
									size="lg"
									className="rounded-full"
									onClick={onHelpClick}
									aria-label="Як гуляць?"
									startIcon={<HelpCircle />}
								/>
							)}
							<Button
								as={Link}
								href={game.statsHref}
								variant="ghost"
								color="neutral"
								size="lg"
								className="rounded-full"
								aria-label="Статыстыка"
								startIcon={<BarChart2 />}
							/>
							{themeToggle}
						</div>
					</>
				) : (
					/* ── Hub mode ── */
					<>
						<div className="flex-1 flex items-center">
							<Link href="/" className="no-underline hover:opacity-80 transition-opacity">
								<Typography variant="heading" className="text-ink">
									Словы
								</Typography>
							</Link>
						</div>

						{themeToggle}
					</>
				)}
			</div>
		</header>
	);
}
