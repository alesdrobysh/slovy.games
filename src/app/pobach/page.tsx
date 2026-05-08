"use client";

import { useState } from "react";
import AuroraBackground from "@/games/pobach/components/AuroraBackground";
import FinishCard from "@/games/pobach/components/FinishCard";
import GiveUpModal from "@/games/pobach/components/GiveUpModal";
import GuessCard from "@/games/pobach/components/GuessCard";
import GuessInput from "@/games/pobach/components/GuessInput";
import GuessList from "@/games/pobach/components/GuessList";
import Header from "@/games/pobach/components/Header";
import Modal from "@/games/pobach/components/Modal";
import RulesComponent from "@/games/pobach/components/RulesComponent";
import { useGame } from "@/games/pobach/hooks/useGame";

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
		<>
			<AuroraBackground />
			<main
				className="min-h-screen"
				style={{ background: "var(--color-bg)" }}
			>
				<Header onHelpClick={() => setShowHelp(true)} />

				<div className="flex flex-col mx-auto max-w-[600px] w-full px-4 pt-8 pb-20 gap-y-6">
					<div>
						<span
							className="text-xs rounded-full px-3 py-1"
							style={{
								background: "var(--color-border)",
								color: "var(--color-accent)",
								fontWeight: 500,
							}}
						>
							Дзень #{dayIndex !== null ? dayIndex + 1 : "..."}
						</span>
					</div>

					{won || gameOver ? (
						<FinishCard
							mode={won ? "win" : "lose"}
							targetWord={targetWord}
							guesses={guesses}
							dayIndex={dayIndex ?? 0}
							sessionDayIndex={sessionDayIndex}
						/>
					) : (
						<>
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

							{guesses.length === 0 && !error && (
								<div
									className="rounded-2xl p-8"
									style={{ background: "var(--color-bg-card)" }}
								>
									<h2
										className="font-serif mb-4"
										style={{
											fontFamily: "var(--font-roboto-slab), serif",
											fontSize: "30px",
											fontWeight: 700,
											color: "var(--color-text)",
										}}
									>
										Як гуляць?
									</h2>
									<RulesComponent />
								</div>
							)}

							{guesses.length > 0 && (
								<>
									<GuessCard guess={guesses[guesses.length - 1]} />
									{guesses.length > 1 && (
										<GuessList guesses={guesses.slice(0, -1)} />
									)}
								</>
							)}
						</>
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
			</main>
		</>
	);
}
