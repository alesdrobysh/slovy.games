"use client";

import { ERROR_MESSAGES } from "@/games/valoshka/lib/validation";
import type { ValidationError } from "@/games/valoshka/types";
import { Typography } from "@/shared/components/ui/Typography";

const SUCCESS_MESSAGES = [
	"Добра!",
	"Выдатна!",
	"Цудоўна!",
	"Класна!",
	"Так трымаць!",
];

interface InputDisplayProps {
	value: string;
	center: string;
	errorType: ValidationError | null;
	errorKey: number;
	lastFoundWord: string | null;
	lastFoundIsPangram: boolean;
	successKey: number;
}

export function InputDisplay({
	value,
	center,
	errorType,
	errorKey,
	lastFoundWord,
	lastFoundIsPangram,
	successKey,
}: InputDisplayProps) {
	const cursor = value.length === 0;
	const successMsg = SUCCESS_MESSAGES[successKey % SUCCESS_MESSAGES.length];

	return (
		<div className="flex flex-col items-center gap-1">
			{/* Toast slot */}
			<div className="h-6 flex items-center">
				{errorType ? (
					<span
						key={`err-${errorKey}`}
						className="petal-rise rounded-full px-inset-sm py-flow-xs text-sm font-semibold font-sans bg-destructive text-white z-30"
					>
						{ERROR_MESSAGES[errorType]}
					</span>
				) : lastFoundWord ? (
					<span
						key={`suc-${successKey}`}
						className="petal-rise rounded-full px-inset-sm py-flow-xs text-sm font-semibold font-sans bg-valoshka text-white z-30"
					>
						{lastFoundIsPangram ? "Панграма! 🤍" : successMsg}
					</span>
				) : null}
			</div>

			{/* Input letters */}
			<div
				key={`input-${errorKey}`}
				className={errorType ? "shake" : ""}
				style={{ minHeight: "44px", display: "flex", alignItems: "center" }}
			>
				{cursor ? (
					<span
						className="cursor-blink"
						style={{
							width: "2px",
							height: "44px",
							background: "var(--valoshka)",
							display: "inline-block",
							borderRadius: "1px",
						}}
					/>
				) : (
					<div className="flex items-center gap-0.5">
						{value.split("").map((ch, i) => {
							const isCenter = ch === center;
							return (
								<Typography
									key={`letter-${i}-${ch}`}
									variant="gameInput"
									className={isCenter ? "text-valoshka" : "text-ink"}
								>
									{ch.toUpperCase()}
								</Typography>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
