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
				<ul className="pl-5 space-y-2">
					<li>
						Словы складаюцца з 7 літар —{" "}
						<strong className="text-[var(--sly-cornflower)]">
							цэнтральная літара абавязковая
						</strong>
						.
					</li>
					<li>
						Мінімальная даўжыня слова — <strong>4 літары</strong>.
					</li>
					<li>
						Колькасць балаў:
						<ul className="mt-1 pl-5">
							<li>4-літарныя словы: 1 бал</li>
							<li>Словы даўжэй за 4 літары: па 1 балу за кожную літару</li>
							<li>
								<strong className="text-[var(--sly-cornflower)]">Панграмы</strong>{" "}
								(выкарыстоўваюць усе 7 літар): +7 бонусных балаў
							</li>
						</ul>
					</li>
					<li>
						Рангі залежаць ад адсотка набраных балаў (падрабязней у{" "}
						<strong className="text-[var(--sly-cornflower)]">Рангі</strong>).
					</li>
				</ul>
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
