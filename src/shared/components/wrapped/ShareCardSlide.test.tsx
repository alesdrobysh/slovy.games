import { render, screen } from "@testing-library/react";
import type { WrappedSummary } from "@/shared/types/wrapped";
import { ShareCardSlide } from "./ShareCardSlide";

jest.mock("posthog-js", () => ({ capture: jest.fn() }));

const summary: WrappedSummary = {
	year: 2026,
	activeDays: ["2026-03-01", "2026-03-02"],
	gamesFinished: 2,
	longestStreakAnyGame: 2,
	busiestMonth: { month: 3, days: 2 },
	gameOfTheYear: "pobach",
	perGame: [],
	isThin: false,
};

describe("ShareCardSlide", () => {
	it("renders a share button", () => {
		render(<ShareCardSlide summary={summary} />);
		expect(
			screen.getByRole("button", { name: /Падзяліцца/ })
		).toBeInTheDocument();
	});

	it("renders a canvas preview at the card aspect ratio", () => {
		render(<ShareCardSlide summary={summary} />);
		const canvas = screen.getByTestId("wrapped-card-canvas");
		expect(canvas).toHaveAttribute("width", "1080");
		expect(canvas).toHaveAttribute("height", "1920");
	});

	it("does not throw when the 2d context is unavailable", () => {
		expect(() => render(<ShareCardSlide summary={summary} />)).not.toThrow();
	});
});
