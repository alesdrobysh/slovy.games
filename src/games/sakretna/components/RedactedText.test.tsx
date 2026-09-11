jest.mock(
	"belmorph",
	() => ({
		MorphAnalyzer: jest.fn(),
		loadDictAsync: jest.fn(() => Promise.resolve({})),
	}),
	{ virtual: true }
);

import { render, screen } from "@testing-library/react";
import type { ArticleToken } from "../types";
import { ProgressLine, RedactedText } from "./RedactedText";

const TITLE_TOKENS: ArticleToken[] = [
	{ type: "word", text: "Адам", lemma: "адам" },
	{ type: "sep", text: " " },
	{ type: "word", text: "Гарабурда", lemma: "гарабурда" },
];

describe("RedactedText title", () => {
	it("shows length-aware placeholders before title words are found", () => {
		render(
			<RedactedText
				tokens={[]}
				foundLemmas={new Set()}
				titleTokens={TITLE_TOKENS}
			/>
		);

		expect(screen.queryByText("Адам Гарабурда")).not.toBeInTheDocument();
		expect(
			screen.getByRole("img", { name: "4 схаваных літар" })
		).toBeInTheDocument();
		expect(
			screen.getByRole("img", { name: "9 схаваных літар" })
		).toBeInTheDocument();
		expect(screen.getByText("4")).toBeInTheDocument();
		expect(screen.getByText("9")).toBeInTheDocument();
	});

	it("reveals only title words whose lemmas were found", () => {
		render(
			<RedactedText
				tokens={[]}
				foundLemmas={new Set(["адам"])}
				titleTokens={TITLE_TOKENS}
			/>
		);

		expect(screen.getByText("Адам")).toBeInTheDocument();
		expect(
			screen.getByRole("img", { name: "9 схаваных літар" })
		).toBeInTheDocument();
	});
});

describe("RedactedText headings", () => {
	it("hides article headings until their words are found", () => {
		const headingTokens: ArticleToken[] = [
			{ type: "word", text: "Гісторыя", lemma: "гісторыя" },
		];

		render(
			<RedactedText
				tokens={[{ type: "sep", text: "\n\n" }, ...headingTokens]}
				foundLemmas={new Set()}
				titleTokens={[]}
			/>
		);

		expect(screen.queryByText("Гісторыя")).not.toBeInTheDocument();
		expect(screen.getByText("8", { selector: "span" })).toBeInTheDocument();
	});
});
describe("ProgressLine", () => {
	it("uses the genitive plural for the total article word count", () => {
		render(<ProgressLine foundLemmas={0} totalLemmas={288} />);

		expect(screen.getByText("Расшыфравана 0 з 288 слоў")).toBeInTheDocument();
	});
});
