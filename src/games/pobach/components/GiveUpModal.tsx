"use client";

import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";

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
			<p className="text-sm text-ink-muted mb-5">
				Калі вы здасцеся, серыя перамог пачнецца спачатку. Працягваем?
			</p>

			<div className="flex items-center justify-center gap-3">
				<Button variant="outline" color="neutral" onClick={onClose}>
					Працягнуць гульню
				</Button>
				<Button variant="outline" color="neutral" dashed onClick={onConfirm}>
					Здацца
				</Button>
			</div>
		</Modal>
	);
}
