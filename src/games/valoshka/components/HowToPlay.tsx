"use client";

import { useEffect } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Typography } from "@/shared/components/ui/Typography";
import { useModal } from "@/shared/hooks/useModal";

interface HowToPlayProps {
	onClose: () => void;
	isOpen: boolean;
}

export function HowToPlay({ onClose, isOpen }: HowToPlayProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Як гуляць?">
			<div className="text-ink flex flex-col gap-y-inset-sm">
				<Typography variant="body" className="mb-flow-lg">
					Складайце словы з 7 літар на дошцы.{" "}
					<strong className="text-valoshka">
						Цэнтральная літара павінна быць у кожным слове
					</strong>
					. Мінімум 4 літары.
				</Typography>

				<details className="mb-flow-md">
					<summary className="cursor-pointer text-valoshka font-medium hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm">
						Як налічваюцца балы?
					</summary>
					<ul className="mt-flow-xs pl-flow-lg space-y-flow-xs list-disc">
						<li><Typography variant="body">4 літары = 1 бал</Typography></li>
						<li><Typography variant="body">5 літар = 5 балаў, 6 літар = 6 балаў і г.д.</Typography></li>
						<li>
							<Typography variant="body"><strong className="text-valoshka">Панграма</strong>{" "}
							— слова з усіх 7 літар: +7 бонусных балаў</Typography>
						</li>
					</ul>
				</details>

				<details>
					<summary className="cursor-pointer text-valoshka font-medium hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm">
						Што такое рангі?
					</summary>
					<div className="mt-flow-xs">
						<Typography variant="body">
							Чым больш слоў вы знаходзіце, тым вышэй ваш ранг. Націсніце на
							бягучы ранг над шкалай прагрэсу, каб убачыць усе ўзроўні.
						</Typography>
					</div>
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
