"use client";

import { useEffect, useState } from "react";
import { useSakretnaGame } from "@/games/sakretna/hooks/useSakretnaGame";
import { ERROR_MESSAGES } from "@/games/sakretna/lib/validation";
import type { PickedArticle, ValidationError } from "@/games/sakretna/types";
import { Typography } from "@/shared/components/ui/Typography";
import { ArticleActions } from "./ArticleActions";
import { FinishCard } from "./FinishCard";
import { GuessInput } from "./GuessInput";
import { GuessList } from "./GuessList";
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
		useHint,
		giveUp,
	} = useSakretnaGame(picked);
	const [toastKey, setToastKey] = useState(0);
	const [toastMessage, setToastMessage] = useState<string | null>(null);

	const foundSet = new Set(state.foundLemmas);
	const totalLemmas = lemmaSet.size;
	const foundCount = state.foundLemmas.length;

	useEffect(() => {
		if (state.errorType) {
			const err: ValidationError = state.errorType;
			setToastMessage(ERROR_MESSAGES[err]);
			setToastKey((k) => k + 1);
		}
	}, [state.errorType]);

	let titleVisible = false;
	for (const lemma of titleLemmaSet) {
		if (foundSet.has(lemma)) {
			titleVisible = true;
			break;
		}
	}

	const finished = state.won || state.givenUp;

	return (
		<div className="mx-auto max-w-3xl sm:max-w-6xl px-4 sm:px-8 py-flow-lg sm:py-page-py">
			<div className="flex flex-col gap-flow-lg sm:grid sm:grid-cols-[1fr_320px] sm:gap-inset-xl sm:items-start">
				<div className="min-w-0 flex flex-col gap-flow-lg sm:gap-inset-xl pb-[140px] sm:pb-0">
					<header className="flex flex-col gap-flow-xs">
						<Typography variant="overline" as="span" className="text-sakretna">
							Сакрэтна · {date}
						</Typography>
						<Typography variant="title" as="h1">
							Здагадайцеся артыкул Вікіпедыі
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
							revealTitle={titleVisible}
							title={article.title}
						/>
					</section>

					{!finished ? (
						state.guesses.length > 0 && (
							<div className="sm:hidden">
								<GuessList guesses={state.guesses} />
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
						className="fixed bottom-0 left-0 right-0 z-30 bg-paper/95 backdrop-blur-sm border-t border-rule sm:sticky sm:top-24 sm:bottom-auto sm:left-auto sm:right-auto sm:z-auto sm:border-0 sm:bg-transparent sm:backdrop-blur-none"
						style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
					>
						<div className="mx-auto max-w-3xl sm:max-w-none px-4 sm:px-0 py-flow-md sm:py-0 flex flex-col gap-flow-sm">
							<ArticleActions
								onUseHint={useHint}
								onGiveUp={giveUp}
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
							{toastMessage && (
								<p
									key={toastKey}
									className="text-sakretna text-sm font-medium animate-fade-in"
									role="status"
								>
									{toastMessage}
								</p>
							)}
							{state.guesses.length > 0 && (
								<div className="hidden sm:block">
									<GuessList guesses={state.guesses} />
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
