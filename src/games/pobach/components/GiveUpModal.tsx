"use client";

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
			<p className="text-sm text-[var(--sly-text-muted)] mb-5">
				Калі вы здасцеся, серыя перамог пачнецца спачатку. Працягваем?
			</p>

			<div className="flex items-center justify-center gap-3">
				<button onClick={onClose} type="button" className="btn-ghost">
					Працягнуць гульню
				</button>
				<button onClick={onConfirm} type="button" className="btn-primary">
					Здацца
				</button>
			</div>
		</Modal>
	);
}
