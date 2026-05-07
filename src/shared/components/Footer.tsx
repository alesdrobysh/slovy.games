import Link from "next/link";

export function Footer() {
	return (
		<footer
			className="w-full border-t mt-auto"
			style={{
				borderColor: "var(--color-border)",
			}}
		>
			<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 text-xs sm:text-sm">
				<span style={{ color: "var(--color-text-muted)" }}>
					Зроблена з ❤️ да роднай мовы
				</span>
				<div className="flex gap-4">
					<Link
						href="/pobach/about"
						style={{
							color: "var(--color-text-muted)",
							textDecoration: "none",
						}}
					>
						Пра гульню
					</Link>
					<Link
						href="/pobach/privacy"
						style={{
							color: "var(--color-text-muted)",
							textDecoration: "none",
						}}
					>
						Прыватнасць
					</Link>
				</div>
			</div>
		</footer>
	);
}
