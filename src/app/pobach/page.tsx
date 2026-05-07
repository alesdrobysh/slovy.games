"use client";

import { useGame } from "@/games/pobach/hooks/useGame";
import Header from "@/games/pobach/components/Header";
import GuessInput from "@/games/pobach/components/GuessInput";
import FinishCard from "@/games/pobach/components/FinishCard";
import GuessCard from "@/games/pobach/components/GuessCard";
import RulesComponent from "@/games/pobach/components/RulesComponent";
import GuessList from "@/games/pobach/components/GuessList";
import GiveUpModal from "@/games/pobach/components/GiveUpModal";
import { useState } from "react";

export default function PobachPage() {
	const {
		state: {
			input,
			guesses,
			loading,
			error,
			won,
			gameOver,
			targetWord,
			dayIndex,
		},
		actions: {
			setInput,
			handleSubmit,
			getHint,
			handleGiveUp,
		},
	} = useGame();

	const [showHelp, setShowHelp] = useState(false);
	const [showGiveUp, setShowGiveUp] = useState(false);

	const handleGiveUpConfirm = () => {
		setShowGiveUp(false);
		handleGiveUp();
	};

	return (
		<main
			className="min-h-screen pb-20"
			style={{ background: "var(--color-bg)" }}
		>
			<Header
				onHelpClick={() => setShowHelp(true)}
			/>

			<div className="mx-auto max-w-[600px] px-4 pt-4">
				{/* Day badge */}
				<div className="text-center mb-6">
					<span
						className="text-xs font-bold tracking-widest uppercase rounded-full px-3 py-1"
						style={{
							background: "var(--color-accent-subtle)",
							color: "var(--color-accent)",
							border: "1px solid var(--color-accent-border)",
						}}
					>
						Дзень {(dayIndex ?? 0) + 1}
					</span>
				</div>

				{won || gameOver ? (
					<FinishCard
						won={won}
						targetWord={targetWord}
						guesses={guesses}
						dayIndex={dayIndex}
					/>
				) : (
					<>
						<GuessInput
							value={input}
							onChange={setInput}
							onSubmit={handleSubmit}
							isLoading={loading}
							error={error}
							onHint={getHint}
							onGiveUp={() => setShowGiveUp(true)}
							guessCount={guesses.length}
						/>

						{guesses.length === 0 && !error && (
							<RulesComponent inline />
						)}

						{guesses.length > 0 && (
							<>
								{/* Latest guess card */}
								<GuessCard
									guess={guesses[guesses.length - 1]}
									isLatest
								/>
								{guesses.length > 1 && (
									<GuessList guesses={guesses.slice(0, -1)} />
								)}
							</>
						)}
					</>
				)}
			</div>

			{showHelp && (
				<RulesComponent inline={false} onClose={() => setShowHelp(false)} />
			)}

			{showGiveUp && (
				<GiveUpModal
					onConfirm={handleGiveUpConfirm}
					onCancel={() => setShowGiveUp(false)}
				/>
			)}
		</main>
	);
}
