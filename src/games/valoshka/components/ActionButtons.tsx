"use client";

import { PillButton } from "@/shared/components/ui/PillButton";

interface ActionButtonsProps {
	onDelete: () => void;
	onShuffle: () => void;
	onSubmit: () => void;
}

function ShuffleIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M16 3h5v5" />
			<path d="M4 20L21 3" />
			<path d="M21 16v5h-5" />
			<path d="M15 15l5.1 5.1" />
			<path d="M4 4l5 5" />
		</svg>
	);
}

export function ActionButtons({
	onDelete,
	onShuffle,
	onSubmit,
}: ActionButtonsProps) {
	return (
		<div className="flex items-center justify-center gap-3">
			<PillButton variant="ghost" size="md" onClick={onDelete}>
				Выдаліць
			</PillButton>

			<PillButton variant="ghost" size="md" onClick={onShuffle} icon={<ShuffleIcon />}>{""}</PillButton>

			<PillButton variant="primary" size="md" onClick={onSubmit}>
				Увесці
			</PillButton>
		</div>
	);
}
