import type { ArticleToken } from "../types";

/** Letters of the Belarusian alphabet; a word with any other letter is foreign. */
const BELARUSIAN_WORD = /^[абвгдеёжзійклмнопрстуўфхцчшыьэюя'‘’ʼ]+$/u;
const CYRILLIC_WORD = /^[\p{Script=Cyrillic}'‘’ʼ]+$/u;
const STRESS_MARK = /\u0301/gu;
/** Separators that split a lead parenthetical into per-language pieces. */
const SEGMENT_BREAK = /[,;:—–()[\]/.]/u;
const SEGMENT_BREAK_WORDS = new Set(["або", "альбо", "ці"]);
const DASH = /[—–]/u;

const TO_LATIN: Record<string, string> = Object.fromEntries(
	(
		"а:a б:b в:v г:g ґ:g д:d е:e ё:o є:e ж:z з:z и:i і:i ї:i й:i " +
		"к:k л:l м:m н:n о:o п:p р:r с:s т:t у:u ў:u ф:f х:h ц:ts ч:ch " +
		"ш:sh щ:sh ы:i э:e ю:iu я:ia α:a β:b γ:g δ:d ε:e ζ:z η:e θ:t " +
		"ι:i κ:k λ:l μ:m ν:n ξ:ks ο:o π:p ρ:r σ:s ς:s τ:t υ:i φ:f χ:h " +
		"ψ:ps ω:o"
	)
		.split(" ")
		.map((pair) => pair.split(":"))
);

function stripMarks(word: string): string {
	return word.normalize("NFD").replace(/\p{M}/gu, "").normalize("NFC");
}

function isForeign(word: string): boolean {
	return !BELARUSIAN_WORD.test(word.toLowerCase().replace(STRESS_MARK, ""));
}

/** Rough Latin spelling, so that πλανκτον, plankton and планктон compare equal. */
function skeleton(word: string): string {
	return [...stripMarks(word.toLowerCase())]
		.map((ch) => TO_LATIN[ch] ?? ch)
		.join("")
		.replace(/ph/g, "f")
		.replace(/[cq]/g, "k")
		.replace(/y/g, "i")
		.replace(/w/g, "v")
		.replace(/x/g, "ks")
		.replace(/[^a-z]/g, "")
		.replace(/(.)\1+/g, "$1");
}

function editDistance(a: string, b: string): number {
	let previous = Array.from({ length: b.length + 1 }, (_, j) => j);
	for (let i = 1; i <= a.length; i++) {
		const current = [i];
		for (let j = 1; j <= b.length; j++) {
			current[j] = Math.min(
				previous[j] + 1,
				current[j - 1] + 1,
				previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
			);
		}
		previous = current;
	}
	return previous[b.length];
}

/** Same word in another spelling: κάμηλος ~ Camelus, Πλαγκτόν ~ планктон. */
function spelledAlike(a: string, b: string): boolean {
	const length = Math.max(a.length, b.length);
	if (Math.min(a.length, b.length) < 4) return false;
	return editDistance(a, b) <= Math.floor(length / 6);
}

/** Tokens inside the parenthetical that opens a Wikipedia lead:
 *  "Вярблюды (Camelus) — род…". Only a parenthetical before the lead's
 *  first dash counts, so a later aside in the paragraph is ignored. */
function leadParenthetical(tokens: ArticleToken[]): ArticleToken[] {
	const inside: ArticleToken[] = [];
	let depth = 0;
	let started = false;
	for (const token of tokens) {
		if (token.type === "word") started = true;
		if (token.type === "sep") {
			if (depth === 0 && started && token.text === "\n") break;
			if (depth === 0 && DASH.test(token.text)) break;
			if (token.text === "(") {
				depth += 1;
				if (depth === 1) continue;
			} else if (token.text === ")" && depth > 0) {
				depth -= 1;
				if (depth === 0) return inside;
			}
		}
		if (depth > 0) inside.push(token);
	}
	return inside;
}

/** Split tokens into pieces such as "лац", "Camelus", "«Война и мир»". */
function segments(tokens: ArticleToken[]): ArticleToken[][] {
	const result: ArticleToken[][] = [[]];
	for (const token of tokens) {
		if (
			token.type === "sep"
				? SEGMENT_BREAK.test(token.text)
				: SEGMENT_BREAK_WORDS.has(token.text.toLowerCase())
		) {
			result.push([]);
		} else if (token.type === "word") {
			result.at(-1)?.push(token);
		}
	}
	return result.filter((segment) => segment.length > 0);
}

/**
 * Lemmas of article words that translate the title into another language,
 * like Camelus in "Вярблюды (Camelus)". A hint must not open them, since
 * they give the answer away just as the title words would.
 */
export function titleTranslationLemmas(
	tokens: ArticleToken[],
	titleTokens: ArticleToken[]
): Set<string> {
	const translations = new Set<string>();
	const lock = (token: ArticleToken) => {
		if (token.lemma && !token.isFree) translations.add(token.lemma);
	};

	for (const segment of segments(leadParenthetical(tokens))) {
		// A Cyrillic foreign piece, such as руск. «Война и мир», is a whole
		// translation even where single words look Belarusian.
		const cyrillicForeign = segment.some(
			(token) => isForeign(token.text) && CYRILLIC_WORD.test(token.text)
		);
		for (const token of segment) {
			if (cyrillicForeign || isForeign(token.text)) lock(token);
		}
	}

	const known = new Set(
		[
			...titleTokens.filter((token) => token.type === "word" && !token.isFree),
			...tokens.filter((token) => translations.has(token.lemma ?? "")),
		].map((token) => skeleton(token.text))
	);
	for (const token of tokens) {
		if (token.type !== "word" || !isForeign(token.text)) continue;
		const spelling = skeleton(token.text);
		if ([...known].some((other) => spelledAlike(spelling, other))) lock(token);
	}

	return translations;
}
