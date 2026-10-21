import type { ArticleToken } from "../types";

export type ArticleBlock =
	| { kind: "heading"; level: 2 | 3 | 4; tokens: ArticleToken[] }
	| { kind: "paragraph"; tokens: ArticleToken[] }
	| { kind: "list"; items: ArticleToken[][] };

/** Line markers written by scripts/fetch-sakretna-articles.mjs. */
const HEADING_MARKER = /^(#{2,4}) /u;
const LIST_MARKER = "- ";

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
	return tokens.map((token) => token.text).join("");
}

/** Drop the leading separator tokens that spell out a line marker. */
function stripMarker(
	tokens: ArticleToken[],
	markerLength: number
): ArticleToken[] {
	let consumed = 0;
	let index = 0;
	while (consumed < markerLength && tokens[index]?.type === "sep") {
		consumed += tokens[index].text.length;
		index += 1;
	}
	return tokens.slice(index);
}

/** Convert marker-prefixed article lines into semantic reading blocks. */
export function buildArticleBlocks(tokens: ArticleToken[]): ArticleBlock[] {
	const blocks: ArticleBlock[] = [];

	for (const line of splitLines(tokens)) {
		const text = lineText(line);
		if (!text.trim()) continue;

		const heading = text.match(HEADING_MARKER);
		if (heading) {
			blocks.push({
				kind: "heading",
				level: heading[1].length as 2 | 3 | 4,
				tokens: stripMarker(line, heading[0].length),
			});
			continue;
		}

		if (text.startsWith(LIST_MARKER)) {
			const item = stripMarker(line, LIST_MARKER.length);
			const previous = blocks.at(-1);
			if (previous?.kind === "list") previous.items.push(item);
			else blocks.push({ kind: "list", items: [item] });
			continue;
		}

		blocks.push({ kind: "paragraph", tokens: line });
	}

	return blocks;
}
