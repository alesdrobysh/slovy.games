"use client";

import { useState } from "react";
import FinishCard from "@/games/pobach/components/FinishCard";
import GiveUpModal from "@/games/pobach/components/GiveUpModal";
import GuessCard from "@/games/pobach/components/GuessCard";
import GuessInput from "@/games/pobach/components/GuessInput";
import GuessList from "@/games/pobach/components/GuessList";
import Header from "@/games/pobach/components/Header";
import RulesComponent from "@/games/pobach/components/RulesComponent";
import { useGame } from "@/games/pobach/hooks/useGame";
import { Modal } from "@/shared/components/ui/Modal";

export default function PobachPage() {
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

	const [showHelp, setShowHelp] = useState(false);
	const [showGiveUp, setShowGiveUp] = useState(false);

	const handleGiveUpConfirm = () => {
		setShowGiveUp(false);
		handleGiveUp();
	};

	const isFinished = won || gameOver;
	const sortedGuesses = [...guesses].sort((a, b) => a.rank - b.rank);
	const bestRank = sortedGuesses[0]?.rank ?? null;

	return (
		<div className="min-h-screen flex flex-col">
			<Header onHelpClick={() => setShowHelp(true)} />

			<main className="flex-1 max-w-2xl mx-auto w-full px-5 sm:px-8 pb-20">
				{/* Day badge */}
				<div className="flex justify-start mb-6">
					<span className="inline-flex items-center px-3 py-1 text-[0.75rem] font-medium text-pobach bg-pobach-soft rounded-full">
						Выпуск №{dayIndex != null ? dayIndex : ""}
					</span>
				</div>

				{/* Rules — shown only before the first guess */}
				{guesses.length === 0 && !isFinished && <RulesComponent inline />}

				{/* Input form */}
				{!isFinished && (
					<form
						onSubmit={handleSubmit}
						className="sticky top-16 bg-paper/95 backdrop-blur-sm py-4 z-20"
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
							bestRank={bestRank}
						/>
					</form>
				)}

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
						<output aria-live="polite" className="block mb-4">
							<p className="text-xs text-ink-soft mb-2">Апошняе слова:</p>
							<GuessCard guess={lastGuess} highlight />
						</output>
					)
				)}

				{/* Guess list */}
				{guesses.length > 0 && (
					<>
						<GuessList
							guesses={sortedGuesses}
							lastGuess={lastGuess?.word ?? null}
						/>
						<p className="mt-8 text-xs text-ink-soft text-center">
							Чым меншы ранг — тым бліжэй вы да слова. Ранг 1 — перамога.
						</p>
					</>
				)}
			</main>

			<Modal
				isOpen={showHelp}
				title="Як гуляць?"
				onClose={() => setShowHelp(false)}
			>
				<RulesComponent />
			</Modal>

			<GiveUpModal
				isOpen={showGiveUp}
				onConfirm={handleGiveUpConfirm}
				onClose={() => setShowGiveUp(false)}
			/>
		</div>
	);
}
