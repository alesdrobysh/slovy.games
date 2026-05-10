"use client";

import { ERROR_MESSAGES } from "@/games/valoshka/lib/validation";
import type { ValidationError } from "@/games/valoshka/types";

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
						className="petal-rise rounded-full px-4 py-1.5 text-sm font-semibold"
						style={{
							background: "var(--sly-red-500)",
							color: "#fff",
							fontFamily: "var(--sly-font-sans)",
							letterSpacing: "0.01em",
							zIndex: 100,
						}}
					>
						{ERROR_MESSAGES[errorType]}
					</span>
				) : lastFoundWord ? (
					<span
						key={`suc-${successKey}`}
						className="petal-rise rounded-full px-4 py-1.5 text-sm font-semibold"
						style={{
							background: "var(--sly-cornflower)",
							color: "#fff",
							fontFamily: "var(--sly-font-sans)",
							letterSpacing: "0.01em",
							zIndex: 100,
						}}
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
							background: "var(--sly-cornflower)",
							display: "inline-block",
							borderRadius: "1px",
						}}
					/>
				) : (
					<div className="flex items-center gap-0.5">
						{value.split("").map((ch, i) => {
							const isCenter = ch === center;
							const posKey = `pos-${i}`;
							return (
								<span
									key={posKey}
									style={{
										fontFamily: "var(--sly-font-display)",
										fontSize: "40px",
										color: isCenter
											? "var(--sly-cornflower)"
											: "var(--sly-text)",
										fontWeight: "400",
										lineHeight: 1,
										letterSpacing: "0.01em",
									}}
								>
									{ch.toUpperCase()}
								</span>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
