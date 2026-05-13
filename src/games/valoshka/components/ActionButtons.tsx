"use client";

import { PillButton } from "@/shared/components/ui/PillButton";

interface ActionButtonsProps {
	onDelete: () => void;
	onShuffle: () => void;
	onSubmit: () => void;
	onHint?: () => void;
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

function LightbulbIcon() {
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
			<path d="M9 21h6" />
			<path d="M12 3a6 6 0 0 1 6 6c0 2.2-1.2 4.1-3 5.2V17a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-2.8C7.2 13.1 6 11.2 6 9a6 6 0 0 1 6-6z" />
		</svg>
	);
}

export function ActionButtons({
	onDelete,
	onShuffle,
	onSubmit,
	onHint,
}: ActionButtonsProps) {
	return (
		<div className="flex items-center justify-center gap-3">
			<PillButton variant="ghost" size="md" onClick={onDelete}>
				Сцерці
			</PillButton>

			<PillButton
				variant="ghost"
				size="md"
				onClick={onShuffle}
				icon={<ShuffleIcon />}
			>
				{""}
			</PillButton>

			{onHint && (
				<PillButton
					variant="ghost"
					size="md"
					onClick={onHint}
					icon={<LightbulbIcon />}
				>
					{""}
				</PillButton>
			)}

			<PillButton variant="primary" size="md" onClick={onSubmit}>
				Увесці
			</PillButton>
		</div>
	);
}
