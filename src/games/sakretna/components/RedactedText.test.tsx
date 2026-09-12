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
	const HEADING_ARTICLE: ArticleToken[] = [
		{ type: "word", text: "Артыкул", lemma: "артыкул" },
		{ type: "sep", text: "\n" },
		{ type: "sep", text: "\n" },
		{ type: "word", text: "Гісторыя", lemma: "гісторыя" },
	];

	it("hides article headings until their words are found", () => {
		render(
			<RedactedText
				tokens={HEADING_ARTICLE}
				foundLemmas={new Set()}
				titleTokens={[]}
			/>
		);

		expect(screen.queryByText("Гісторыя")).not.toBeInTheDocument();
		expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
		expect(screen.getByText("8", { selector: "span" })).toBeInTheDocument();
	});

	it("keeps a hidden heading reachable for screen readers", () => {
		render(
			<RedactedText
				tokens={HEADING_ARTICLE}
				foundLemmas={new Set()}
				titleTokens={[]}
			/>
		);

		expect(
			screen.getByRole("heading", { name: "8 схаваных літар" })
		).toBeInTheDocument();
	});

	it("reveals the heading text once its lemma is found", () => {
		render(
			<RedactedText
				tokens={HEADING_ARTICLE}
				foundLemmas={new Set(["гісторыя"])}
				titleTokens={[]}
			/>
		);

		expect(
			screen.getByRole("heading", { name: "Гісторыя" })
		).toBeInTheDocument();
	});
});

describe("ProgressLine", () => {
	it("uses the genitive plural for the total article word count", () => {
		render(<ProgressLine foundLemmas={0} totalLemmas={288} />);

		expect(screen.getByText("Расшыфравана 0 з 288 слоў")).toBeInTheDocument();
	});
});
