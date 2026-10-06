"use client";

import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { Typography } from "@/shared/components/ui/Typography";

interface HowToPlayProps {
	isOpen: boolean;
	onClose: () => void;
	isFirstRun?: boolean;
}

export function HowToPlay({
	isOpen,
	onClose,
	isFirstRun = false,
}: HowToPlayProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={isFirstRun ? "Расшыфруйце артыкул" : "Як гуляць?"}
		>
			<div className="text-ink flex flex-col gap-y-flow-sm">
				<Typography variant="body">
					Здагадайцеся, пра які артыкул беларускай Вікіпедыі ідзе гаворка.
				</Typography>
				<ol
					className="grid gap-flow-sm text-sm sm:text-base"
					aria-label="Правілы гульні"
				>
					<li className="flex gap-inset-sm">
						<strong className="text-sakretna" aria-hidden="true">
							1.
						</strong>
						<span>
							<strong>Уводзьце словы.</strong> Мы знойдзем і адкрыем усе іх
							формы.
						</span>
					</li>
					<li className="flex gap-inset-sm">
						<strong className="text-sakretna" aria-hidden="true">
							2.
						</strong>
						<span>
							<strong>Лічба каля палоскі</strong> паказвае колькасць схаваных
							літар.
						</span>
					</li>
					<li className="flex gap-inset-sm">
						<strong className="text-sakretna" aria-hidden="true">
							3.
						</strong>
						<span>
							<strong>Тры падказкі:</strong> абярыце любы схаваны прастакутнік,
							акрамя слоў назвы, і слова адкрыецца ва ўсіх формах.
						</span>
					</li>
					<li className="flex gap-inset-sm">
						<strong className="text-sakretna" aria-hidden="true">
							4.
						</strong>
						<span>
							<strong>Адкрыйце ўсе словы назвы</strong> — і перамога залічыцца
							аўтаматычна.
						</span>
					</li>
				</ol>
				<div className="mt-flow-sm flex flex-col-reverse sm:flex-row sm:justify-end gap-flow-xs">
					{isFirstRun && (
						<Button variant="ghost" onClick={onClose}>
							Прапусціць
						</Button>
					)}
					<Button variant="solid" color="primary" onClick={onClose}>
						{isFirstRun ? "Пачаць: увесці слова" : "Зразумела"}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
