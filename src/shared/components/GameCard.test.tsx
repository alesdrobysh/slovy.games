import { render, screen } from "@testing-library/react";
import { GAMES } from "@/shared/types";
import { GameCard } from "./GameCard";

describe("GameCard", () => {
	it("does not repeat the completed result label as a CTA", () => {
		const game = GAMES.find((game) => game.id === "sakretna");
		if (!game) throw new Error("Sakretna game metadata is missing");

		render(<GameCard game={game} status="given_up" progressText="Здаліся" />);

		expect(screen.getAllByText("Вынік")).toHaveLength(1);
	});
});
