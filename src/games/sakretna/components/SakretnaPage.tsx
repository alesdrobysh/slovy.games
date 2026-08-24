"use client";

import { useState } from "react";
import { useSakretnaGame } from "@/games/sakretna/hooks/useSakretnaGame";
import { ERROR_MESSAGES } from "@/games/sakretna/lib/validation";
import type { PickedArticle } from "@/games/sakretna/types";
import { Typography } from "@/shared/components/ui/Typography";
import { ArticleActions } from "./ArticleActions";
import { CompletionOverlay } from "./CompletionOverlay";
import { FinishCard } from "./FinishCard";
import { GiveUpModal } from "./GiveUpModal";
import { GuessInput } from "./GuessInput";
import { GuessList } from "./GuessList";
import { HintModal } from "./HintModal";
import { ProgressLine, RedactedText } from "./RedactedText";

interface SakretnaPageProps {
	picked: PickedArticle;
}

export function SakretnaPage({ picked }: SakretnaPageProps) {
	const { article, tokens, date } = picked;
	const {
		state,
		lemmaSet,
		titleLemmaSet,
		ready,
		setInput,
		submitGuess,
		previewHint,
		useHint,
		giveUp,
		setHighlight,
	} = useSakretnaGame(picked);
	const [showGiveUp, setShowGiveUp] = useState(false);
	const [showResult, setShowResult] = useState(true);
	const [hintPreview, setHintPreview] = useState<{
		lemma: string;
		revealedCount: number;
	} | null>(null);
	const [showHint, setShowHint] = useState(false);

	const foundSet = new Set(state.foundLemmas);
	const totalLemmas = lemmaSet.size;
	const foundCount = state.foundLemmas.length;

	const feedbackMessage = state.errorType
		? ERROR_MESSAGES[state.errorType]
		: state.statusMessage;

	let titleVisible = false;
	for (const lemma of titleLemmaSet) {
		if (foundSet.has(lemma)) {
			titleVisible = true;
			break;
		}
	}

	const finished = state.won || state.givenUp;

	return (
		<div className="mx-auto max-w-3xl lg:max-w-6xl px-4 md:px-8 py-flow-lg md:py-page-py">
			<CompletionOverlay
				open={finished && showResult}
				mode={state.won ? "win" : "lose"}
				article={article}
				progress={{
					date,
					articleId: article.id,
					foundLemmas: state.foundLemmas,
					guesses: state.guesses,
					won: state.won,
					givenUp: state.givenUp,
					hintsUsed: state.hintsUsed,
					finishedAt: state.finishedAt ?? undefined,
				}}
				onReadArticle={() => setShowResult(false)}
			/>
			<div
				className="flex flex-col gap-flow-lg lg:grid lg:grid-cols-[1fr_320px] lg:gap-inset-xl lg:items-start"
				aria-hidden={finished && showResult}
				inert={finished && showResult ? true : undefined}
			>
				<div className="min-w-0 flex flex-col gap-flow-lg lg:gap-inset-xl pb-[140px] md:pb-0">
					<header className="flex flex-col gap-flow-xs">
						<Typography variant="overline" as="span" className="text-sakretna">
							Сакрэтна · {date}
						</Typography>
						<Typography variant="title" as="h1">
							Здагадайцеся, пра які артыкул Вікіпедыі ідзе гаворка
						</Typography>
						<ProgressLine foundLemmas={foundCount} totalLemmas={totalLemmas} />
					</header>

					<section
						className="bg-card ring-1 ring-rule rounded-2xl p-inset-md sm:p-inset-lg"
						aria-label="Зашыфраваны артыкул"
					>
						<RedactedText
							tokens={tokens}
							foundLemmas={foundSet}
							highlighted={state.highlighted}
							revealTitle={titleVisible || state.givenUp}
							title={article.title}
						/>
					</section>

					{!finished ? (
						state.guesses.length > 0 && (
							<div className="sm:hidden">
								<GuessList
									guesses={state.guesses}
									highlighted={state.highlighted}
									onSelect={setHighlight}
								/>
							</div>
						)
					) : (
						<FinishCard
							mode={state.won ? "win" : "lose"}
							article={article}
							progress={{
								date,
								articleId: article.id,
								foundLemmas: state.foundLemmas,
								guesses: state.guesses,
								won: state.won,
								givenUp: state.givenUp,
								hintsUsed: state.hintsUsed,
								finishedAt: state.finishedAt ?? undefined,
							}}
						/>
					)}
				</div>

				{!finished && (
					<div
						className="fixed bottom-0 left-0 right-0 z-30 bg-paper/95 backdrop-blur-sm border-t border-rule md:static md:z-auto md:border-0 md:bg-transparent md:backdrop-blur-none lg:sticky lg:top-24"
						style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
					>
						<div className="mx-auto max-w-3xl md:max-w-none px-4 md:px-0 py-flow-md md:py-0 flex flex-col gap-flow-sm">
							<ArticleActions
								onUseHint={() => {
									setHintPreview(previewHint());
									setShowHint(true);
								}}
								onGiveUp={() => setShowGiveUp(true)}
								hintAvailable={state.hintsUsed === 0}
								finished={finished}
							/>
							<GuessInput
								value={state.currentInput}
								onChange={setInput}
								onSubmit={submitGuess}
								disabled={!ready}
								placeholder={ready ? "Увядзіце слова…" : "Слоўнік загружаецца…"}
							/>
							{feedbackMessage && (
								<p
									key={state.errorKey}
									className="text-sakretna text-sm font-medium animate-fade-in"
									role="status"
								>
									{feedbackMessage}
								</p>
							)}
							{state.guesses.length > 0 && (
								<div>
									<GuessList
										guesses={state.guesses}
										tokens={tokens}
										highlighted={state.highlighted}
										onSelect={setHighlight}
									/>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
			<GiveUpModal
				isOpen={showGiveUp}
				onConfirm={() => {
					setShowGiveUp(false);
					giveUp();
				}}
				onClose={() => setShowGiveUp(false)}
			/>
			<HintModal
				isOpen={showHint}
				preview={hintPreview}
				onConfirm={() => {
					if (hintPreview) {
						useHint(hintPreview.lemma, hintPreview.revealedCount);
					}
					setShowHint(false);
				}}
				onClose={() => setShowHint(false)}
			/>
		</div>
	);
}
