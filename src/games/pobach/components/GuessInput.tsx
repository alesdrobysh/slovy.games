import { useEffect, useRef } from "react";

type GuessInputProps = {
	input: string;
	setInput: (value: string) => void;
	onSubmit: (e: React.FormEvent) => void;
	onHint: () => void;
	onGiveUp: () => void;
	loading: boolean;
	won: boolean;
	gameOver: boolean;
	error: string | null;
	errorWord: string | null;
	guessCount: number;
	bestRank?: number | null;
};

export default function GuessInput({
	input,
	setInput,
	onSubmit,
	onHint,
	onGiveUp,
	loading,
	won,
	gameOver,
	error,
	errorWord,
	guessCount,
	bestRank,
}: GuessInputProps) {
	const divRef = useRef<HTMLDivElement>(null);
	const isDisabled = won || gameOver;

	useEffect(() => {
		if (input === "" && divRef.current && divRef.current.textContent !== "") {
			divRef.current.textContent = "";
		}
	}, [input]);

	const handleInput = () => {
		const text = divRef.current?.textContent ?? "";
		setInput(text);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			onSubmit(e);
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
		e.preventDefault();
		const text = e.clipboardData.getData("text/plain");
		document.execCommand("insertText", false, text);
	};

	return (
		<div className="mb-4">
			{/* Input row */}
			<div className="flex gap-2">
				{/* biome-ignore lint/a11y/noLabelWithoutControl: contenteditable div serves as input */}
				<label className="flex-1 bg-card border border-rule rounded-xl px-4 py-3 flex items-center focus-within:border-pobach focus-within:ring-2 focus-within:ring-pobach/20 transition-all cursor-text text-left">
					{/* biome-ignore lint/a11y/useSemanticElements: contenteditable suppresses Chrome Android autofill */}
					<div
						ref={divRef}
						contentEditable={!isDisabled}
						onInput={handleInput}
						onKeyDown={handleKeyDown}
						onPaste={handlePaste}
						role="textbox"
						aria-label="Увядзіце слова для здагадкі"
						aria-placeholder="Увядзіце слова..."
						tabIndex={0}
						spellCheck={false}
						autoCorrect="off"
						autoCapitalize="none"
						inputMode="text"
						enterKeyHint="send"
						suppressContentEditableWarning
						className="text-lg text-ink outline-none min-h-[1.5rem] w-full empty:before:content-['Увядзіце_слова...'] empty:before:text-ink-muted text-left"
					/>
				</label>

				{!isDisabled && (
					<button
						onClick={onSubmit}
						disabled={loading}
						aria-label="Адправіць здагадку"
						type="button"
						className="hidden sm:flex w-12 h-12 items-center justify-center rounded-xl bg-pobach text-white hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 shrink-0"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M2 8h12M9 3l5 5-5 5"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
				)}
			</div>

			{/* Error message */}
			{error && (
				<div
					id="error-message"
					role="alert"
					className="mt-2 text-sm text-destructive"
				>
					{errorWord && (
						<>
							<strong>&laquo;{errorWord}&raquo;</strong> —{" "}
						</>
					)}
					{error}
				</div>
			)}

			{/* Action buttons row */}
			<div className="flex items-center justify-center gap-3 mt-3 text-sm">
				{!won && !gameOver && (
					<>
						<button
							type="button"
							onClick={onHint}
							disabled={loading}
							className="text-ink-muted hover:text-ink transition-colors disabled:opacity-30"
						>
							Падказка
						</button>
						<span className="text-ink-soft">·</span>
					</>
				)}
				{!won && guessCount >= 10 && !gameOver && (
					<button
						type="button"
						onClick={onGiveUp}
						disabled={loading}
						className="text-ink-muted hover:text-destructive transition-colors disabled:opacity-30"
					>
						Здацца
					</button>
				)}
				{bestRank !== null && (
					<span className="ml-auto text-xs text-ink-soft">
						Найлепшы ранг:{" "}
						<span className="text-ink font-medium">{bestRank}</span>
					</span>
				)}
			</div>
		</div>
	);
}
