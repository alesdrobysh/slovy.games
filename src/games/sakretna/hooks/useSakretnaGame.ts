"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { lemmaReady } from "@/games/redaktle/lib/lemmatize";
import {
	createInitialState,
	gameReducer,
	stateToProgress,
} from "@/games/redaktle/lib/reducer";
import {
	loadProgress,
	recordResult,
	saveProgress,
} from "@/games/redaktle/lib/storage";
import { collectLemmas } from "@/games/redaktle/lib/tokenize";
import type { ArticleToken, GameState, PickedArticle } from "../types";

export interface UseRedactleGameReturn {
	state: GameState;
	tokens: ArticleToken[];
	lemmaSet: Set<string>;
	ready: boolean;
	setInput: (value: string) => void;
	submitGuess: () => void;
	useHint: () => void;
	claimWin: () => void;
	giveUp: () => void;
}

export function useRedactleGame(picked: PickedArticle): UseRedactleGameReturn {
	const { article, tokens, date } = picked;
	const [state, dispatch] = useReducer(
		gameReducer,
		undefined,
		createInitialState
	);
	const [ready, setReady] = useState(false);
	const persistedRef = useRef(false);

	// Wait for belmorph dictionary to load
	useEffect(() => {
		let cancelled = false;
		lemmaReady.then(() => {
			if (!cancelled) setReady(true);
		});
		return () => {
			cancelled = true;
		};
	}, []);

	// Restore from localStorage once on mount
	useEffect(() => {
		const saved = loadProgress(date);
		if (saved && saved.articleId === article.id) {
			dispatch({ type: "RESTORE", progress: saved });
		}
		persistedRef.current = true;
	}, [date, article.id]);

	// Persist on every state change (after the first restoration effect runs)
	useEffect(() => {
		if (!persistedRef.current || !ready) return;
		const progress = stateToProgress(date, article.id, state);
		saveProgress(progress);
		if (state.finishedAt) {
			recordResult(progress);
		}
	}, [state, date, article.id, ready]);

	const lemmaSet = collectLemmas(tokens);

	return {
		state,
		tokens,
		lemmaSet,
		ready,
		setInput: (value) => dispatch({ type: "SET_INPUT", value }),
		submitGuess: () =>
			dispatch({
				type: "SUBMIT_GUESS",
				rawGuess: state.currentInput,
				tokens,
			}),
		useHint: () => dispatch({ type: "USE_HINT" }),
		claimWin: () => dispatch({ type: "CLAIM_WIN" }),
		giveUp: () => dispatch({ type: "GIVE_UP" }),
	};
}
