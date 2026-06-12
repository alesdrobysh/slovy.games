import { scoreWord } from "@/games/valoshka/lib/scoring";
import { validateWord } from "@/games/valoshka/lib/validation";
import type { GameAction, GameState, Puzzle } from "@/games/valoshka/types";

export function shuffleArray<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function hintRevealIndices(wordLength: number): number[] {
	const count = Math.max(2, Math.ceil(wordLength * 0.33));
	const last = wordLength - 1;
	if (count === 2) return [0, last];
	return [0, 1, last];
}

export function createInitialState(puzzle: Puzzle): GameState {
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
		wordsEarnTokenCount: 0,
	};
}

export function gameReducer(state: GameState, action: GameAction): GameState {
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
			const isHintedWord = word === state.hint.targetWord;
			return {
				...state,
				currentInput: "",
				foundWords: newFoundWords,
				score: state.score + pts,
				errorType: null,
				lastFoundWord: word,
				lastFoundIsPangram: isPangram,
				hint: isHintedWord
					? { targetWord: null, revealedIndices: [], isActive: false }
					: state.hint,
				wordsEarnTokenCount: isHintedWord
					? state.wordsEarnTokenCount
					: Math.min(9, state.wordsEarnTokenCount + 1),
			};
		}

		case "SHUFFLE":
			return { ...state, outerLetters: shuffleArray(state.outerLetters) };

		case "CLEAR_ERROR":
			return { ...state, errorType: null };

		case "CLEAR_LAST_FOUND":
			return { ...state, lastFoundWord: null, lastFoundIsPangram: false };

		case "RESTORE_STATE":
			return {
				...state,
				foundWords: action.foundWords,
				score: action.score,
				hint: action.hint ?? { targetWord: null, revealedIndices: [], isActive: false },
				wordsEarnTokenCount: action.wordsEarnTokenCount ?? 0,
			};

		case "START_HINT": {
			if (state.wordsEarnTokenCount < 3) return state;
			const unfound = action.answers.filter(
				(w: string) => !action.foundWords.includes(w)
			);
			if (unfound.length === 0) return state;
			const target = unfound[Math.floor(Math.random() * unfound.length)];
			return {
				...state,
				wordsEarnTokenCount: state.wordsEarnTokenCount - 3,
				hint: {
					targetWord: target,
					revealedIndices: hintRevealIndices(target.length),
					isActive: true,
				},
			};
		}

		case "REVEAL_NEXT_LETTER": {
			if (state.wordsEarnTokenCount < 3) return state;
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
				wordsEarnTokenCount: state.wordsEarnTokenCount - 3,
				hint: {
					...state.hint,
					revealedIndices: [...revealedIndices, hidden[0]],
				},
			};
		}

		default:
			return state;
	}
}
