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
		const selection = window.getSelection();
		if (!selection?.rangeCount) return;
		selection.deleteFromDocument();
		selection.getRangeAt(0).insertNode(document.createTextNode(text));
		selection.collapseToEnd();
		handleInput();
	};

	return (
		<div className="mb-4">
			{/* Input row */}
			<div className="flex gap-2">
				<span className="sr-only" id="guess-label">
					Увядзіце слова для здагадкі
				</span>
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
						aria-labelledby="guess-label"
						tabIndex={0}
						spellCheck={false}
						autoCorrect="off"
						autoCapitalize="none"
						inputMode="text"
						enterKeyHint="send"
						suppressContentEditableWarning
						className="text-lg text-ink outline-none min-h-[1.5rem] w-full empty:before:content-['Увядзіце\00a0слова...'] empty:before:text-ink-muted text-left"
					/>
				</label>

				{!isDisabled && (
					<button
						onClick={onSubmit}
						disabled={loading}
						aria-label="Адправіць здагадку"
						type="button"
						className="hidden sm:flex w-12 h-12 items-center justify-center rounded-xl bg-pobach text-white hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pobach/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
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
					<button
						type="button"
						onClick={onHint}
						disabled={loading}
						aria-label="Атрымаць падказку"
						className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-pobach border border-pobach rounded-full hover:bg-pobach/5 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pobach/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
					>
						<svg
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
							<path d="M9 18h6" />
							<path d="M10 22h4" />
						</svg>
						Падказка
					</button>
				)}
				{!won && guessCount >= 10 && !gameOver && (
					<button
						type="button"
						onClick={onGiveUp}
						disabled={loading}
						className="text-ink-muted hover:text-destructive transition-colors disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm"
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
