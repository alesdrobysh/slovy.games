/**
 * FinishCard Component Integration Tests
 */

import { render, screen } from "@testing-library/react";
import FinishCard from "@/games/pobach/components/FinishCard";

jest.mock("@/shared/hooks/useCountdown", () => ({
	useCountdown: () => "23:45:12",
}));

jest.mock("@/games/pobach/lib/storage", () => ({
	getCurrentDayIndex: () => 42,
	getStats: () => ({
		currentStreak: 0,
		maxStreak: 0,
		gamesPlayed: 0,
		gamesWon: 0,
	}),
}));

jest.mock("@/games/pobach/components/TopWordsList", () => {
	return function MockTopWordsList() {
		return <div data-testid="top-words-list" />;
	};
});

jest.mock("@/games/pobach/components/ShareButton", () => {
	return function MockShareButton({
		dayIndex,
		guesses,
	}: {
		dayIndex: number;
		guesses: unknown[];
	}) {
		return (
			<button type="button" data-testid="share-button">
				Share results for day {dayIndex} with {guesses.length} guesses
			</button>
		);
	};
});

describe("FinishCard Component", () => {
	const defaultProps = {
		dayIndex: 42,
		sessionDayIndex: 42,
		guesses: [
			{ word: "хлеб", rank: 10 },
			{ word: "вада", rank: 8 },
			{ word: "сонца", rank: 15 },
		],
	};

	describe("Lose Mode", () => {
		it("should render lose mode correctly", async () => {
			const loseProps = { ...defaultProps, mode: "lose" as const };
			render(<FinishCard {...loseProps} />);

			expect(
				await screen.findByText("Дзякуй за гульню. Заўтра будзе новае слова.")
			).toBeInTheDocument();

			const card = screen.getByTestId("finish-card");
			expect(card).toHaveClass("bg-card");
			expect(card).toHaveClass("ring-rule");

			expect(screen.getByText("23:45:12")).toBeInTheDocument();
		});
	});

	describe("Win Mode", () => {
		it("should render win mode correctly", async () => {
			const winProps = { ...defaultProps, mode: "win" as const };
			render(<FinishCard {...winProps} />);

			expect(screen.getByText("Адгадана")).toBeInTheDocument();
			expect(
				await screen.findByText(/Вы адгадалі слова за 3/)
			).toBeInTheDocument();
			const card = screen.getByTestId("finish-card");
			expect(card).toHaveClass("bg-pobach-soft");

			expect(screen.getByTestId("share-button")).toBeInTheDocument();
			expect(screen.getByText("23:45:12")).toBeInTheDocument();
		});
	});
});
