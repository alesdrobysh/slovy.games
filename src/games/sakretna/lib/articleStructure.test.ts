import type { ArticleToken } from "../types";
import { buildArticleBlocks } from "./articleStructure";

function tokens(text: string): ArticleToken[] {
	return (text.match(/[\p{Letter}\p{M}]+|[^\p{Letter}\p{M}]/gu) ?? []).map(
		(part) =>
			/[\p{Letter}\p{M}]/u.test(part)
				? { type: "word" as const, text: part, lemma: part.toLowerCase() }
				: { type: "sep" as const, text: part }
	);
}

describe("buildArticleBlocks", () => {
	it("preserves headings, paragraphs, lists and removes references", () => {
		const blocks = buildArticleBlocks(
			tokens(
				"Уступ.\n\n\nБіялогія\nТэкст абзаца.\n\nВіды:\n\nПершы від\nДругі від\n\n\nЛітаратура\nСхаваная крыніца"
			)
		);

		expect(blocks.map((block) => block.kind)).toEqual([
			"paragraph",
			"heading",
			"paragraph",
			"paragraph",
			"list",
		]);
		expect(
			blocks.some(
				(block) =>
					"tokens" in block &&
					block.tokens
						.map((token) => token.text)
						.join("")
						.includes("Літаратура")
			)
		).toBe(false);
	});
});
