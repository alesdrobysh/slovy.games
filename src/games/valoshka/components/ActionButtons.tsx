"use client";

import { Lightbulb, Shuffle } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

interface ActionButtonsProps {
	onDelete: () => void;
	onShuffle: () => void;
	onSubmit: () => void;
	onHint: () => void;
}

export function ActionButtons({
	onDelete,
	onShuffle,
	onSubmit,
	onHint,
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

			<Button
				variant="ghost"
				color="neutral"
				aria-label="Падказка"
				onClick={onHint}
				size="lg"
				startIcon={<Lightbulb size={20} />}
			/>

			<Button variant="solid" color="primary" size="lg" onClick={onSubmit}>
				Увесці
			</Button>
		</div>
	);
}
