"use client";

import { Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/shared/components/ui/Button";

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
		// On touch devices focusing on mount pops the keyboard over the
		// article before the player has read a word of it.
		if (window.matchMedia?.("(pointer: coarse)").matches) return;
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
					className="flex-1 min-w-0 h-(--control-large-height) rounded-lg border border-rule bg-card px-inset-sm text-ink font-display text-base focus:outline-none focus:border-(--accent) transition-colors disabled:opacity-50"
				/>
				<Button
					type="submit"
					variant="solid"
					color="primary"
					size="lg"
					disabled={disabled || value.trim().length === 0}
					startIcon={<Search />}
				>
					Увесці
				</Button>
			</div>
		</form>
	);
}
