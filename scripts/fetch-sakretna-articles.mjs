/**
 * Refreshes Sakretna article bodies with the original be.wikipedia text.
 *
 * Keeps the article list (ids, order, titles) from articles.json and replaces
 * each body with the page's current extract, preserving its structure:
 *   "## Heading" / "### Subheading" / "#### Subsubheading"
 *   "- list item"
 *   any other line is a paragraph
 *
 * Reference-only sections (footnotes, literature, links, "see also") are
 * dropped. Articles over MAX_BODY_LENGTH lose whole trailing sections.
 * Articles that editors flagged for poor language or unfinished translation
 * are removed from the list.
 *
 * Usage: node scripts/fetch-sakretna-articles.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_PATH = join(
	__dirname,
	"..",
	"src",
	"games",
	"sakretna",
	"data",
	"articles.json"
);
const API_URL = "https://be.wikipedia.org/w/api.php";
const USER_AGENT = "slovy.games/0.1 (https://slovy.games)";
const MAX_BODY_LENGTH = 20000;
const CONCURRENCY = 2;

const SKIPPED_SECTIONS = new Set([
	"бібліяграфія",
	"вонкавыя спасылкі",
	"гл. таксама",
	"глядзі таксама",
	"глядзіце таксама",
	"заўвагі",
	"знешнія спасылкі",
	"зноскі",
	"каментарыі",
	"крыніцы",
	"літаратура",
	"прымечанні",
	"спасылкі",
]);

/** Hidden maintenance categories that mark text as needing language fixes. */
const LOW_QUALITY_CATEGORIES = new Set([
	"Катэгорыя:Удакладненне арфаграфіі",
	"Катэгорыя:Вікіпедыя:Пераклады да дапрацоўкі",
	"Катэгорыя:Старонкі з недагледжанымі перакладамі",
]);

const ENTITIES = {
	amp: "&",
	lt: "<",
	gt: ">",
	quot: '"',
	apos: "'",
	nbsp: " ",
};

function decodeEntities(text) {
	return text.replace(/&(#x[\da-f]+|#\d+|\w+);/giu, (match, entity) => {
		if (entity[0] === "#") {
			const code =
				entity[1].toLowerCase() === "x"
					? Number.parseInt(entity.slice(2), 16)
					: Number.parseInt(entity.slice(1), 10);
			return String.fromCodePoint(code);
		}
		return ENTITIES[entity.toLowerCase()] ?? match;
	});
}

/** Matches one HTML tag, including attributes whose values contain ">". */
const TAG = /<(?:"[^"]*"|'[^']*'|[^>"'])*>/gu;

/**
 * Template leftovers in extract text: Wikidata links "[d]" / "[…]",
 * footnote numbers glued to a word "[1]", and "[хто?]"-style tags.
 * Bracketed content such as "[AuX4]" or "203, [4] с." is kept.
 */
export const TEMPLATE_MARKERS =
	/\[(?:d|…)\]|(?<=\S)\[\d{1,3}\]|\[(?:хто|што|дзе|калі|які|крыніца|ці так)\?\]/gu;

/** Archived-link notes left inline: "[2] Архівавана 21 сакавіка 2013." */
export const ARCHIVE_NOTES =
	/\s*(?:\[\d{1,3}\]\s*)?Архівавана \d{1,2} \p{L}+ \d{4}\./gu;

/** Flatten MathML into its visible symbols ("a2+b2=c2"), dropping the TeX source. */
function flattenMath(math) {
	return math
		.replace(/<annotation\b[\s\S]*?<\/annotation>/giu, "")
		.replace(TAG, "")
		.replace(/\s*\n\s*/gu, "");
}

/** Convert a MediaWiki extract (HTML) into marker-prefixed lines. */
function htmlToLines(html) {
	const text = html
		.replace(/<math\b[\s\S]*?<\/math>/giu, flattenMath)
		.replace(
			/<h([2-6])[^>]*>([\s\S]*?)<\/h\1>/giu,
			(_, level, inner) =>
				`\n${"#".repeat(Math.min(Number(level), 4))} ${inner.replace(/\n/gu, " ")}\n`
		)
		.replace(/<li[^>]*>/giu, "\n- ")
		.replace(/<br\s*\/?>/giu, "\n")
		.replace(
			/<\/?(p|ul|ol|li|dl|dd|dt|div|blockquote|table|tr)\b(?:"[^"]*"|'[^']*'|[^>"'])*>/giu,
			"\n"
		)
		.replace(TAG, "");

	return (
		decodeEntities(text)
			// Stress marks break lemmatization ("Ца́цка" would never match "цацка").
			.replace(/́/gu, "")
			// A few live pages carry unrendered link markup: "[[Target|label]]".
			.replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/gu, "$1")
			.replace(/\[\[|\]\]|\{\{|\}\}/gu, "")
			// ...and broken citations: "ref> (англ.) Source...</ref>".
			.replace(/ ?<?\bref\b[^>\n]*>[^\n]*?<\/ref>/gu, "")
			.replace(ARCHIVE_NOTES, "")
			.replace(TEMPLATE_MARKERS, "")
			.split("\n")
			.map((line) => line.replace(/[\s ]+/gu, " ").trim())
			.filter((line) => line && line !== "-")
	);
}

function headingLevel(line) {
	return line.match(/^(#{2,4}) /u)?.[1].length ?? 0;
}

function headingText(line) {
	return line.replace(/^#+ /u, "").toLowerCase().replace(/[.:]$/u, "").trim();
}

/** Drop reference sections, including their subsections. */
function dropSkippedSections(lines) {
	const kept = [];
	let skipLevel = 0;
	for (const line of lines) {
		const level = headingLevel(line);
		if (skipLevel && (!level || level > skipLevel)) continue;
		skipLevel = 0;
		if (level && SKIPPED_SECTIONS.has(headingText(line))) {
			skipLevel = level;
			continue;
		}
		kept.push(line);
	}
	return kept;
}

/** Drop headings that have no text before the next heading of equal or higher rank. */
function dropEmptyHeadings(lines) {
	return lines.filter((line, index) => {
		const level = headingLevel(line);
		if (!level) return true;
		for (const next of lines.slice(index + 1)) {
			const nextLevel = headingLevel(next);
			if (!nextLevel) return true;
			if (nextLevel <= level) return false;
		}
		return false;
	});
}

/** Remove whole trailing sections (then paragraphs) until the body fits. */
function fitLength(lines) {
	const result = [...lines];
	const length = () => result.join("\n").length;
	while (length() > MAX_BODY_LENGTH) {
		const lastSection = result.findLastIndex((line) => headingLevel(line));
		if (lastSection > 0) result.splice(lastSection);
		else result.pop();
	}
	return dropEmptyHeadings(result);
}

export function htmlToBody(html) {
	return fitLength(
		dropEmptyHeadings(dropSkippedSections(htmlToLines(html)))
	).join("\n");
}

async function fetchPage(article) {
	const pageId = article.id.match(/^wiki-(\d+)$/u)?.[1];
	const params = new URLSearchParams({
		action: "query",
		prop: "extracts|categories",
		clshow: "hidden",
		cllimit: "max",
		format: "json",
		formatversion: "2",
		redirects: "1",
		...(pageId ? { pageids: pageId } : { titles: article.title }),
	});
	for (let attempt = 1; ; attempt += 1) {
		const response = await fetch(`${API_URL}?${params}`, {
			headers: { "User-Agent": USER_AGENT },
		});
		if (response.ok) {
			const page = (await response.json()).query?.pages?.[0];
			if (!page?.extract) throw new Error(`No extract for ${article.title}`);
			return page;
		}
		if (attempt >= 8) {
			throw new Error(`${response.status} for ${article.title}`);
		}
		const retryAfter = Number(response.headers.get("retry-after")) || 0;
		const delay = Math.max(retryAfter * 1000, attempt * 5000);
		await new Promise((resolve) => setTimeout(resolve, delay));
	}
}

async function main() {
	const articles = JSON.parse(readFileSync(ARTICLES_PATH, "utf-8"));
	const retrieved = new Date().toISOString().slice(0, 10);
	const flagged = new Set();
	let next = 0;
	let done = 0;

	async function worker() {
		while (next < articles.length) {
			const article = articles[next];
			next += 1;
			const page = await fetchPage(article);
			if (page.title !== article.title) {
				console.warn(`  ! ${article.title} is now "${page.title}"`);
			}
			const flag = page.categories?.find((category) =>
				LOW_QUALITY_CATEGORIES.has(category.title)
			);
			if (flag) {
				console.warn(`  - ${article.title}: ${flag.title}`);
				flagged.add(article);
			}
			article.body = htmlToBody(page.extract);
			article.retrieved = retrieved;
			done += 1;
			if (done % 50 === 0) console.log(`  ${done}/${articles.length}`);
		}
	}

	await Promise.all(Array.from({ length: CONCURRENCY }, worker));
	const kept = articles.filter((article) => !flagged.has(article));
	writeFileSync(ARTICLES_PATH, `${JSON.stringify(kept, null, 2)}\n`);
	console.log(
		`Updated ${kept.length} articles, removed ${flagged.size} flagged ones.`
	);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
