"use client";

import { Lightbulb } from "lucide-react";
import "./HintButton.css";

interface HintButtonProps {
	wordsEarnTokenCount: number;
	onClick: () => void;
}

export function HintButton({ wordsEarnTokenCount, onClick }: HintButtonProps) {
	const disabled = wordsEarnTokenCount < 1;
	const fillPct = Math.min(wordsEarnTokenCount, 1) * 100;
	const hasToken = wordsEarnTokenCount >= 1;

	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onClick}
			aria-label="Падказка"
			className={`hint-btn${hasToken ? " hint-btn--ready" : ""}`}
			style={{ "--hint-fill": `${fillPct}%` } as React.CSSProperties}
		>
			<Lightbulb />
		</button>
	);
}
