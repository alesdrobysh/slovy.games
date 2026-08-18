jest.mock(
	"belmorph",
	() => ({
		MorphAnalyzer: jest.fn(),
		loadDictAsync: jest.fn(() => Promise.resolve({})),
	}),
	{ virtual: true }
);

import { render, screen } from "@testing-library/react";
import { ProgressLine } from "./RedactedText";

describe("ProgressLine", () => {
	it("uses the genitive plural for the total article word count", () => {
		render(<ProgressLine foundLemmas={0} totalLemmas={288} />);

		expect(screen.getByText("Расшыфравана 0 з 288 слоў")).toBeInTheDocument();
	});
});
