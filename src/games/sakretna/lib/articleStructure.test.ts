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
	it("parses heading and list markers into blocks", () => {
		const blocks = buildArticleBlocks(
			tokens(
				"Уступ.\n## Біялогія\nТэкст абзаца.\n### Віды\n- Першы від\n- Другі від\n#### Падвід\nАпошні абзац."
			)
		);

		expect(blocks.map((block) => block.kind)).toEqual([
			"paragraph",
			"heading",
			"paragraph",
			"heading",
			"list",
			"heading",
			"paragraph",
		]);
		expect(
			blocks.flatMap((block) => (block.kind === "heading" ? block.level : []))
		).toEqual([2, 3, 4]);
	});

	it("strips markers from rendered text", () => {
		const [heading, list] = buildArticleBlocks(
			tokens("## Біялогія\n- Першы від\n- Другі від")
		);
		const text = (blockTokens: ArticleToken[]) =>
			blockTokens.map((token) => token.text).join("");

		expect(heading.kind === "heading" && text(heading.tokens)).toBe("Біялогія");
		expect(list.kind === "list" && list.items.map(text)).toEqual([
			"Першы від",
			"Другі від",
		]);
	});
});
