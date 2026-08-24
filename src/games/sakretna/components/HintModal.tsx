import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { Typography } from "@/shared/components/ui/Typography";

interface HintModalProps {
	isOpen: boolean;
	preview: { lemma: string; revealedCount: number } | null;
	onConfirm: () => void;
	onClose: () => void;
}

export function HintModal({
	isOpen,
	preview,
	onConfirm,
	onClose,
}: HintModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Выкарыстаць падказку?">
			<div className="flex flex-col gap-inset-lg">
				{preview ? (
					<Typography variant="body" className="text-ink-muted">
						Будзе раскрыта слова «{preview.lemma}» у {preview.revealedCount}{" "}
						месцах. Гэта адзіная падказка ў гульні.
					</Typography>
				) : (
					<Typography variant="body" className="text-ink-muted">
						У асноўным тэксце не засталося прыдатных слоў для падказкі.
					</Typography>
				)}
				<div className="flex items-center justify-center gap-flow-md">
					<Button variant="outline" color="neutral" onClick={onClose}>
						Не цяпер
					</Button>
					{preview && (
						<Button variant="solid" color="primary" onClick={onConfirm}>
							Раскрыць слова
						</Button>
					)}
				</div>
			</div>
		</Modal>
	);
}
