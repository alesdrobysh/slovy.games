"use client";

import { useState } from "react";
import type { GameActions, GameState } from "@/games/pobach/hooks/useGame";
import { GameDate } from "@/shared/components/GameDate";
import { Typography } from "@/shared/components/ui/Typography";
import { POBACH_EPOCH_DATE } from "@/shared/config";
import { dateForDayIndex } from "@/shared/lib/timezone";
import FinishCard from "./FinishCard";
import GiveUpModal from "./GiveUpModal";
import GuessCard from "./GuessCard";
import GuessInput from "./GuessInput";
import GuessList from "./GuessList";
import RulesComponent from "./RulesComponent";

interface GamePageContentProps {
	state: GameState;
	actions: GameActions;
}

export function GamePageContent({ state, actions }: GamePageContentProps) {
	const {
		input,
		guesses,
		loading,
		error,
		errorWord,
		won,
		gameOver,
		targetWord,
		dayIndex,
		sessionDayIndex,
		lastGuess,
	} = state;
	const { setInput, handleSubmit, getHint, handleGiveUp } = actions;

	const [showGiveUp, setShowGiveUp] = useState(false);

	const handleGiveUpConfirm = () => {
		setShowGiveUp(false);
		handleGiveUp();
	};

	const isFinished = won || gameOver;
	const sortedGuesses = [...guesses].sort((a, b) => a.rank - b.rank);
	const activeDayIndex = dayIndex ?? sessionDayIndex;
	const date =
		activeDayIndex === null
			? null
			: dateForDayIndex(POBACH_EPOCH_DATE, activeDayIndex)
					.toISOString()
					.slice(0, 10);

	return (
		<main className="page-narrow page-container pt-inset-xl pb-page-py">
			{date && <GameDate game="pobach" date={date} />}

			{/* Input form */}
			{!isFinished && (
				<form onSubmit={handleSubmit} className="py-flow-lg">
					<GuessInput
						input={input}
						setInput={setInput}
						onSubmit={handleSubmit}
						loading={loading}
						won={won}
						gameOver={gameOver}
						error={error}
						errorWord={errorWord}
						onHint={getHint}
						onGiveUp={() => setShowGiveUp(true)}
						guessCount={guesses.length}
					/>
				</form>
			)}

			{/* Rules — shown only before the first guess */}
			{guesses.length === 0 && !isFinished && <RulesComponent inline />}

			{/* Finish card */}
			{isFinished && dayIndex !== null ? (
				<FinishCard
					mode={won ? "win" : "lose"}
					guesses={guesses}
					dayIndex={dayIndex ?? 0}
					sessionDayIndex={sessionDayIndex}
					targetWord={targetWord}
				/>
			) : (
				lastGuess && (
					<output aria-live="polite" className="block mb-inset-lg">
						<Typography
							variant="overline"
							as="p"
							className="text-ink-soft"
							style={{ marginBottom: "var(--space-flow-md)" }}
						>
							Апошняе слова:
						</Typography>
						<GuessCard guess={lastGuess} highlight />
					</output>
				)
			)}

			{/* Guess list */}
			{guesses.length > 0 && (
				<div className="pt-inset-xs">
					<GuessList
						guesses={sortedGuesses}
						lastGuess={lastGuess?.word ?? null}
					/>
				</div>
			)}

			<GiveUpModal
				isOpen={showGiveUp}
				onConfirm={handleGiveUpConfirm}
				onClose={() => setShowGiveUp(false)}
			/>
		</main>
	);
}
