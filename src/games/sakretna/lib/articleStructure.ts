import type { ArticleToken } from "../types";

export type ArticleBlock =
	| { kind: "heading"; level: 2 | 3; tokens: ArticleToken[] }
	| { kind: "paragraph"; tokens: ArticleToken[] }
	| { kind: "list"; items: ArticleToken[][] };

const REFERENCE_HEADINGS = new Set([
	"бібліяграфія",
	"літаратура",
	"спасылкі",
	"зноскі",
	"крыніцы",
]);

function splitLines(tokens: ArticleToken[]): ArticleToken[][] {
	const lines: ArticleToken[][] = [[]];
	for (const token of tokens) {
		if (token.type === "sep" && token.text === "\n") {
			lines.push([]);
		} else {
			lines.at(-1)?.push(token);
		}
	}
	return lines;
}

function lineText(tokens: ArticleToken[]): string {
	return tokens
		.map((token) => token.text)
		.join("")
		.trim();
}

function isHeadingLine(lines: ArticleToken[][], index: number): boolean {
	const text = lineText(lines[index]);
	if (!text || index === 0 || lineText(lines[index - 1]) !== "") return false;
	const wordCount = lines[index].filter(
		(token) => token.type === "word"
	).length;
	return (
		wordCount > 0 &&
		wordCount <= 8 &&
		text.length <= 80 &&
		!/[.!?;:]$/u.test(text)
	);
}

function normalizedHeading(tokens: ArticleToken[]): string {
	return lineText(tokens).toLowerCase().replace(/:$/u, "").trim();
}

/** Convert newline-preserving article tokens into semantic reading blocks. */
export function buildArticleBlocks(tokens: ArticleToken[]): ArticleBlock[] {
	const lines = splitLines(tokens);
	const blocks: ArticleBlock[] = [];
	let previousWasHeading = false;

	for (let index = 0; index < lines.length; index += 1) {
		const tokensInLine = lines[index];
		const text = lineText(tokensInLine);
		if (!text) continue;

		if (isHeadingLine(lines, index)) {
			if (REFERENCE_HEADINGS.has(normalizedHeading(tokensInLine))) break;
			blocks.push({
				kind: "heading",
				level: previousWasHeading ? 3 : 2,
				tokens: tokensInLine,
			});
			previousWasHeading = true;
			continue;
		}

		previousWasHeading = false;
		blocks.push({ kind: "paragraph", tokens: tokensInLine });

		if (!text.endsWith(":")) continue;
		let cursor = index + 1;
		while (cursor < lines.length && !lineText(lines[cursor])) cursor += 1;
		const items: ArticleToken[][] = [];
		while (cursor < lines.length && lineText(lines[cursor])) {
			items.push(lines[cursor]);
			cursor += 1;
		}
		if (items.length >= 2) {
			blocks.push({ kind: "list", items });
			index = cursor - 1;
		}
	}

	return blocks;
}
