"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { trackSakretnaTransition } from "@/games/sakretna/lib/analytics";
import { triggerConfetti } from "@/games/sakretna/lib/confetti";
import { vibrate } from "@/games/sakretna/lib/haptics";
import { lemmaReady } from "@/games/sakretna/lib/lemmatize";
import {
	createInitialState,
	gameReducer,
	progressToState,
	stateToProgress,
} from "@/games/sakretna/lib/reducer";
import {
	loadProgress,
	recordResult,
	saveProgress,
} from "@/games/sakretna/lib/storage";
import { titleTranslationLemmas } from "@/games/sakretna/lib/titleTranslations";
import { collectLemmas } from "@/games/sakretna/lib/tokenize";
import type { ArticleToken, GameState, PickedArticle } from "../types";

export interface UseSakretnaGameReturn {
	state: GameState;
	tokens: ArticleToken[];
	lemmaSet: Set<string>;
	/** Title words and their translations, which no hint may open. */
	lockedLemmaSet: Set<string>;
	ready: boolean;
	setInput: (value: string) => void;
	submitGuess: () => void;
	useHint: (lemma: string) => void;
	giveUp: () => void;
	setHighlight: (lemmas: string[]) => void;
}

export function useSakretnaGame(picked: PickedArticle): UseSakretnaGameReturn {
	const { article, tokens, titleTokens, date } = picked;
	const [state, dispatch] = useReducer(
		gameReducer,
		undefined,
		createInitialState
	);
	const [ready, setReady] = useState(false);
	const persistedRef = useRef(false);
	const analyticsStateRef = useRef(state);
	const observedStateRef = useRef(state);

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

	// Run before restoration so its baseline cannot turn saved progress into events.
	useEffect(() => {
		if (observedStateRef.current === state) return;
		observedStateRef.current = state;
		const previous = analyticsStateRef.current;
		analyticsStateRef.current = state;
		trackSakretnaTransition(previous, state, date, article.id);
	}, [state, date, article.id]);

	// Restore from localStorage once per puzzle
	const restoredKeyRef = useRef<string | null>(null);
	useEffect(() => {
		const key = `${date}:${article.id}`;
		if (restoredKeyRef.current === key) return;
		restoredKeyRef.current = key;
		const saved = loadProgress(date);
		if (saved && saved.articleId === article.id) {
			// Repair games whose title was revealed but whose client-side
			// title analysis disagreed with the rendered server tokens.
			const required = collectLemmas(titleTokens.filter((t) => !t.isFree));
			const won =
				saved.won ||
				(!saved.givenUp &&
					required.size > 0 &&
					[...required].every((lemma) => saved.foundLemmas.includes(lemma)));
			const progress = won
				? {
						...saved,
						won: true,
						finishedAt: saved.finishedAt ?? new Date().toISOString(),
						foundLemmas: [
							...new Set([...saved.foundLemmas, ...collectLemmas(tokens)]),
						],
					}
				: saved;
			analyticsStateRef.current = progressToState(progress);
			dispatch({ type: "RESTORE", progress });
		}
		persistedRef.current = true;
	}, [date, article.id, tokens, titleTokens]);

	// Persist on every state change (after the first restoration effect runs)
	useEffect(() => {
		if (!persistedRef.current || !ready) return;
		const progress = stateToProgress(date, article.id, state);
		saveProgress(progress);
		if (state.finishedAt) {
			recordResult(progress);
		}
	}, [state, date, article.id, ready]);

	// Confetti on every win, haptics only for a win from a guess
	const guessSubmittedRef = useRef(false);
	useEffect(() => {
		if (!state.won) return;
		if (guessSubmittedRef.current) {
			guessSubmittedRef.current = false;
			vibrate("long");
		}
		triggerConfetti();
	}, [state.won]);

	// errorKey grows with each rejected guess, so back-to-back misses vibrate
	useEffect(() => {
		if (state.errorKey === 0) return;
		if (
			state.errorType === "not_in_article" ||
			state.errorType === "already_tried"
		) {
			vibrate("short");
		}
	}, [state.errorKey, state.errorType]);

	const lemmaSet = collectLemmas(tokens);
	// Use the same lemmas and free-word flags as the rendered title.
	const titleLemmaSet = collectLemmas(titleTokens.filter((t) => !t.isFree));
	const translationLemmaSet = useMemo(
		() => titleTranslationLemmas(tokens, titleTokens),
		[tokens, titleTokens]
	);
	const lockedLemmaSet = new Set([...titleLemmaSet, ...translationLemmaSet]);
	return {
		state,
		tokens,
		lemmaSet,
		lockedLemmaSet,
		ready,
		setInput: (value) => dispatch({ type: "SET_INPUT", value }),
		submitGuess: () => {
			guessSubmittedRef.current = true;
			dispatch({
				type: "SUBMIT_GUESS",
				articleId: article.id,
				rawGuess: state.currentInput,
				tokens,
				titleLemmas: titleLemmaSet,
				translationLemmas: translationLemmaSet,
			});
		},
		useHint: (lemma) =>
			dispatch({
				type: "USE_HINT",
				lemma,
				revealedCount: tokens.filter(
					(token) => token.type === "word" && token.lemma === lemma
				).length,
				lockedLemmas: lockedLemmaSet,
			}),
		giveUp: () =>
			dispatch({
				type: "GIVE_UP",
				lemmas: [...lemmaSet],
			}),
		setHighlight: (lemmas: string[]) =>
			dispatch({ type: "SET_HIGHLIGHT", lemmas }),
	};
}
