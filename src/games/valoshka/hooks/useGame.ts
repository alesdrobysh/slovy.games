"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { trackValoshkaGameStarted, trackValoshkaHintUsed, trackValoshkaVasiliokReached, trackValoshkaWordFound } from "@/games/valoshka/lib/analytics";
import { triggerConfetti } from "@/games/valoshka/lib/confetti";
import { vibrate } from "@/games/valoshka/lib/haptics";
import { createInitialState, gameReducer } from "@/games/valoshka/lib/reducer";
import { getRankIndex } from "@/games/valoshka/lib/scoring";
import {
	loadProgress,
	saveProgress,
	updateStatsForDate,
} from "@/games/valoshka/lib/storage";
import type { GameState, Puzzle } from "@/games/valoshka/types";

export interface UseGameState extends GameState {
	wordsOpen: boolean;
	shuffleCount: number;
	successKey: number;
	companionGridOpen: boolean;
}

export interface UseGameActions {
	handleLetter(letter: string): void;
	handleDelete(): void;
	handleShuffle(): void;
	handleSubmit(): void;
	handleStartHint(): void;
	toggleWordsOpen(): void;
	toggleCompanionGrid(): void;
}

export interface UseGameReturn {
	state: UseGameState;
	actions: UseGameActions;
}

export function useGame(puzzle: Puzzle): UseGameReturn {
	const [gameState, dispatch] = useReducer(
		gameReducer,
		puzzle,
		createInitialState
	);
	const [wordsOpen, setWordsOpen] = useState(false);
	const [shuffleCount, setShuffleCount] = useState(0);
	const [successKey, setSuccessKey] = useState(0);
	const [companionGridOpen, setCompanionGridOpen] = useState(false);
	const prevVasiliokReached = useRef(false);

	// Restore progress from localStorage on mount
	useEffect(() => {
		const saved = loadProgress(puzzle.date);
		if (saved) {
			const alreadyVasiliok =
				saved.vasiliokReached ||
				saved.score >= puzzle.max_score;
			dispatch({
				type: "RESTORE_STATE",
				foundWords: saved.foundWords,
				score: saved.score,
				hint: saved.hint,
				hintCredits: saved.hintCredits,
				wordsEarnTokenCount: saved.wordsEarnTokenCount,
				milestonesAwarded: saved.milestonesAwarded,
				vasiliokReached: alreadyVasiliok,
			});
			if (alreadyVasiliok) {
				prevVasiliokReached.current = true;
			}
		}
	}, [puzzle.date]);

	// Save progress whenever relevant state changes
	useEffect(() => {
		if (
			gameState.foundWords.length > 0 ||
			gameState.hint.isActive ||
			gameState.hintCredits > 0
		) {
			saveProgress({
				date: puzzle.date,
				foundWords: gameState.foundWords,
				score: gameState.score,
				hint: gameState.hint.isActive ? gameState.hint : undefined,
				hintCredits: gameState.hintCredits,
				milestonesAwarded: gameState.milestonesAwarded,
				vasiliokReached: gameState.vasiliokReached,
			});
			const rankIdx = getRankIndex(gameState.score, puzzle.max_score);
			updateStatsForDate(puzzle.date, rankIdx, gameState.foundWords.length);
		}
	}, [
		gameState.foundWords,
		gameState.score,
		gameState.hint,
		gameState.hintCredits,
		gameState.milestonesAwarded,
		gameState.vasiliokReached,
		puzzle.date,
		puzzle.max_score,
	]);

	// Clear error toast after delay
	// biome-ignore lint/correctness/useExhaustiveDependencies: errorKey is intentional re-trigger
	useEffect(() => {
		if (gameState.errorType) {
			const t = setTimeout(() => dispatch({ type: "CLEAR_ERROR" }), 1500);
			return () => clearTimeout(t);
		}
	}, [gameState.errorType, gameState.errorKey]);

	// Clear last found word after animation
	useEffect(() => {
		if (gameState.lastFoundWord) {
			setSuccessKey((k) => k + 1);
			const t = setTimeout(() => dispatch({ type: "CLEAR_LAST_FOUND" }), 1400);
			return () => clearTimeout(t);
		}
	}, [gameState.lastFoundWord]);

	// Trigger celebration when vasiliok is reached
	useEffect(() => {
		if (!gameState.vasiliokReached) return;
		if (!prevVasiliokReached.current) {
			prevVasiliokReached.current = true;
			vibrate("long");
			trackValoshkaVasiliokReached(
				gameState.foundWords.length,
				gameState.score
			);
		}
		triggerConfetti();
	}, [gameState.vasiliokReached]);

	// Track new words found
	const prevWordCount = useRef(0);
	useEffect(() => {
		const count = gameState.foundWords.length;
		if (count === 0) {
			prevWordCount.current = 0;
			return;
		}
		if (count > prevWordCount.current) {
			if (prevWordCount.current === 0) {
				trackValoshkaGameStarted();
			}
			const latestWord = gameState.foundWords[count - 1];
			const isPangram = puzzle.pangrams.includes(latestWord);
			trackValoshkaWordFound(latestWord, isPangram, gameState.score);
		}
		prevWordCount.current = count;
	}, [gameState.foundWords, puzzle.pangrams, puzzle.answers.length, gameState.score]);

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
					maxScore: puzzle.max_score,
				});
			} else if (e.key === "Backspace") {
				dispatch({ type: "DELETE_LETTER" });
			} else if (/^[а-яёіўА-ЯЁІЎ]$/u.test(e.key)) {
				dispatch({ type: "TYPE_LETTER", letter: e.key.toLowerCase() });
			}
		},
		[puzzle.answers, puzzle.pangrams, puzzle.center, puzzle.max_score]
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
			maxScore: puzzle.max_score,
		});
	}, [puzzle.answers, puzzle.pangrams, puzzle.center, puzzle.max_score]);

	const handleStartHint = useCallback(() => {
		dispatch({
			type: "START_HINT",
			answers: puzzle.answers,
			foundWords: gameState.foundWords,
		});
		trackValoshkaHintUsed();
	}, [puzzle.answers, gameState.foundWords]);

	const toggleWordsOpen = useCallback(() => {
		setWordsOpen((o) => !o);
	}, []);

	const toggleCompanionGrid = useCallback(() => {
		setCompanionGridOpen((o) => !o);
	}, []);

	return {
		state: {
			...gameState,
			wordsOpen,
			shuffleCount,
			successKey,
			companionGridOpen,
		},
		actions: {
			handleLetter,
			handleDelete,
			handleShuffle,
			handleSubmit,
			handleStartHint,
			toggleWordsOpen,
			toggleCompanionGrid,
		},
	};
}
