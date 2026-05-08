"use client";

import { useState } from "react";
import AuroraBackground from "@/games/pobach/components/AuroraBackground";
import FinishCard from "@/games/pobach/components/FinishCard";
import Footer from "@/games/pobach/components/Footer";
import GiveUpModal from "@/games/pobach/components/GiveUpModal";
import GuessCard from "@/games/pobach/components/GuessCard";
import GuessInput from "@/games/pobach/components/GuessInput";
import GuessList from "@/games/pobach/components/GuessList";
import Header from "@/games/pobach/components/Header";
import Modal from "@/games/pobach/components/Modal";
import RulesComponent from "@/games/pobach/components/RulesComponent";
import { useGame } from "@/games/pobach/hooks/useGame";
import { getCurrentDayIndex } from "@/games/pobach/lib/storage";

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

	return (
		<main className="min-h-screen flex flex-col">
			<AuroraBackground />
			<Header onHelpClick={() => setShowHelp(true)} />

			<div className="flex-1 w-full max-w-[600px] mx-auto px-4 pb-20 pt-8 gap-y-6 flex flex-col">
				{/* Day badge */}
				<div className="flex justify-start">
					<span className="inline-flex items-center px-3 py-1 text-[0.75rem] font-medium text-[var(--accent)] bg-[var(--border)] rounded-full">
						Дзень #{getCurrentDayIndex() + 1}
					</span>
				</div>

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

				{(won || gameOver) && dayIndex !== null ? (
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
							<p className="text-xs text-[var(--text-muted)] mb-2">
								Апошняе слова:
							</p>
							<GuessCard guess={lastGuess} />
						</output>
					)
				)}

				{guesses.length === 0 ? (
					<div className="mt-6">
						<div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
							<h2 className="font-serif text-3xl font-bold text-[var(--text)] mb-6">
								Як гуляць?
							</h2>
							<RulesComponent />
						</div>
					</div>
				) : (
					<GuessList guesses={guesses} />
				)}
			</div>

			{showHelp && (
				<Modal title="Як гуляць?" onClose={() => setShowHelp(false)}>
					<RulesComponent />
				</Modal>
			)}

			{showGiveUp && (
				<GiveUpModal
					onConfirm={handleGiveUpConfirm}
					onClose={() => setShowGiveUp(false)}
				/>
			)}

			<div className="w-full max-w-[600px] mx-auto px-4">
				<Footer />
			</div>
		</main>
	);
}
