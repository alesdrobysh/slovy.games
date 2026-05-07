import { Flag, Lightbulb } from "lucide-react";
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

  // Sync: when parent resets input to "" (after submit), clear the div
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
      {/* Row 1: input + submit */}
      <div className="flex gap-2">
        <button
          className="flex-1 h-12 border border-[var(--border)] rounded-xl px-4 flex items-center bg-[var(--card)] focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/20 transition-all cursor-text text-left"
          onClick={() => !isDisabled && divRef.current?.focus()}
          onKeyDown={(e) =>
            e.key === "Enter" && !isDisabled && divRef.current?.focus()
          }
          type="button"
          tabIndex={0}
          aria-label="Увядзіце слова для здагадкі"
        >
          {/* biome-ignore lint/a11y/useSemanticElements: contenteditable div used intentionally to suppress Chrome Android autofill bar */}
          <div
            ref={divRef}
            contentEditable={!isDisabled}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            role="textbox"
            aria-label="Увядзіце слова для здагадкі"
            aria-placeholder="Увядзіце слова..."
            aria-describedby={error ? "error-message" : undefined}
            tabIndex={0}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="none"
            inputMode="text"
            enterKeyHint="send"
            suppressContentEditableWarning
            className="text-lg text-[var(--text)] outline-none min-h-[1.5rem] w-full empty:before:content-['Увядзіце_слова...'] empty:before:text-[var(--text-muted)] text-left"
          />
        </button>
        {!isDisabled && (
          <button
            onClick={onSubmit}
            disabled={loading}
            aria-label="Адправіць здагадку"
            type="button"
            className="hidden sm:flex w-12 h-12 items-center justify-center rounded-xl bg-[var(--accent)] text-white hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
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

      {error && (
        <div
          id="error-message"
          role="alert"
          className="mt-2 text-sm text-red-500"
        >
          {errorWord && (
            <>
              <strong>«{errorWord}»</strong> —{" "}
            </>
          )}
          {error}
        </div>
      )}

      {/* Row 2: pill action buttons */}
      <div className="flex items-center justify-center gap-3 mt-3">
        {!won && !gameOver && (
          <button
            onClick={onHint}
            disabled={loading}
            aria-label="Атрымаць падказку"
            aria-disabled={loading}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[var(--accent)] border border-[var(--accent)] rounded-full hover:bg-[var(--accent)]/5 transition-colors disabled:opacity-50"
          >
            <Lightbulb size={12} />
            Падказка
          </button>
        )}
        {!won && guessCount >= 10 && !gameOver && (
          <button
            onClick={onGiveUp}
            disabled={loading}
            aria-label="Здацца і завяршыць гульню"
            aria-disabled={loading}
            type="button"
            data-testid="give-up-button"
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[var(--text-muted)] border border-[var(--border)] rounded-full hover:bg-[var(--border)] transition-colors disabled:opacity-50"
          >
            <Flag size={12} />
            Здацца
          </button>
        )}
      </div>
    </div>
  );
}
