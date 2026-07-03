"use client";

import { Lightbulb } from "lucide-react";
import "./HintButton.css";

interface HintButtonProps {
	hintCredits: number;
	onClick: () => void;
}

export function HintButton({ hintCredits, onClick }: HintButtonProps) {
	const disabled = Math.floor(hintCredits) < 1;
	const fillPct = (hintCredits % 1) * 100;
	const hasCredit = Math.floor(hintCredits) >= 1;
	const creditCount = Math.floor(hintCredits);

	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onClick}
			aria-label="Падказка"
			className={`hint-btn${hasCredit ? " hint-btn--ready" : ""}`}
			style={{ "--hint-fill": `${fillPct}%` } as React.CSSProperties}
		>
			<Lightbulb />
			{creditCount > 0 && (
				<span className="hint-btn__badge">{creditCount}</span>
			)}
		</button>
	);
}
