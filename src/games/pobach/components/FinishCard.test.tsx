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
	getStats: () => ({ currentStreak: 0, maxStreak: 0, gamesPlayed: 0, gamesWon: 0 }),
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
		it("should render lose mode correctly with target word", () => {
			const loseProps = {
				...defaultProps,
				mode: "lose" as const,
				targetWord: "правільнае",
			};
			render(<FinishCard {...loseProps} />);

			expect(
				screen.getByText("Заўтра — новае слова")
			).toBeInTheDocument();
			expect(screen.getByText("Правільнае слова:")).toBeInTheDocument();
			expect(screen.getByText("правільнае")).toBeInTheDocument();
			expect(screen.queryByText("🎉")).not.toBeInTheDocument();

			const card = screen.getByTestId("finish-card");
			expect(card).toHaveClass("bg-card");
			expect(card).toHaveClass("ring-rule");

			expect(screen.getByTestId("share-button")).toBeInTheDocument();
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

			expect(
				screen.getByText("Адгадана 🎉")
			).toBeInTheDocument();
			expect(
				screen.getByText(/Вы знайшлі слова за 3 спроб/)
			).toBeInTheDocument();

			const card = screen.getByTestId("finish-card");
			expect(card).toHaveClass("bg-pobach-soft");

			expect(screen.getByTestId("share-button")).toBeInTheDocument();
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
