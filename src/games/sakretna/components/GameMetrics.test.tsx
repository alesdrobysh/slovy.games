import { belmorphMock, flushMicrotasks, setLemma } from "../lib/belmorph.mock";

jest.mock("belmorph", () => belmorphMock, { virtual: true });

import { render, screen } from "@testing-library/react";
import { tokenize } from "../lib/tokenize";
import { GameMetrics } from "./GameMetrics";

describe("GameMetrics", () => {
	beforeAll(async () => {
		setLemma("мінск", "мінск");
		setLemma("горад", "горад");
		setLemma("горада", "горад");
		await flushMicrotasks();
	});

	it("reports guesses, revealed occurrences, title progress, and hint use", () => {
		render(
			<GameMetrics
				guesses={2}
				foundLemmas={new Set(["горад"])}
				tokens={tokenize("Горад і гісторыя горада")}
				title="Мінск — горад"
				hintsUsed={1}
			/>
		);

		expect(screen.getByText("Спробы").nextSibling).toHaveTextContent("2");
		expect(screen.getByText("Раскрыцці").nextSibling).toHaveTextContent("2");
		expect(screen.getByText("Назва").nextSibling).toHaveTextContent("1/2");
		expect(screen.getByText("З падказкай")).toBeInTheDocument();
	});
});
