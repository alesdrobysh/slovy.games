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
			<p className="text-sm text-ink-muted mb-5">
				Калі вы здасцеся, серыя перамог пачнецца спачатку. Працягваем?
			</p>

			<div className="flex items-center justify-center gap-3">
				<button
					onClick={onClose}
					type="button"
					className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-ink-muted ring-1 ring-rule hover:bg-rule transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
				>
					Працягнуць гульню
				</button>
				<button onClick={onConfirm} type="button" className="btn-primary">
					Здацца
				</button>
			</div>
		</Modal>
	);
}
