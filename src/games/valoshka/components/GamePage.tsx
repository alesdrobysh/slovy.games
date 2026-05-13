"use client";

import { useGame } from "@/games/valoshka/hooks/useGame";
import type { Puzzle } from "@/games/valoshka/types";
import { ActionButtons } from "./ActionButtons";
import { Cornflower } from "./Cornflower";
import { FoundWordsList } from "./FoundWordsList";
import { HintDisplay } from "./HintDisplay";
import { HowToPlay, useHowToPlay } from "./HowToPlay";
import { InputDisplay } from "./InputDisplay";
import { ProgressBar } from "./ProgressBar";

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
				<button
					type="button"
					onClick={actions.toggleWordsOpen}
					className="flex items-center gap-1.5 text-sm font-semibold text-ink-muted bg-transparent border-none cursor-pointer p-1"
				>
					Словы ({state.foundWords.length})
					{!state.wordsOpen && state.foundWords.length > 0 && (
						<span className="text-ink-muted font-normal ml-2">
							{state.foundWords
								.slice(-2)
								.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
								.join("  ")}
						</span>
					)}
					<span
						className="text-[10px] inline-block transition-transform"
						style={{
							transform: state.wordsOpen ? "rotate(180deg)" : "rotate(0deg)",
						}}
					>
						▾
					</span>
				</button>
			</div>

			{/* Mobile: collapsible words panel */}
			{state.wordsOpen && (
				<div
					className="lg:hidden py-3"
					style={{ maxHeight: "40vh", overflowY: "auto" }}
				>
					<FoundWordsList
						words={state.foundWords}
						pangrams={puzzle.pangrams}
						lastFoundWord={state.lastFoundWord}
					/>
				</div>
			)}

			{/* Main area */}
			<div className="flex flex-col items-center gap-2 py-2 sm:gap-4 sm:py-4 lg:flex-row lg:items-start lg:gap-14 lg:py-8">
				{/* Left: game controls */}
				<div className="flex flex-col items-center gap-2 sm:gap-4 w-full max-w-sm lg:max-w-none lg:w-[380px]">
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
						{state.hint.isActive && (
							<HintDisplay
								hint={state.hint}
								onCancel={actions.handleCancelHint}
							/>
						)}
					</div>

					<div
						style={{
							width: "100%",
							maxWidth: "min(370px, calc(100vw - 60px))",
							touchAction: "none",
						}}
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
					/>
				</div>

				{/* Right: found words — desktop only */}
				<div className="hidden lg:block flex-1 min-h-0 pt-10">
					<FoundWordsList
						words={state.foundWords}
						pangrams={puzzle.pangrams}
						lastFoundWord={state.lastFoundWord}
					/>
				</div>
			</div>

			{showHowToPlay && (
				<HowToPlay isOpen={showHowToPlay} onClose={closeHowToPlay} />
			)}
		</div>
	);
}
