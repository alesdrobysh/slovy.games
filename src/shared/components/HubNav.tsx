"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/shared/hooks/useTheme";

export function HubNav() {
	const pathname = usePathname();
	const isHub = pathname === "/";
	const { theme, toggleTheme } = useTheme();

	const links = [
		{ href: "/valoshka", label: "Валошка" },
		{ href: "/pobach", label: "Побач" },
	];

	return (
		<nav
			className="w-full border-b"
			style={{
				background: "var(--color-bg)",
				borderColor: "var(--color-border)",
			}}
		>
			<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
				<div className="flex items-center gap-6">
					<Link
						href="/"
						className="text-xl font-bold no-underline tracking-tight"
						style={{
							fontFamily: "var(--font-display)",
							color: isHub
								? "var(--color-accent)"
								: "var(--color-text-muted)",
						}}
					>
						Словы
					</Link>

					{links.map((link) => {
						const isActive = pathname.startsWith(link.href);
						return (
							<Link
								key={link.href}
								href={link.href}
								className="text-sm font-semibold no-underline transition-colors"
								style={{
									fontFamily: "var(--font-sans)",
									color: isActive
										? "var(--color-accent)"
										: "var(--color-text-muted)",
								}}
							>
								{link.label}
							</Link>
						);
					})}
				</div>

				<div className="flex items-center gap-3">
					<Link
						href="/stats"
						className="text-sm font-semibold no-underline"
						style={{
							fontFamily: "var(--font-sans)",
							color: pathname === "/stats"
								? "var(--color-accent)"
								: "var(--color-text-muted)",
						}}
					>
						Статыстыка
					</Link>
					<button
						type="button"
						onClick={toggleTheme}
						aria-label="Змяніць тэму"
						className="flex items-center justify-center rounded-full border transition-colors"
						style={{
							width: "36px",
							height: "36px",
							background: "transparent",
							borderColor: "var(--color-border)",
							color: "var(--color-text-muted)",
							cursor: "pointer",
						}}
					>
						{theme === "light" ? (
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Цёмная тэма</title>
								<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
							</svg>
						) : (
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Светлая тэма</title>
								<circle cx="12" cy="12" r="5" />
								<line x1="12" y1="1" x2="12" y2="3" />
								<line x1="12" y1="21" x2="12" y2="23" />
								<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
								<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
								<line x1="1" y1="12" x2="3" y2="12" />
								<line x1="21" y1="12" x2="23" y2="12" />
								<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
								<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
							</svg>
						)}
					</button>
				</div>
			</div>
		</nav>
	);
}
