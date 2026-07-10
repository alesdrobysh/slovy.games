"use client";

import { Modal } from "@/shared/components/ui/Modal";
import { Typography } from "@/shared/components/ui/Typography";

interface HowToPlayProps {
	isOpen: boolean;
	onClose: () => void;
}

export function HowToPlay({ isOpen, onClose }: HowToPlayProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Як гуляць?">
			<div className="text-ink flex flex-col gap-y-flow-md">
				<Typography variant="body">
					Вам паказаны ўступ да артыкула з беларускай Вікіпедыі з{" "}
					<strong className="text-sakretna">зашыфраванымі словамі</strong>.
					Увядзіце слова — і ўсе яго формы ў тэксце расшыфруюцца.
				</Typography>
				<Typography variant="body">
					<strong className="text-sakretna">Мэта</strong> — здагадацца, пра які
					артыкул ідзе гаворка, і націснуць <strong>«Я здагадаўся!»</strong>.
				</Typography>
				<Typography variant="body">
					<strong className="text-sakretna">Хто выйграў:</strong> чым менш спроб
					— тым лепш. Даступная адна бясплатная падказка.
				</Typography>
				<Typography variant="body" className="text-ink-muted text-sm">
					Падказка расшыфруе назву артыкула. Выкарыстоўвайце яе ў крайнім
					выпадку — гэта залічваецца ў статыстыцы.
				</Typography>
			</div>
		</Modal>
	);
}
