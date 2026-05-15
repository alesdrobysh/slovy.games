"use client";

import { useState } from "react";
import FinishCard from "./FinishCard";
import GiveUpModal from "./GiveUpModal";
import GuessCard from "./GuessCard";
import GuessInput from "./GuessInput";
import GuessList from "./GuessList";
import RulesComponent from "./RulesComponent";
import { useGame } from "@/games/pobach/hooks/useGame";

export function GamePage() {
	const {
		state: {
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
		},
		actions: { setInput, handleSubmit, getHint, handleGiveUp },
	} = useGame();

	const [showGiveUp, setShowGiveUp] = useState(false);

	const handleGiveUpConfirm = () => {
		setShowGiveUp(false);
		handleGiveUp();
	};

	const isFinished = won || gameOver;
	const sortedGuesses = [...guesses].sort((a, b) => a.rank - b.rank);

	return (
		<main className="page-narrow page-container pt-8 pb-20">
				{/* Day badge */}
				<div className="flex justify-start mb-8">
					<span className="inline-flex items-center px-3 py-1 text-[0.75rem] font-medium text-pobach bg-pobach-soft rounded-full">
						Дзень #{dayIndex != null ? dayIndex : ""}
					</span>
				</div>

				{/* Input form */}
				{!isFinished && (
					<form
						onSubmit={handleSubmit}
						className="py-4"
					>
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
						targetWord={targetWord}
						guesses={guesses}
						dayIndex={dayIndex ?? 0}
						sessionDayIndex={sessionDayIndex}
					/>
				) : (
					lastGuess && (
						<output aria-live="polite" className="block mb-6">
							<p className="text-xs text-ink-soft mb-2">Апошняе слова:</p>
							<GuessCard guess={lastGuess} highlight />
						</output>
					)
				)}

				{/* Guess list */}
				{guesses.length > 0 && (
					<div className="pt-2">
						<GuessList
							guesses={sortedGuesses}
							lastGuess={lastGuess?.word ?? null}
						/>
						<p className="mt-8 text-xs text-ink-soft text-center">
							Чым меншы ранг — тым бліжэй вы да слова. Ранг 1 — перамога.
						</p>
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
