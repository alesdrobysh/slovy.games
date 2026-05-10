/**
 * FinishCard Component Integration Tests
 * Tests FinishCard component behavior in different modes
 */

import { render, screen } from "@testing-library/react";
import FinishCard from "@/games/pobach/components/FinishCard";

// Mock the dependencies
jest.mock("@/shared/hooks/useCountdown", () => ({
	useCountdown: () => "23:45:12",
}));

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
		it("should render lose mode correctly with target word", () => {
			const loseProps = {
				...defaultProps,
				mode: "lose" as const,
				targetWord: "правільнае",
			};
			render(<FinishCard {...loseProps} />);

			// Check title
			expect(screen.getByText("Таямніца раскрыта!")).toBeInTheDocument();

			// Check stats
			expect(
				screen.getByText(
					"Таямніца раскрыта! 🔓 Дзякуй за гульню. Заўтра будзе новае слова — заходзьце праверыць веды!"
				)
			).toBeInTheDocument();

			// Check target word is shown
			expect(screen.getByText("Правільнае слова:")).toBeInTheDocument();
			expect(screen.getByText("правільнае")).toBeInTheDocument();

			// Check no emoji
			expect(screen.queryByText("🎉")).not.toBeInTheDocument();

			// Check simple styling (not gradient)
			const card = screen.getByTestId("finish-card");
			expect(card).toHaveClass("finishCardLose");
			expect(card).not.toHaveClass("finishCardWin");

			// Check share button is still present
			expect(screen.getByTestId("share-button")).toBeInTheDocument();

			// Check countdown timer is still present
			expect(screen.getByText("23:45:12")).toBeInTheDocument();
		});

		it("should not show target word when not provided", () => {
			const loseProps = { ...defaultProps, mode: "lose" as const };
			render(<FinishCard {...loseProps} />);

			expect(screen.queryByText("Правільнае слова:")).not.toBeInTheDocument();
		});
	});

	describe("Win Mode", () => {
		it("should render win mode correctly", () => {
			const winProps = { ...defaultProps, mode: "win" as const };
			render(<FinishCard {...winProps} />);

			// Check title
			expect(screen.getByText("Віншуем!")).toBeInTheDocument();

			// Check stats
			expect(
				screen.getByText(
					"Вы адгадалі слова за 3 спробы! Заўтра будзе новае слова — заходзьце праверыць веды!"
				)
			).toBeInTheDocument();

			// Check emoji is present
			const emoji = screen.getByText("🎉");
			expect(emoji).toBeInTheDocument();

			// Check gradient styling
			const card = screen.getByTestId("finish-card");
			expect(card).toHaveClass("finishCardWin");

			// Check share button is present
			expect(screen.getByTestId("share-button")).toBeInTheDocument();

			// Check countdown timer is present
			expect(screen.getByText("23:45:12")).toBeInTheDocument();
		});

		it("should not show target word in win mode", () => {
			const winProps = {
				...defaultProps,
				mode: "win" as const,
				targetWord: "secret",
			};
			render(<FinishCard {...winProps} />);

			expect(screen.queryByText("Правільнае слова:")).not.toBeInTheDocument();
		});
	});
});
