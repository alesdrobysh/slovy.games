import { render, screen } from "@testing-library/react";
import type { GameYearStats } from "@/shared/types/wrapped";
import { GameSlide } from "./GameSlide";

const stats: GameYearStats = {
	gameId: "pobach",
	year: 2026,
	daysPlayed: ["2026-03-01", "2026-03-02", "2026-03-03"],
	daysWon: ["2026-03-01", "2026-03-02"],
	longestStreakInYear: 2,
	headline: { value: 2, caption: "словы адгаданы" },
	highlights: [
		{
			key: "bestWin",
			label: "Найлепшая перамога",
			value: "сонца",
			caption: "4 спробы, без падказак",
		},
		{ key: "winRate", label: "Працэнт перамог", value: "67%" },
	],
};

describe("GameSlide", () => {
	it("shows the game name and headline on page 1", () => {
		render(<GameSlide stats={stats} page={1} />);
		expect(screen.getByText("Побач")).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument();
		expect(screen.getByText("словы адгаданы")).toBeInTheDocument();
	});

	it("shows highlights on page 2", () => {
		render(<GameSlide stats={stats} page={2} />);
		expect(screen.getByText("Найлепшая перамога")).toBeInTheDocument();
		expect(screen.getByText("сонца")).toBeInTheDocument();
		expect(screen.getByText("4 спробы, без падказак")).toBeInTheDocument();
		expect(screen.getByText("67%")).toBeInTheDocument();
	});

	it("renders nothing for highlights it does not have", () => {
		render(<GameSlide stats={{ ...stats, highlights: [] }} page={2} />);
		expect(screen.queryByText("Найлепшая перамога")).not.toBeInTheDocument();
	});
});
