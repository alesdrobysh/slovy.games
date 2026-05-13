"use client";

import { useEffect } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { useModal } from "@/shared/hooks/useModal";

interface HowToPlayProps {
	onClose: () => void;
	isOpen: boolean;
}

export function HowToPlay({ onClose, isOpen }: HowToPlayProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Як гуляць?">
			<div
				className="text-sm leading-relaxed text-[var(--sly-text)]"
				style={{ fontFamily: "var(--sly-font-sans)" }}
			>
				{/* Core rule — the one thing you MUST know */}
				<p className="mb-4">
					Складайце словы з 7 літар на дошцы.{" "}
					<strong className="text-[var(--sly-cornflower)]">
						Цэнтральная літара павінна быць у кожным слове
					</strong>
					. Мінімум 4 літары.
				</p>

				{/* Visual example */}
				<div
					className="mb-4 p-3 rounded-xl"
					style={{
						background: "var(--sly-cornflower-bg-subtle)",
						border: "1px solid var(--sly-cornflower-border-subtle)",
					}}
				>
					<p className="text-xs text-[var(--sly-text-muted)] mb-2">Прыклад:</p>
					<p className="font-display text-base">
						<span style={{ color: "var(--sly-cornflower)" }}>А</span>
						<span className="text-[var(--sly-text)]">РБ</span>
						<span style={{ color: "var(--sly-cornflower)" }}>А</span>
						<span className="text-[var(--sly-text)]">ТА</span> → 5 балаў
					</p>
					<p className="text-xs text-[var(--sly-text-muted)] mt-1">
						Цэнтральная літара «а» выкарыстана двойчы. Словы даўжэйшыя за 4
						літары даюць больш балаў.
					</p>
				</div>

				{/* Scoring — simplified */}
				<details className="mb-3">
					<summary className="cursor-pointer text-[var(--sly-cornflower)] font-medium hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm">
						Як налічваюцца балы?
					</summary>
					<ul className="mt-2 pl-4 space-y-1.5 text-[var(--sly-text-muted)]">
						<li>• 4 літары = 1 бал</li>
						<li>• 5 літар = 5 балаў, 6 літар = 6 балаў і г.д.</li>
						<li>
							•{" "}
							<strong className="text-[var(--sly-cornflower)]">Панграма</strong>{" "}
							— слова з усіх 7 літар: +7 бонусных балаў
						</li>
					</ul>
				</details>

				{/* Ranks */}
				<details>
					<summary className="cursor-pointer text-[var(--sly-cornflower)] font-medium hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm">
						Што такое рангі?
					</summary>
					<p className="mt-2 text-[var(--sly-text-muted)]">
						Чым больш слоў вы знаходзіце, тым вышэй ваш ранг. Націсніце на
						бягучы ранг над шкалай прагрэсу, каб убачыць усе ўзроўні.
					</p>
				</details>
			</div>
		</Modal>
	);
}

export function useHowToPlay() {
	const { isOpen, open, close } = useModal(false);

	useEffect(() => {
		const seen = localStorage.getItem("valoshka-how-to-play-seen");
		if (!seen) {
			open();
		}
	}, [open]);

	const closeAndMark = () => {
		localStorage.setItem("valoshka-how-to-play-seen", "true");
		close();
	};

	return { isOpen, open, close: closeAndMark };
}
