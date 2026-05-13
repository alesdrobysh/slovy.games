"use client";

import { useCallback, useEffect, useReducer, useState } from "react";
import { getRankIndex, scoreWord } from "@/games/valoshka/lib/scoring";
import {
	loadProgress,
	saveProgress,
	updateStatsForDate,
} from "@/games/valoshka/lib/storage";
import { validateWord } from "@/games/valoshka/lib/validation";
import type { GameAction, GameState, Puzzle } from "@/games/valoshka/types";
import { ActionButtons } from "./ActionButtons";
import { Cornflower } from "./Cornflower";
import { FoundWordsList } from "./FoundWordsList";
import { HintDisplay } from "./HintDisplay";
import { HowToPlay, useHowToPlay } from "./HowToPlay";
import { InputDisplay } from "./InputDisplay";
import { ProgressBar } from "./ProgressBar";

function shuffleArray<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function createInitialState(puzzle: Puzzle): GameState {
	return {
		currentInput: "",
		foundWords: [],
		score: 0,
		outerLetters: [...puzzle.outer],
		errorType: null,
		errorKey: 0,
		lastFoundWord: null,
		lastFoundIsPangram: false,
		hint: {
			targetWord: null,
			revealedIndices: [],
			isActive: false,
		},
	};
}

function gameReducer(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case "TYPE_LETTER":
			return {
				...state,
				currentInput: state.currentInput + action.letter,
				errorType: null,
			};

		case "DELETE_LETTER":
			return {
				...state,
				currentInput: state.currentInput.slice(0, -1),
				errorType: null,
			};

		case "SUBMIT": {
			const word = state.currentInput.toLowerCase();
			const error = validateWord(
				word,
				action.center,
				action.answers,
				state.foundWords
			);
			if (error) {
				return {
					...state,
					errorType: error,
					errorKey: state.errorKey + 1,
					currentInput: error === "already_found" ? "" : state.currentInput,
				};
			}
			const pts = scoreWord(word, action.pangrams);
			const isPangram = action.pangrams.includes(word);
			const newFoundWords = [...state.foundWords, word];
			return {
				...state,
				currentInput: "",
				foundWords: newFoundWords,
				score: state.score + pts,
				errorType: null,
				lastFoundWord: word,
				lastFoundIsPangram: isPangram,
				hint: {
					...state.hint,
					...(word === state.hint.targetWord
						? {
								targetWord: null,
								revealedIndices: [],
								isActive: false,
							}
						: {}),
				},
			};
		}

		case "SHUFFLE":
			return {
				...state,
				outerLetters: shuffleArray(state.outerLetters),
			};

		case "CLEAR_ERROR":
			return { ...state, errorType: null };

		case "CLEAR_LAST_FOUND":
			return { ...state, lastFoundWord: null, lastFoundIsPangram: false };

		case "RESTORE":
			return {
				...state,
				foundWords: action.foundWords,
				score: action.score,
			};

		case "START_HINT": {
			const unfound = action.answers.filter(
				(w: string) => !action.foundWords.includes(w)
			);
			if (unfound.length === 0) return state;
			const target = unfound[Math.floor(Math.random() * unfound.length)];
			const lastIdx = target.length - 1;
			return {
				...state,
				hint: {
					targetWord: target,
					revealedIndices: [0, 1, lastIdx],
					isActive: true,
				},
			};
		}

		case "REVEAL_NEXT_LETTER": {
			const { targetWord, revealedIndices } = state.hint;
			if (!targetWord) return state;
			const allIndices = targetWord.split("").map((_, i: number) => i);
			const hidden = allIndices.filter(
				(i: number) =>
					!revealedIndices.includes(i) && i !== targetWord.length - 1
			);
			if (hidden.length === 0) return state;
			return {
				...state,
				hint: {
					...state.hint,
					revealedIndices: [...revealedIndices, hidden[0]],
				},
			};
		}

		case "CLEAR_HINT":
			return {
				...state,
				hint: {
					targetWord: null,
					revealedIndices: [],
					isActive: false,
				},
			};

		case "RESTORE_HINT":
			return {
				...state,
				hint: action.hint,
			};

		default:
			return state;
	}
}

interface GamePageProps {
	puzzle: Puzzle;
}

export function GamePage({ puzzle }: GamePageProps) {
	const [state, dispatch] = useReducer(gameReducer, puzzle, createInitialState);
	const [wordsOpen, setWordsOpen] = useState(false);
	const [successKey, setSuccessKey] = useState(0);
	const { isOpen: showHowToPlay, close: closeHowToPlay } = useHowToPlay();

	// Restore progress from localStorage on mount
	useEffect(() => {
		const saved = loadProgress(puzzle.date);
		if (saved) {
			dispatch({
				type: "RESTORE",
				foundWords: saved.foundWords,
				score: saved.score,
			});
			if (saved.hint) {
				dispatch({
					type: "RESTORE_HINT",
					hint: saved.hint,
				});
			}
		}
	}, [puzzle.date]);

	// Save progress whenever foundWords changes
	useEffect(() => {
		if (state.foundWords.length > 0 || state.hint.isActive) {
			saveProgress({
				date: puzzle.date,
				foundWords: state.foundWords,
				score: state.score,
				hint: state.hint.isActive ? state.hint : undefined,
			});
			const rankIdx = getRankIndex(state.score, puzzle.max_score);
			updateStatsForDate(puzzle.date, rankIdx, state.foundWords.length);
		}
	}, [
		state.foundWords,
		state.score,
		state.hint,
		puzzle.date,
		puzzle.max_score,
	]);

	// Clear error toast after delay
	// biome-ignore lint/correctness/useExhaustiveDependencies: errorKey is intentional re-trigger
	useEffect(() => {
		if (state.errorType) {
			const t = setTimeout(() => dispatch({ type: "CLEAR_ERROR" }), 1500);
			return () => clearTimeout(t);
		}
	}, [state.errorType, state.errorKey]);

	// Clear last found word after animation
	useEffect(() => {
		if (state.lastFoundWord) {
			setSuccessKey((k) => k + 1);
			const t = setTimeout(() => dispatch({ type: "CLEAR_LAST_FOUND" }), 1400);
			return () => clearTimeout(t);
		}
	}, [state.lastFoundWord]);

	// Keyboard input
	const handleKey = useCallback(
		(e: KeyboardEvent) => {
			if (e.ctrlKey || e.metaKey || e.altKey) return;
			if (e.key === "Enter") {
				dispatch({
					type: "SUBMIT",
					answers: puzzle.answers,
					pangrams: puzzle.pangrams,
					center: puzzle.center,
				});
			} else if (e.key === "Backspace") {
				dispatch({ type: "DELETE_LETTER" });
			} else if (/^[а-яёіўА-ЯЁІЎ]$/u.test(e.key)) {
				dispatch({ type: "TYPE_LETTER", letter: e.key.toLowerCase() });
			}
		},
		[puzzle.answers, puzzle.pangrams, puzzle.center]
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKey);
		return () => document.removeEventListener("keydown", handleKey);
	}, [handleKey]);

	const handleLetter = useCallback((letter: string) => {
		dispatch({ type: "TYPE_LETTER", letter });
	}, []);

	const handleDelete = useCallback(() => {
		dispatch({ type: "DELETE_LETTER" });
	}, []);

	const [shuffleCount, setShuffleCount] = useState(0);

	const handleShuffle = useCallback(() => {
		dispatch({ type: "SHUFFLE" });
		setShuffleCount((c) => c + 1);
	}, []);

	const handleSubmit = useCallback(() => {
		dispatch({
			type: "SUBMIT",
			answers: puzzle.answers,
			pangrams: puzzle.pangrams,
			center: puzzle.center,
		});
	}, [puzzle.answers, puzzle.pangrams, puzzle.center]);

	const handleStartHint = useCallback(() => {
		dispatch({
			type: "START_HINT",
			answers: puzzle.answers,
			foundWords: state.foundWords,
		});
	}, [puzzle.answers, state.foundWords]);

	const handleCancelHint = useCallback(() => {
		dispatch({ type: "CLEAR_HINT" });
	}, []);

	return (
		<div className="mx-auto max-w-5xl px-5 sm:px-8 select-none font-sans">
			{/* Mobile: collapsible words toggle */}
			<div className="lg:hidden border-b border-rule py-2">
				<button
					type="button"
					onClick={() => setWordsOpen((o) => !o)}
					className="flex items-center gap-1.5 text-sm font-semibold text-ink-muted bg-transparent border-none cursor-pointer p-1"
				>
					Словы ({state.foundWords.length})
					{!wordsOpen && state.foundWords.length > 0 && (
						<span className="text-ink-muted font-normal ml-2">
							{state.foundWords
								.slice(-2)
								.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
								.join("  ")}
						</span>
					)}
					<span
						className="text-[10px] inline-block transition-transform"
						style={{
							transform: wordsOpen ? "rotate(180deg)" : "rotate(0deg)",
						}}
					>
						▾
					</span>
				</button>
			</div>

			{/* Mobile: collapsible words panel */}
			{wordsOpen && (
				<div
					className="lg:hidden py-3"
					style={{ maxHeight: "40vh", overflowY: "auto" }}
				>
					<FoundWordsList
						words={state.foundWords}
						pangrams={puzzle.pangrams}
						lastFoundWord={state.lastFoundWord}
					/>
				</div>
			)}

			{/* Main area */}
			<div className="flex flex-col items-center gap-2 py-2 sm:gap-4 sm:py-4 lg:flex-row lg:items-start lg:gap-14 lg:py-8">
				{/* Left: game controls */}
				<div className="flex flex-col items-center gap-2 sm:gap-4 w-full max-w-sm lg:max-w-none lg:w-[380px]">
					<div className="w-full">
						<ProgressBar
							score={state.score}
							maxScore={puzzle.max_score}
							date={puzzle.date}
							foundCount={state.foundWords.length}
							totalWords={puzzle.answers.length}
						/>
					</div>

					<InputDisplay
						value={state.currentInput}
						center={puzzle.center}
						errorType={state.errorType}
						errorKey={state.errorKey}
						lastFoundWord={state.lastFoundWord}
						lastFoundIsPangram={state.lastFoundIsPangram}
						successKey={successKey}
					/>

					<div className="w-full max-w-sm" style={{ height: "38px" }}>
						{state.hint.isActive && (
							<HintDisplay hint={state.hint} onCancel={handleCancelHint} />
						)}
					</div>

					<div
						style={{
							width: "100%",
							maxWidth: "min(370px, calc(100vw - 60px))",
							touchAction: "none",
						}}
					>
						<Cornflower
							center={puzzle.center}
							outer={state.outerLetters}
							onLetter={handleLetter}
							shuffleCount={shuffleCount}
						/>
					</div>

					<ActionButtons
						onDelete={handleDelete}
						onShuffle={handleShuffle}
						onSubmit={handleSubmit}
						onHint={handleStartHint}
					/>
				</div>

				{/* Right: found words — desktop only */}
				<div className="hidden lg:block flex-1 min-h-0 pt-10">
					<FoundWordsList
						words={state.foundWords}
						pangrams={puzzle.pangrams}
						lastFoundWord={state.lastFoundWord}
					/>
				</div>
			</div>

			{showHowToPlay && (
				<HowToPlay isOpen={showHowToPlay} onClose={closeHowToPlay} />
			)}
		</div>
	);
}
