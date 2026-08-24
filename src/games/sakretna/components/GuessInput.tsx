"use client";

import { useEffect, useRef } from "react";

interface GuessInputProps {
	value: string;
	onChange: (value: string) => void;
	onSubmit: () => void;
	disabled?: boolean;
	placeholder?: string;
}

export function GuessInput({
	value,
	onChange,
	onSubmit,
	disabled,
	placeholder = "Увядзіце слова…",
}: GuessInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				if (!disabled) onSubmit();
			}}
			className="w-full"
		>
			<label htmlFor="sakretna-guess" className="sr-only">
				Увядзіце слова
			</label>
			<div className="flex items-stretch gap-flow-sm">
				<input
					ref={inputRef}
					id="sakretna-guess"
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					disabled={disabled}
					placeholder={placeholder}
					autoComplete="off"
					spellCheck={false}
					inputMode="search"
					enterKeyHint="search"
					className="flex-1 min-w-0 min-h-(--control-min-height) rounded-2xl border-2 border-rule bg-card px-inset-md py-flow-md text-ink font-display text-base sm:text-lg focus:outline-none focus:border-sakretna transition-colors disabled:opacity-50"
				/>
				<button
					type="submit"
					disabled={disabled || value.trim().length === 0}
					className="hidden sm:block shrink-0 min-h-(--control-min-height) rounded-2xl border-2 border-sakretna bg-sakretna px-inset-md sm:px-inset-lg py-flow-md text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-sakretna/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakretna/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
				>
					Увесці
				</button>
			</div>
		</form>
	);
}
