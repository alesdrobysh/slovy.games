import { render, screen } from "@testing-library/react";
import type { GameYearStats } from "@/shared/types/wrapped";
import { GameSlide } from "./GameSlide";

const stats: GameYearStats = {
	gameId: "pobach",
	year: 2026,
	daysPlayed: ["2026-03-01", "2026-03-02", "2026-03-03"],
	daysWon: ["2026-03-01", "2026-03-02"],
	longestStreakInYear: 2,
	highlights: [
		{ key: "bestAttempts", label: "Найменш спробаў", value: 4 },
		{ key: "winRate", label: "Адгадана", value: "67%" },
	],
};

describe("GameSlide", () => {
	it("shows the game name and days played on page 1", () => {
		render(<GameSlide stats={stats} page={1} />);
		expect(screen.getByText("Побач")).toBeInTheDocument();
		expect(screen.getByText("3")).toBeInTheDocument();
	});

	it("shows highlights on page 2", () => {
		render(<GameSlide stats={stats} page={2} />);
		expect(screen.getByText("Найменш спробаў")).toBeInTheDocument();
		expect(screen.getByText("4")).toBeInTheDocument();
		expect(screen.getByText("67%")).toBeInTheDocument();
	});

	it("renders nothing for highlights it does not have", () => {
		render(<GameSlide stats={{ ...stats, highlights: [] }} page={2} />);
		expect(screen.queryByText("Найменш спробаў")).not.toBeInTheDocument();
	});
});
