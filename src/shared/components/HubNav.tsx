"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderIconButtons } from "@/shared/components/HeaderIconButtons";

export function HubNav() {
	const pathname = usePathname();
	const isHub = pathname === "/";

	const links = [
		{ href: "/valoshka", label: "Валошка" },
		{ href: "/pobach", label: "Побач" },
	];

	return (
		<nav
			className="w-full border-b"
			style={{
				background: "var(--sly-bg)",
				borderColor: "var(--sly-border)",
			}}
		>
			<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
				<div className="flex items-center gap-6">
					<Link
						href="/"
						className="text-xl font-bold no-underline tracking-tight"
						style={{
							fontFamily: "var(--sly-font-display)",
							color: isHub ? "var(--sly-accent)" : "var(--sly-text-muted)",
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
									fontFamily: "var(--sly-font-sans)",
									color: isActive
										? "var(--sly-accent)"
										: "var(--sly-text-muted)",
								}}
							>
								{link.label}
							</Link>
						);
					})}
				</div>

				<HeaderIconButtons statsHref="/stats" />
			</div>
		</nav>
	);
}
