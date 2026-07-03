"use client";

import { useState } from "react";
import type { GameActions, GameState } from "@/games/pobach/hooks/useGame";
import { Badge } from "@/shared/components/ui/Badge";
import { Typography } from "@/shared/components/ui/Typography";
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

	return (
		<main className="page-narrow page-container pt-inset-xl pb-page-py">
			<Badge variant="pobach">Дзень #{sessionDayIndex ?? dayIndex ?? ""}</Badge>

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
						<Typography variant="overline" as="p" className="text-ink-soft" style={{ marginBottom: "var(--space-flow-md)" }}>Апошняе слова:</Typography>
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
