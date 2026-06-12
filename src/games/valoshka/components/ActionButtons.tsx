"use client";

import { Shuffle } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { HintButton } from "./HintButton";

interface ActionButtonsProps {
	onDelete: () => void;
	onShuffle: () => void;
	onSubmit: () => void;
	onHint: () => void;
	wordsEarnTokenCount: number;
}

export function ActionButtons({
	onDelete,
	onShuffle,
	onSubmit,
	onHint,
	wordsEarnTokenCount,
}: ActionButtonsProps) {
	return (
		<div className="flex items-center justify-center gap-3">
			<Button variant="outline" color="neutral" size="lg" onClick={onDelete}>
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

			<HintButton wordsEarnTokenCount={wordsEarnTokenCount} onClick={onHint} />

			<Button variant="solid" color="primary" size="lg" onClick={onSubmit}>
				Увесці
			</Button>
		</div>
	);
}
