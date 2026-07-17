"use client";

import { Grid3x3, Shuffle } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { HintButton } from "./HintButton";

interface ActionButtonsProps {
	onDelete: () => void;
	onShuffle: () => void;
	onSubmit: () => void;
	onHint: () => void;
	onOpenGrid: () => void;
	hintCredits: number;
}

export function ActionButtons({
	onDelete,
	onShuffle,
	onSubmit,
	onHint,
	onOpenGrid,
	hintCredits,
}: ActionButtonsProps) {
	return (
		<div className="flex items-center justify-center gap-3">
			<Button
				variant="outline"
				color="neutral"
				size="lg"
				onClick={onDelete}
				className="ph-no-rageclick"
			>
				Сцерці
			</Button>

			<Button
				variant="ghost"
				color="neutral"
				aria-label="Змяшаць"
				onClick={onShuffle}
				size="lg"
				startIcon={<Shuffle size={20} />}
			/>

			<HintButton hintCredits={hintCredits} onClick={onHint} />

			<Button
				variant="ghost"
				color="neutral"
				aria-label="Сетка слоў"
				onClick={onOpenGrid}
				size="lg"
				startIcon={<Grid3x3 size={20} />}
			/>

			<Button variant="solid" color="primary" size="lg" onClick={onSubmit}>
				Увесці
			</Button>
		</div>
	);
}
