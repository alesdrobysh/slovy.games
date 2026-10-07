"use client";

import { useCallback, useEffect, useState } from "react";
import { useSakretnaGame } from "@/games/sakretna/hooks/useSakretnaGame";
import { MAX_HINTS } from "@/games/sakretna/lib/constants";
import {
	DEFAULT_GAMEPLAY_SETTINGS,
	loadGameplaySettings,
	saveGameplaySettings,
} from "@/games/sakretna/lib/gameplaySettings";
import { ERROR_MESSAGES } from "@/games/sakretna/lib/validation";
import type { PickedArticle } from "@/games/sakretna/types";
import { useVirtualKeyboard } from "@/shared/hooks/useVirtualKeyboard";
import { ArticleActions } from "./ArticleActions";
import { ArticleNavigator } from "./ArticleNavigator";
import { FinishCard } from "./FinishCard";
import { GameplaySettingsModal } from "./GameplaySettingsModal";
import { GiveUpModal } from "./GiveUpModal";
import { GuessInput } from "./GuessInput";
import { GuessList } from "./GuessList";
import { HintPickPanel, type PendingHint } from "./HintPickPanel";
import { ProgressLine, RedactedText } from "./RedactedText";

interface SakretnaPageProps {
	picked: PickedArticle;
}

export function SakretnaPage({ picked }: SakretnaPageProps) {
	const { article, tokens, titleTokens, date } = picked;
	const {
		state,
		lemmaSet,
		titleLemmaSet,
		ready,
		setInput,
		submitGuess,
		useHint: revealHint,
		giveUp,
		setHighlight,
	} = useSakretnaGame(picked);
	const [showGiveUp, setShowGiveUp] = useState(false);
	const [hintMode, setHintMode] = useState(false);
	const [pendingHint, setPendingHint] = useState<PendingHint | null>(null);
	const [showSettings, setShowSettings] = useState(false);
	const [settings, setSettings] = useState(DEFAULT_GAMEPLAY_SETTINGS);
	useEffect(() => setSettings(loadGameplaySettings()), []);
	useVirtualKeyboard();

	// The mobile dock is fixed, so the article column reserves its measured
	// height (plus whatever the keyboard hides) instead of a guessed constant.
	const [dockHeight, setDockHeight] = useState(0);
	const observeDock = useCallback((dock: HTMLDivElement | null) => {
		if (!dock || typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(() =>
			setDockHeight(Math.ceil(dock.getBoundingClientRect().height))
		);
		observer.observe(dock);
		return () => observer.disconnect();
	}, []);

	const foundSet = new Set(state.foundLemmas);
	const totalLemmas = lemmaSet.size;
	const foundCount = state.foundLemmas.length;
	const feedbackMessage = state.errorType
		? ERROR_MESSAGES[state.errorType]
		: state.statusMessage;
	const finished = state.won || state.givenUp;
	const hintsLeft = Math.max(0, MAX_HINTS - state.hintsUsed);

	const cancelHint = () => {
		setHintMode(false);
		setPendingHint(null);
	};
	const startHint = () => {
		if (hintsLeft === 0 || finished) return;
		setHintMode(true);
		setPendingHint(null);
	};
	const pickHintLemma = (lemma: string) => {
		const forms = tokens.filter((t) => t.type === "word" && t.lemma === lemma);
		if (forms.length === 0) return;
		setPendingHint({
			lemma,
			length: forms[0].text.length,
			count: forms.length,
		});
	};
	const confirmHint = () => {
		if (pendingHint) revealHint(pendingHint.lemma);
		cancelHint();
	};

	const progress = {
		date,
		articleId: article.id,
		foundLemmas: state.foundLemmas,
		guesses: state.guesses,
		won: state.won,
		givenUp: state.givenUp,
		hintsUsed: state.hintsUsed,
		startedAt: state.startedAt,
		finishedAt: state.finishedAt ?? undefined,
	};

	return (
		<div
			className="mx-auto max-w-3xl lg:max-w-6xl px-4 md:px-8 py-flow-lg md:py-page-py"
			style={
				{
					"--sakretna-dock-space": `calc(${dockHeight}px + var(--keyboard-inset, 0px) + var(--bottom-banner-height, 0px))`,
				} as React.CSSProperties
			}
		>
			<div className="flex flex-col gap-flow-lg lg:grid lg:grid-cols-[1fr_320px] lg:gap-inset-xl lg:items-start">
				<div className="min-w-0 flex flex-col gap-flow-lg lg:gap-inset-xl pb-(--sakretna-dock-space) md:pb-0">
					<div className="hidden" aria-hidden="true">
						<ProgressLine foundLemmas={foundCount} totalLemmas={totalLemmas} />
					</div>

					{finished && (
						<FinishCard
							mode={state.won ? "win" : "lose"}
							article={article}
							progress={progress}
						/>
					)}

					<section
						className="bg-card ring-1 ring-rule rounded-2xl p-inset-md sm:p-inset-lg"
						aria-label="Зашыфраваны артыкул"
					>
						<RedactedText
							tokens={tokens}
							titleTokens={titleTokens}
							foundLemmas={foundSet}
							highlighted={state.highlighted}
							stickyTitle={settings.stickyTitle}
							autoScroll={settings.autoScroll}
							showLetterCounts={settings.letterCounts}
							hintMode={hintMode}
							titleLemmas={titleLemmaSet}
							pendingLemma={pendingHint?.lemma ?? null}
							onPickLemma={pickHintLemma}
						/>
					</section>
				</div>

				{!finished && (
					<div
						ref={observeDock}
						className="fixed left-0 right-0 z-30 bg-paper/95 backdrop-blur-sm border-t border-rule md:static md:z-auto md:border-0 md:bg-transparent md:backdrop-blur-none lg:sticky lg:top-24"
						style={{
							bottom:
								"calc(var(--bottom-banner-height, 0px) + var(--keyboard-inset, 0px))",
							paddingBottom: "env(safe-area-inset-bottom, 0px)",
						}}
					>
						{feedbackMessage && !hintMode && (
							<p
								key={state.errorKey}
								role="status"
								className={`absolute bottom-full left-4 mb-flow-xs max-w-[calc(100%-2rem)] truncate rounded-full bg-card ring-1 ring-rule px-inset-sm py-flow-xs text-xs md:static md:mb-0 md:max-w-none md:rounded-none md:bg-transparent md:ring-0 md:px-0 md:pb-flow-sm ${
									state.errorType
										? "text-(--color-destructive)"
										: "text-sakretna"
								}`}
							>
								{feedbackMessage}
							</p>
						)}
						<div className="mx-auto max-w-3xl md:max-w-none px-4 md:px-0 py-flow-sm md:py-0 flex flex-col gap-flow-sm">
							<div className="flex flex-wrap items-center justify-between gap-flow-sm max-md:keyboard:hidden">
								<ArticleActions
									onUseHint={startHint}
									onGiveUp={() => setShowGiveUp(true)}
									onSettings={() => setShowSettings(true)}
									hintsLeft={hintsLeft}
									hintMode={hintMode}
									finished={finished}
								/>
								<ArticleNavigator highlighted={state.highlighted} />
							</div>
							{hintMode ? (
								<HintPickPanel
									hintsAfter={hintsLeft - 1}
									pending={pendingHint}
									onConfirm={confirmHint}
									onCancel={cancelHint}
								/>
							) : (
								<>
									<div className="overflow-hidden rounded-lg border border-rule bg-card">
										<GuessList
											guesses={state.guesses}
											tokens={tokens}
											highlighted={state.highlighted}
											onSelect={setHighlight}
										/>
									</div>
									<GuessInput
										value={state.currentInput}
										onChange={setInput}
										onSubmit={submitGuess}
										disabled={!ready}
										placeholder={
											ready ? "Увядзіце слова…" : "Слоўнік загружаецца…"
										}
									/>
								</>
							)}
						</div>
					</div>
				)}
			</div>

			<GiveUpModal
				isOpen={showGiveUp}
				hintsLeft={hintsLeft}
				guessCount={state.guesses.length}
				onUseHint={() => {
					setShowGiveUp(false);
					startHint();
				}}
				onConfirm={() => {
					setShowGiveUp(false);
					cancelHint();
					giveUp();
				}}
				onClose={() => setShowGiveUp(false)}
			/>
			<GameplaySettingsModal
				isOpen={showSettings}
				settings={settings}
				onChange={(next) => {
					setSettings(next);
					saveGameplaySettings(next);
				}}
				onClose={() => setShowSettings(false)}
			/>
		</div>
	);
}
