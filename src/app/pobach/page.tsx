"use client";

import { useState } from "react";
import AuroraBackground from "@/games/pobach/components/AuroraBackground";
import FinishCard from "@/games/pobach/components/FinishCard";
import GiveUpModal from "@/games/pobach/components/GiveUpModal";
import GuessCard from "@/games/pobach/components/GuessCard";
import GuessInput from "@/games/pobach/components/GuessInput";
import GuessList from "@/games/pobach/components/GuessList";
import Header from "@/games/pobach/components/Header";
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
				className="min-h-screen pb-20"
				style={{ background: "var(--color-bg)" }}
			>
				<Header onHelpClick={() => setShowHelp(true)} />

				<div className="mx-auto max-w-[600px] px-4 pt-4">
					<div className="text-center mb-6">
						<span
							className="text-xs font-bold tracking-widest uppercase rounded-full px-3 py-1"
							style={{
								background: "var(--color-accent-subtle)",
								color: "var(--color-accent)",
								border: "1px solid var(--color-accent-border)",
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

							{guesses.length === 0 && !error && <RulesComponent inline />}

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

				{showHelp && <RulesComponent inline={false} />}

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
