import { belmorphMock } from "../lib/belmorph.mock";

jest.mock("belmorph", () => belmorphMock, { virtual: true });

import type { ArticleToken } from "../types";
import { pickHintLemma } from "./useSakretnaGame";

const word = (text: string, lemma = text.toLowerCase()): ArticleToken => ({
	type: "word",
	text,
	lemma,
	isFree: false,
});
const separator = (text: string): ArticleToken => ({ type: "sep", text });

describe("pickHintLemma", () => {
	it("excludes title, latin URL tokens, and reference sections", () => {
		const tokens: ArticleToken[] = [
			word("Мінск", "мінск"),
			separator(" "),
			word("сталіца", "сталіца"),
			separator(" "),
			word("https"),
			separator("\n"),
			word("Літаратура", "літаратура"),
			separator("\n"),
			word("кніга", "кніга"),
		];
		const random = jest.spyOn(Math, "random").mockReturnValue(0);

		expect(pickHintLemma(tokens, new Set(), new Set(["мінск"]))).toBe(
			"сталіца"
		);
		random.mockRestore();
	});
});
