import { belmorphMock, flushMicrotasks, setLemma } from "../lib/belmorph.mock";

jest.mock("belmorph", () => belmorphMock, { virtual: true });

import { fireEvent, render, screen } from "@testing-library/react";
import { tokenize } from "../lib/tokenize";
import { GuessList } from "./GuessList";

describe("GuessList", () => {
	beforeAll(async () => {
		setLemma("горад", "горад");
		setLemma("горада", "горад");
		setLemma("мінск", "мінск");
		setLemma("гісторыя", "гісторыя");
		setLemma("гісторыяй", "гісторыя");
		await flushMicrotasks();
	});

	it("shows original input and distinguishes hit counts from misses", () => {
		render(
			<GuessList
				guesses={["горад", "аўтамабіль"]}
				tokens={tokenize("Горад і гісторыя горада")}
			/>
		);

		expect(screen.getByLabelText("горад: раскрыта 2")).toBeInTheDocument();
		expect(
			screen.getByLabelText("аўтамабіль: няма ў артыкуле")
		).toBeInTheDocument();
		expect(screen.getByText("✓ 2")).toBeInTheDocument();
		expect(screen.getByText("× 0")).toBeInTheDocument();
	});

	it("keeps the complete history available and selects hit lemmas", () => {
		const onSelect = jest.fn();
		render(
			<GuessList
				guesses={["горад", "гісторыя", "сталіца", "мінск"]}
				tokens={tokenize("Мінск — горад з гісторыяй")}
				onSelect={onSelect}
			/>
		);

		fireEvent.click(screen.getByText("Уся гісторыя (4)"));
		expect(screen.getAllByText("горад").length).toBeGreaterThan(0);
		fireEvent.click(screen.getAllByLabelText("мінск: раскрыта 1")[0]);
		expect(onSelect).toHaveBeenCalledWith("мінск");
	});
});
