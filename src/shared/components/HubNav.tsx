"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderIconButtons } from "@/shared/components/HeaderIconButtons";

export function HubNav() {
	const pathname = usePathname();

	if (pathname !== "/") return null;

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
							color: "var(--sly-accent)",
						}}
					>
						Словы
					</Link>

					<Link
						href="/valoshka"
						className="text-sm font-semibold no-underline transition-colors"
						style={{
							fontFamily: "var(--sly-font-sans)",
							color: "var(--sly-text-muted)",
						}}
					>
						Валошка
					</Link>
					<Link
						href="/pobach"
						className="text-sm font-semibold no-underline transition-colors"
						style={{
							fontFamily: "var(--sly-font-sans)",
							color: "var(--sly-text-muted)",
						}}
					>
						Побач
					</Link>
				</div>

				<HeaderIconButtons statsHref="/stats" />
			</div>
		</nav>
	);
}
