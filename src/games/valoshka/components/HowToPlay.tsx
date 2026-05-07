"use client";

import { useEffect, useState } from "react";

interface HowToPlayProps {
	onClose: () => void;
	isOpen: boolean;
}

export function HowToPlay({ onClose, isOpen }: HowToPlayProps) {
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		if (isOpen) {
			document.addEventListener("keydown", handler);
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.removeEventListener("keydown", handler);
			document.body.style.overflow = "";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: presentation role backdrop
		<div
			role="presentation"
			onClick={onClose}
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 50,
				background: "rgba(0,0,0,0.5)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "16px",
			}}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Як гуляць?"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
				style={{
					background: "var(--bg-card)",
					border: "1px solid var(--border)",
					borderRadius: "16px",
					width: "100%",
					maxWidth: "480px",
					maxHeight: "85vh",
					display: "flex",
					flexDirection: "column",
					fontFamily: "var(--font-manrope), sans-serif",
					overflowY: "auto",
				}}
			>
				{/* Header */}
				<div
					style={{
						display: "flex",
						alignItems: "flex-start",
						justifyContent: "space-between",
						padding: "20px 24px 16px",
						flexShrink: 0,
					}}
				>
					<h2
						style={{
							margin: 0,
							fontFamily: "var(--font-eb-garamond), serif",
							fontSize: "26px",
							fontWeight: "700",
							color: "var(--text)",
							letterSpacing: "-0.02em",
						}}
					>
						Як гуляць?
					</h2>
					<button
						type="button"
						onClick={onClose}
						style={{
							background: "none",
							border: "none",
							cursor: "pointer",
							color: "var(--text-muted)",
							fontSize: "20px",
							lineHeight: 1,
							padding: "2px 4px",
							flexShrink: 0,
						}}
					>
						✕
					</button>
				</div>

				{/* Content */}
				<div
					style={{
						padding: "0 24px 24px",
						fontSize: "13px",
						lineHeight: 1.6,
						color: "var(--text)",
					}}
				>
					<ul style={{ margin: 0, paddingLeft: "20px" }}>
						<li style={{ marginBottom: "8px" }}>
							Словы складаюцца з 7 літар —{" "}
							<strong style={{ color: "var(--cornflower)" }}>
								цэнтральная літара абавязковая
							</strong>
							.
						</li>
						<li style={{ marginBottom: "8px" }}>
							Мінімальная даўжыня слова — <strong>4 літары</strong>.
						</li>
						<li style={{ marginBottom: "8px" }}>
							Колькасць балаў:
							<ul style={{ marginTop: "4px", paddingLeft: "20px" }}>
								<li>4-літарныя словы: 1 бал</li>
								<li>Словы даўжэй за 4 літары: па 1 балу за кожную літару</li>
								<li>
									<strong style={{ color: "var(--cornflower)" }}>
										Панграмы
									</strong>{" "}
									(выкарыстоўваюць усе 7 літар): +7 бонусных балаў
								</li>
							</ul>
						</li>
						<li>
							Рангі залежаць ад адсотка набраных балаў (падрабязней у{" "}
							<strong style={{ color: "var(--cornflower)" }}>Рангі</strong>).
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export function useHowToPlay() {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const seen = localStorage.getItem("valoshka-how-to-play-seen");
		if (!seen) {
			setIsOpen(true);
		}
	}, []);

	const close = () => {
		localStorage.setItem("valoshka-how-to-play-seen", "true");
		setIsOpen(false);
	};

	return { isOpen, open: () => setIsOpen(true), close };
}
