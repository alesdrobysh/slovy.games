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
	useHint: (lemma: string) => void;
	giveUp: () => void;
	setHighlight: (lemma: string | null) => void;
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

	// Restore from localStorage once per puzzle
	const restoredKeyRef = useRef<string | null>(null);
	useEffect(() => {
		const key = `${date}:${article.id}`;
		if (restoredKeyRef.current === key) return;
		restoredKeyRef.current = key;
		const saved = loadProgress(date);
		if (saved && saved.articleId === article.id) {
			// Wins reveal the whole article, including games won before that
			// behaviour shipped, which stored only the guessed lemmas.
			const progress = saved.won
				? {
						...saved,
						foundLemmas: [
							...new Set([...saved.foundLemmas, ...collectLemmas(tokens)]),
						],
					}
				: saved;
			dispatch({ type: "RESTORE", progress });
		}
		persistedRef.current = true;
	}, [date, article.id, tokens]);

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
		useHint: (lemma) =>
			dispatch({
				type: "USE_HINT",
				lemma,
				revealedCount: tokens.filter(
					(token) => token.type === "word" && token.lemma === lemma
				).length,
				titleLemmas: titleLemmaSet,
			}),
		giveUp: () =>
			dispatch({
				type: "GIVE_UP",
				lemmas: [...lemmaSet],
			}),
		setHighlight: (lemma: string | null) =>
			dispatch({ type: "SET_HIGHLIGHT", lemma }),
	};
}
