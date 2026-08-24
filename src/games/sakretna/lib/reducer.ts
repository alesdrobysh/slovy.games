import type { GameAction, GameState, SavedProgress } from "../types";
import { normalizeGuess, validateGuess } from "./validation";

export function createInitialState(): GameState {
	return {
		currentInput: "",
		foundLemmas: [],
		guesses: [],
		errorType: null,
		errorKey: 0,
		won: false,
		givenUp: false,
		hintsUsed: 0,
		finishedAt: null,
		highlighted: null,
	};
}

export function gameReducer(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case "SET_INPUT":
			return {
				...state,
				currentInput: action.value,
				errorType: null,
				highlighted: null,
			};

		case "CLEAR_ERROR":
			return { ...state, errorType: null, highlighted: null };

		case "SUBMIT_GUESS": {
			if (state.won || state.givenUp) {
				return {
					...state,
					errorType: "no_guesses_after_finish",
					errorKey: state.errorKey + 1,
				};
			}
			const result = validateGuess(
				action.rawGuess,
				action.tokens,
				new Set(state.foundLemmas),
				action.titleLemmas
			);
			if (result.error) {
				return {
					...state,
					guesses:
						result.error === "not_in_article"
							? [...state.guesses, normalizeGuess(action.rawGuess)]
							: state.guesses,
					errorType: result.error,
					errorKey: state.errorKey + 1,
				};
			}
			if (!result.lemma) return state;
			const lemma = result.lemma;
			const foundLemmas = [...state.foundLemmas, lemma];
			const won =
				action.titleLemmas.size > 0 &&
				[...action.titleLemmas].every((l) => foundLemmas.includes(l));
			return {
				...state,
				currentInput: "",
				errorType: null,
				foundLemmas,
				guesses: [...state.guesses, lemma],
				won,
				finishedAt: won ? new Date().toISOString() : state.finishedAt,
				highlighted: lemma,
			};
		}

		case "USE_HINT":
			if (state.won || state.givenUp) return state;
			if (state.hintsUsed >= 1) return state;
			return {
				...state,
				hintsUsed: state.hintsUsed + 1,
				foundLemmas: action.lemma
					? [...state.foundLemmas, action.lemma]
					: state.foundLemmas,
			};

		case "GIVE_UP":
			if (state.won || state.givenUp) return state;
			return {
				...state,
				foundLemmas: [...new Set([...state.foundLemmas, ...action.lemmas])],
				won: false,
				givenUp: true,
				finishedAt: new Date().toISOString(),
			};

		case "RESTORE":
			return progressToState(action.progress);

		case "SET_HIGHLIGHT":
			return { ...state, highlighted: action.lemma };

		default:
			return state;
	}
}

export function progressToState(p: SavedProgress): GameState {
	return {
		currentInput: "",
		foundLemmas: [...p.foundLemmas],
		guesses: [...p.guesses],
		errorType: null,
		errorKey: 0,
		won: p.won,
		givenUp: p.givenUp,
		hintsUsed: p.hintsUsed,
		finishedAt: p.finishedAt ?? null,
		highlighted: null,
	};
}

export function stateToProgress(
	date: string,
	articleId: string,
	state: GameState
): SavedProgress {
	return {
		date,
		articleId,
		foundLemmas: [...state.foundLemmas],
		guesses: [...state.guesses],
		won: state.won,
		givenUp: state.givenUp,
		hintsUsed: state.hintsUsed,
		finishedAt: state.finishedAt ?? undefined,
	};
}
