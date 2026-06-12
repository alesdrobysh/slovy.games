"use client";

import { Lightbulb, Shuffle } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

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
	const disabled = wordsEarnTokenCount === 0;
	const fillPct = Math.min(wordsEarnTokenCount / 3, 1) * 100;

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

			<div
				style={{
					display: "inline-flex",
					borderRadius: "var(--radius-btn, 8px)",
					background: disabled
						? undefined
						: `linear-gradient(to top, var(--color-amber-400, #fbbf24) ${fillPct}%, transparent ${fillPct}%)`,
					transition: "background 0.4s ease",
				}}
			>
				<Button
					variant="ghost"
					color="neutral"
					aria-label="Падказка"
					onClick={onHint}
					disabled={disabled}
					size="lg"
					startIcon={<Lightbulb size={20} />}
				/>
			</div>

			<Button variant="solid" color="primary" size="lg" onClick={onSubmit}>
				Увесці
			</Button>
		</div>
	);
}
