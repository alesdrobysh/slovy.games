"use client";

import { ChevronDown } from "lucide-react";
import { useGame } from "@/games/valoshka/hooks/useGame";
import type { Puzzle } from "@/games/valoshka/types";
import { Button } from "@/shared/components/ui/Button";
import { Typography } from "@/shared/components/ui/Typography";
import { ActionButtons } from "./ActionButtons";
import { CompanionGrid } from "./CompanionGrid";
import { Cornflower } from "./Cornflower";
import { FoundWordsList } from "./FoundWordsList";
import { HintDisplay } from "./HintDisplay";
import { HowToPlay, useHowToPlay } from "./HowToPlay";
import { InputDisplay } from "./InputDisplay";
import { ProgressBar } from "./ProgressBar";
import { VasiliokCard } from "./VasiliokCard";

interface GamePageProps {
	puzzle: Puzzle;
}

export function GamePage({ puzzle }: GamePageProps) {
	const { state, actions } = useGame(puzzle);
	const { isOpen: showHowToPlay, close: closeHowToPlay } = useHowToPlay();

	return (
		<div className="mx-auto max-w-5xl px-5 sm:px-8 select-none font-sans">
			{/* Mobile: collapsible words toggle */}
			<div className="lg:hidden border-b border-rule py-2">
				<Button
					variant="ghost"
					color="neutral"
					onClick={actions.toggleWordsOpen}
					className="w-full flex items-center justify-start gap-flow-md"
				>
					<span className="shrink-0 whitespace-nowrap">
						Словы ({state.foundWords.length}/{puzzle.answers.length})
					</span>
					{!state.wordsOpen && state.foundWords.length > 0 && (
						<Typography
							variant="label"
							className="flex-1 min-w-0 truncate text-left"
						>
							{state.foundWords.slice().reverse().join("  ")}
						</Typography>
					)}
					<ChevronDown
						className={`ml-auto shrink-0 transition-transform ${state.wordsOpen ? "rotate-180" : ""}`}
						size={14}
					/>
				</Button>
			</div>

			{/* Mobile: collapsible words panel */}
			{state.wordsOpen && (
				<div className="lg:hidden py-flow-sm px-flow-sm max-h-[40vh] overflow-y-auto">
					<FoundWordsList words={state.foundWords} pangrams={puzzle.pangrams} />
				</div>
			)}

			{/* Main area */}
			<div className="flex flex-col items-center gap-2 py-2 sm:gap-4 sm:py-4 lg:flex-row lg:items-start lg:gap-14 lg:py-8">
				{/* Left: game controls */}
				<div className="flex flex-col items-center gap-2 sm:gap-4 w-full max-w-sm lg:max-w-none lg:w-95">
					{state.vasiliokReached && (
						<VasiliokCard
							date={puzzle.date}
							score={state.score}
							maxScore={puzzle.max_score}
						/>
					)}

					<div className="w-full">
						<ProgressBar
							score={state.score}
							maxScore={puzzle.max_score}
							date={puzzle.date}
							foundCount={state.foundWords.length}
							totalWords={puzzle.answers.length}
						/>
					</div>

					<InputDisplay
						value={state.currentInput}
						center={puzzle.center}
						errorType={state.errorType}
						errorKey={state.errorKey}
						lastFoundWord={state.lastFoundWord}
						lastFoundIsPangram={state.lastFoundIsPangram}
						successKey={state.successKey}
					/>

					<div className="w-full max-w-sm" style={{ height: "38px" }}>
						{state.hint.isActive && <HintDisplay hint={state.hint} />}
					</div>

					<div
						className="w-full touch-none"
						style={{ maxWidth: "min(370px, calc(100vw - 60px))" }}
					>
						<Cornflower
							center={puzzle.center}
							outer={state.outerLetters}
							onLetter={actions.handleLetter}
							shuffleCount={state.shuffleCount}
						/>
					</div>

					<ActionButtons
						onDelete={actions.handleDelete}
						onShuffle={actions.handleShuffle}
						onSubmit={actions.handleSubmit}
						onHint={actions.handleStartHint}
						onOpenGrid={actions.toggleCompanionGrid}
						hintCredits={state.hintCredits}
					/>
				</div>

				{/* Right: found words — desktop only */}
				<div className="hidden lg:block flex-1 min-h-0 pt-10">
					<FoundWordsList words={state.foundWords} pangrams={puzzle.pangrams} />
				</div>
			</div>

			{showHowToPlay && (
				<HowToPlay isOpen={showHowToPlay} onClose={closeHowToPlay} />
			)}

			<CompanionGrid
				isOpen={state.companionGridOpen}
				onClose={actions.toggleCompanionGrid}
				answers={puzzle.answers}
				foundWords={state.foundWords}
				pangrams={puzzle.pangrams}
			/>
		</div>
	);
}
