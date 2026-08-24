import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { Typography } from "@/shared/components/ui/Typography";

interface GiveUpModalProps {
	isOpen: boolean;
	onConfirm: () => void;
	onClose: () => void;
	onUseHint: () => void;
	hintAvailable: boolean;
	guessCount: number;
}

export function GiveUpModal({
	isOpen,
	onConfirm,
	onClose,
	onUseHint,
	hintAvailable,
	guessCount,
}: GiveUpModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Патрэбна дапамога?">
			<div className="flex flex-col gap-flow-md">
				<div className="text-ink-muted">
					<Typography variant="body">
						Прагрэс захаваецца. Паспрабуйце адзін з варыянтаў або здайцеся
						адразу.
					</Typography>
				</div>
				<div className="rounded-xl bg-paper p-inset-md ring-1 ring-rule flex flex-col gap-flow-sm">
					<div>
						<p className="font-semibold text-ink">Падказка: адкрыць слова</p>
						<p className="text-sm text-ink-muted">
							{hintAvailable
								? "Кошт: 1 з 1 бясплатнай падказкі. Спачатку пакажам слова для пацвярджэння."
								: "Бясплатная падказка ўжо выкарыстана."}
						</p>
					</div>
					<Button
						variant="outline"
						color="primary"
						onClick={onUseHint}
						disabled={!hintAvailable}
					>
						Паглядзець падказку
					</Button>
				</div>
				<div className="rounded-xl bg-paper p-inset-md ring-1 ring-rule">
					<p className="font-semibold text-ink">Парада без штрафу</p>
					<p className="text-sm text-ink-muted">
						{guessCount === 0
							? "Пачніце з частых слоў у загалоўках: месца, асоба, горад, твор."
							: "Націсніце знойдзенае слова ў гісторыі, каб вярнуцца да яго кантэксту."}
					</p>
				</div>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-flow-sm">
					<Button variant="solid" color="primary" onClick={onClose}>
						Працягнуць гульню
					</Button>
					<Button variant="ghost" color="danger" onClick={onConfirm}>
						Усё роўна здацца
					</Button>
				</div>
			</div>
		</Modal>
	);
}
