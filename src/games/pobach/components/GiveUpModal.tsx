"use client";

import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { Typography } from "@/shared/components/ui/Typography";

type GiveUpModalProps = {
	isOpen: boolean;
	onConfirm: () => void;
	onClose: () => void;
};

export default function GiveUpModal({
	isOpen,
	onConfirm,
	onClose,
}: GiveUpModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Ўпэўнены?">
			<div className="flex flex-col gap-inset-lg">
			<Typography variant="body" className="text-ink-muted">
				Калі вы здасцеся, серыя перамог пачнецца спачатку
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
