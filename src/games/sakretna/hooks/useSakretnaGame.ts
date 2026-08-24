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
	previewHint: () => { lemma: string; revealedCount: number } | null;
	useHint: (lemma: string, revealedCount: number) => void;
	giveUp: () => void;
	setHighlight: (lemma: string | null) => void;
}

const REFERENCE_SECTION_LEMMAS = new Set([
	"літаратура",
	"спасылка",
	"крыніца",
	"зноска",
	"бібліяграфія",
]);

/** Pick a random hidden Belarusian word from the article's main content. */
export function pickHintLemma(
	tokens: ArticleToken[],
	foundLemmas: ReadonlySet<string>,
	titleLemmaSet: ReadonlySet<string>
): string | null {
	const candidates = new Set<string>();
	let atLineStart = true;
	for (const t of tokens) {
		if (t.type === "sep") {
			if (t.text === "\n") atLineStart = true;
			continue;
		}
		if (atLineStart && t.lemma && REFERENCE_SECTION_LEMMAS.has(t.lemma)) {
			break;
		}
		atLineStart = false;
		if (
			t.lemma &&
			!t.isFree &&
			!foundLemmas.has(t.lemma) &&
			!titleLemmaSet.has(t.lemma) &&
			t.text.length >= 4 &&
			/^[а-яёіў'’\-]+$/iu.test(t.text)
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
	const previewHint = () => {
		const lemma = pickHintLemma(
			tokens,
			new Set(state.foundLemmas),
			titleLemmaSet
		);
		if (!lemma) return null;
		const revealedCount = tokens.filter(
			(token) => token.type === "word" && token.lemma === lemma
		).length;
		return { lemma, revealedCount };
	};

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
		previewHint,
		useHint: (lemma, revealedCount) =>
			dispatch({
				type: "USE_HINT",
				lemma,
				revealedCount,
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
