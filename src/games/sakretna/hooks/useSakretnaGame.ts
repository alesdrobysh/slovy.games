"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { lemmaReady } from "@/games/sakretna/lib/lemmatize";
import {
	createInitialState,
	gameReducer,
	stateToProgress,
} from "@/games/sakretna/lib/reducer";
import {
	loadProgress,
	recordResult,
	saveProgress,
} from "@/games/sakretna/lib/storage";
import { collectLemmas, titleLemmas } from "@/games/sakretna/lib/tokenize";
import type { ArticleToken, GameState, PickedArticle } from "../types";

export interface UseSakretnaGameReturn {
	state: GameState;
	tokens: ArticleToken[];
	lemmaSet: Set<string>;
	titleLemmaSet: Set<string>;
	ready: boolean;
	setInput: (value: string) => void;
	submitGuess: () => void;
	useHint: () => void;
	giveUp: () => void;
}

/** Pick a random still-hidden, non-free, non-title word to reveal as a hint. */
function pickHintLemma(
	tokens: ArticleToken[],
	foundLemmas: ReadonlySet<string>,
	titleLemmaSet: ReadonlySet<string>
): string | null {
	const candidates = new Set<string>();
	for (const t of tokens) {
		if (
			t.type === "word" &&
			t.lemma &&
			!t.isFree &&
			!foundLemmas.has(t.lemma) &&
			!titleLemmaSet.has(t.lemma)
		) {
			candidates.add(t.lemma);
		}
	}
	if (candidates.size === 0) return null;
	const pool = [...candidates];
	return pool[Math.floor(Math.random() * pool.length)];
}

export function useSakretnaGame(picked: PickedArticle): UseSakretnaGameReturn {
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
	const titleLemmaSet = titleLemmas(article.title);

	return {
		state,
		tokens,
		lemmaSet,
		titleLemmaSet,
		ready,
		setInput: (value) => dispatch({ type: "SET_INPUT", value }),
		submitGuess: () =>
			dispatch({
				type: "SUBMIT_GUESS",
				rawGuess: state.currentInput,
				tokens,
				titleLemmas: titleLemmaSet,
			}),
		useHint: () =>
			dispatch({
				type: "USE_HINT",
				lemma: pickHintLemma(tokens, new Set(state.foundLemmas), titleLemmaSet),
			}),
		giveUp: () => dispatch({ type: "GIVE_UP" }),
	};
}
