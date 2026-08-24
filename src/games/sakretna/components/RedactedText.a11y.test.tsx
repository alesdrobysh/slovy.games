import { render, screen } from "@testing-library/react";
import type { ArticleToken } from "../types";
import { RedactedText } from "./RedactedText";

const tokens: ArticleToken[] = Array.from({ length: 1000 }, (_, index) => ({
	type: "word" as const,
	text: `слова${index}`,
	lemma: `слова${index}`,
	isFree: false,
}));

describe("RedactedText keyboard flow", () => {
	it("does not expose every redaction as a focusable control", () => {
		const compatibleProps = {
			tokens,
			titleTokens: [],
			foundLemmas: new Set<string>(),
			revealTitle: false,
		} as Parameters<typeof RedactedText>[0] & {
			titleTokens: ArticleToken[];
			revealTitle: boolean;
		};
		render(<RedactedText {...compatibleProps} />);

		expect(screen.queryAllByRole("button")).toHaveLength(0);
	});
});
