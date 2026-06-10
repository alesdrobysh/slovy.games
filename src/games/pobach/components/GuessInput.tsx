import { useEffect, useRef } from "react";
import { ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { ErrorMessage } from "@/shared/components/ui/ErrorMessage";

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
		<div className="mb-flow-lg">
			{/* Input row */}
			<div className="flex gap-flow-sm">
				<span className="sr-only" id="guess-label">
					Увядзіце слова для здагадкі
				</span>
				{/* biome-ignore lint/a11y/noLabelWithoutControl: contenteditable div serves as input */}
				<label className="flex-1 bg-card border border-rule rounded-xl px-inset-sm py-inset-sm flex items-center focus-within:border-pobach focus-within:ring-2 focus-within:ring-pobach/20 transition-all cursor-text text-left">
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
						className="text-lg text-ink outline-none min-h-inset-lg w-full empty:before:content-['Увядзіце\00a0слова...'] empty:before:text-ink-muted text-left"
					/>
				</label>

				{!isDisabled && (
					<div className="hidden sm:contents">
						<Button
							variant="solid"
							color="primary"
							onClick={() => onSubmit({ preventDefault: () => {} } as React.FormEvent)}
							disabled={loading}
							aria-label="Адправіць здагадку"
							size="xl"
							className="shrink-0"
							startIcon={<ArrowRight size={16} aria-hidden="true" />}
						/>
					</div>
				)}
			</div>

			{error && (
				<ErrorMessage id="error-message" message={error} word={errorWord} />
			)}

			{/* Action buttons row */}
			<div className="flex items-center justify-center gap-flow-md mt-flow-md">
				{!won && !gameOver && (
					<Button
						variant="outline"
						color="primary"
						size="sm"
						onClick={onHint}
						disabled={loading}
						aria-label="Атрымаць падказку"
						startIcon={<Lightbulb size={12} aria-hidden="true" />}
					>
						Падказка
					</Button>
				)}
				{!won && guessCount >= 10 && !gameOver && (
					<Button
						variant="outline"
						color="neutral"
						size="sm"
						dashed
						onClick={onGiveUp}
						disabled={loading}
					>
						Здацца
					</Button>
				)}
			</div>
		</div>
	);
}
