import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { Typography } from "@/shared/components/ui/Typography";

interface GiveUpModalProps {
	isOpen: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

export function GiveUpModal({ isOpen, onConfirm, onClose }: GiveUpModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Пакінуць гульню?">
			<div className="flex flex-col gap-inset-lg">
				<Typography variant="body" className="text-ink-muted">
					Пасля здачы артыкул будзе расшыфраваны, але перамога не залічыцца.
				</Typography>
				<div className="flex items-center justify-center gap-flow-md">
					<Button variant="outline" color="neutral" onClick={onClose}>
						Працягнуць гульню
					</Button>
					<Button variant="solid" color="danger" onClick={onConfirm}>
						Здацца
					</Button>
				</div>
			</div>
		</Modal>
	);
}
