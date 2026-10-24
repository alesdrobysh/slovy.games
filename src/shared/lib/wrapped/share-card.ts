import type { GameId } from "@/shared/config";
import { pluralize } from "@/shared/lib/pluralize";
import type { WrappedSummary } from "@/shared/types/wrapped";
import { gameName } from "./format";

/** Story-format frame, 9:16. */
export const CARD = { w: 1080, h: 1920 } as const;

const MIN_FONT_PX = 24;

/** Card palette is fixed, independent of the viewer's site theme, so a
 *  light-mode player still shares a legible dark card. Same hues as the
 *  Wrapped slides. */
const CARD_COLORS = {
	blue: "#442fe2",
	blueDeep: "#24038d",
	orange: "#ff7a00",
	yellow: "#f2f626",
	cream: "#faf1df",
	ink: "#1c1108",
	pattern: "rgba(242, 246, 38, 0.08)",
	heat: ["rgba(36, 3, 141, 0.08)", "#baade0", "#7b69e1", "#24038d"],
} as const;

/** The largest size at or below `startPx` at which `text` fits `maxWidth`,
 *  floored at a readable minimum. Mutates only `ctx.font`. */
export function fitText(
	ctx: Pick<CanvasRenderingContext2D, "measureText" | "font">,
	text: string,
	maxWidth: number,
	startPx: number,
	family: string,
	weight = 500,
	style = "normal"
): number {
	if (!text) return startPx;
	let size = startPx;
	while (size > MIN_FONT_PX) {
		ctx.font = `${style} ${weight} ${size}px ${family}`;
		if (ctx.measureText(text).width <= maxWidth) break;
		size -= 2;
	}
	return Math.max(size, MIN_FONT_PX);
}

/** Family stacks read from the same CSS vars `Typography` uses, with the
 *  literal stacks as a fallback for non-browser callers. */
export function cardFontStacks(): { display: string; body: string } {
	const fallback = {
		display: '"Literata", Georgia, serif',
		body: '"Wix Madefor Text", system-ui, sans-serif',
	};
	if (typeof window === "undefined") return fallback;

	const styles = getComputedStyle(document.documentElement);
	const display = styles.getPropertyValue("--font-d").trim();
	const body = styles.getPropertyValue("--font-b").trim();
	return {
		display: display || fallback.display,
		body: body || fallback.body,
	};
}

/** Best-effort font preload. `document.fonts.load` rejects on stacks it
 *  cannot parse, which must not fail the whole card. */
async function preloadFonts(display: string, body: string): Promise<void> {
	if (typeof document === "undefined" || !document.fonts) return;
	const specs = [
		`500 230px ${display}`,
		`italic 500 230px ${display}`,
		`400 42px ${body}`,
		`italic 400 42px ${body}`,
		`800 64px ${body}`,
	];
	await Promise.all(
		specs.map((spec) => document.fonts.load(spec).catch(() => undefined))
	);
	await document.fonts.ready;
}

/** The highlight each game contributes to "Мае словы года". */
const SHARE_WORD_KEYS: Partial<Record<GameId, string>> = {
	pobach: "favoriteGuess",
	valoshka: "favoriteWord",
	sakretna: "bestWin",
};

export interface ShareWord {
	game: string;
	value: string;
	caption: string;
}

export function shareWords(summary: WrappedSummary): ShareWord[] {
	return summary.perGame.flatMap((g) => {
		const highlight = g.highlights.find(
			(h) => h.key === SHARE_WORD_KEYS[g.gameId]
		);
		return highlight
			? [
					{
						game: gameName(g.gameId),
						value: String(highlight.value),
						caption: highlight.label.toLowerCase(),
					},
				]
			: [];
	});
}

/** Games-per-day levels for every day of `year`, preceded by blanks so the
 *  first column starts on Monday. `null` is a blank. */
export function yearHeatCells(
	year: number,
	gamesPerDay: Record<string, number>
): Array<number | null> {
	const jan1 = new Date(Date.UTC(year, 0, 1));
	const cells: Array<number | null> = Array((jan1.getUTCDay() + 6) % 7).fill(
		null
	);
	for (
		const d = new Date(jan1);
		d.getUTCFullYear() === year;
		d.setUTCDate(d.getUTCDate() + 1)
	) {
		const count = gamesPerDay[d.toISOString().slice(0, 10)] ?? 0;
		cells.push(Math.min(count, CARD_COLORS.heat.length - 1));
	}
	return cells;
}

/** The burst outline shared with the hero slide, as fractions of its box. */
const BURST = [
	[50, 0],
	[59, 12],
	[72, 4],
	[77, 20],
	[93, 18],
	[91, 35],
	[100, 44],
	[87, 54],
	[96, 68],
	[79, 72],
	[80, 89],
	[63, 87],
	[53, 100],
	[43, 87],
	[26, 95],
	[22, 78],
	[5, 78],
	[12, 61],
	[0, 51],
	[14, 40],
	[5, 24],
	[23, 22],
	[29, 6],
	[43, 15],
] as const;

function fillBurst(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	size: number,
	color: string
): void {
	ctx.fillStyle = color;
	ctx.beginPath();
	for (const [px, py] of BURST) {
		ctx.lineTo(x + (px / 100) * size, y + (py / 100) * size);
	}
	ctx.closePath();
	ctx.fill();
}

/** Canvas letter-spacing where supported (Chrome, Safari 17+); elsewhere
 *  the text is simply drawn unspaced. */
function setTracking(ctx: CanvasRenderingContext2D, px: number): void {
	if ("letterSpacing" in ctx) ctx.letterSpacing = `${px}px`;
}

/** A rotated orange band of repeated text, edge to edge. The text sits
 *  at the top of the band, so a taller band runs off the card below it. */
function drawRibbon(
	ctx: CanvasRenderingContext2D,
	body: string,
	top: number,
	height: number
): void {
	ctx.save();
	ctx.translate(CARD.w / 2, top + height / 2);
	ctx.rotate((-6 * Math.PI) / 180);
	ctx.fillStyle = CARD_COLORS.orange;
	ctx.fillRect(-600, -height / 2, 1200, height);
	ctx.fillStyle = CARD_COLORS.blueDeep;
	ctx.font = `800 64px ${body}`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("СЛОВЫ · СЛОВЫ · СЛОВЫ · СЛОВЫ · СЛОВЫ", 0, -height / 2 + 58);
	ctx.restore();
}

/** Split `text` into at most two lines that fit `maxWidth`, shrinking from
 *  `startPx`. A single line is preferred down to `oneLineMinPx`. */
function fitValue(
	ctx: CanvasRenderingContext2D,
	text: string,
	maxWidth: number,
	startPx: number,
	oneLineMinPx: number,
	family: string
): { lines: string[]; size: number } {
	const font = (px: number) => `italic 500 ${px}px ${family}`;
	const single = fitText(ctx, text, maxWidth, startPx, family, 500, "italic");
	const words = text.split(/\s+/);
	if (single >= oneLineMinPx || words.length < 2) {
		return { lines: [text], size: single };
	}

	// Break where the two halves come out closest in width.
	ctx.font = font(oneLineMinPx);
	let lines = [text];
	let widest = Number.POSITIVE_INFINITY;
	for (let i = 1; i < words.length; i++) {
		const pair = [words.slice(0, i).join(" "), words.slice(i).join(" ")];
		const w = Math.max(...pair.map((l) => ctx.measureText(l).width));
		if (w < widest) {
			widest = w;
			lines = pair;
		}
	}
	const longest = lines.reduce((a, b) =>
		ctx.measureText(a).width >= ctx.measureText(b).width ? a : b
	);
	const size = fitText(
		ctx,
		longest,
		maxWidth,
		oneLineMinPx,
		family,
		500,
		"italic"
	);
	return { lines, size };
}

function drawWordCard(
	ctx: CanvasRenderingContext2D,
	word: ShareWord,
	x: number,
	palette: { bg: string; ink: string; tilt: number },
	fonts: { display: string; body: string }
): void {
	const w = 300;
	const h = 190;
	const top = 1180;
	ctx.save();
	ctx.translate(x + w / 2, top + h / 2);
	ctx.rotate((palette.tilt * Math.PI) / 180);
	ctx.fillStyle = CARD_COLORS.blueDeep;
	ctx.fillRect(-w / 2 + 12, -h / 2 + 12, w, h);
	ctx.fillStyle = palette.bg;
	ctx.fillRect(-w / 2, -h / 2, w, h);

	ctx.fillStyle = palette.ink;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	setTracking(ctx, 4.8);
	ctx.font = `500 24px ${fonts.body}`;
	ctx.fillText(word.game.toUpperCase(), 0, -62);
	setTracking(ctx, 0);

	const { lines, size } = fitValue(
		ctx,
		word.value,
		w - 40,
		84,
		48,
		fonts.display
	);
	ctx.font = `italic 500 ${size}px ${fonts.display}`;
	const lineH = size * 0.95;
	lines.forEach((line, i) => {
		ctx.fillText(line, 0, (i - (lines.length - 1) / 2) * lineH + 2);
	});

	ctx.font = `400 24px ${fonts.body}`;
	ctx.fillText(word.caption, 0, 64);
	ctx.restore();
}

const WORD_CARD_PALETTES = [
	{ bg: CARD_COLORS.orange, ink: CARD_COLORS.ink, tilt: -2 },
	{ bg: CARD_COLORS.yellow, ink: CARD_COLORS.blueDeep, tilt: 1.5 },
	{ bg: CARD_COLORS.cream, ink: CARD_COLORS.blueDeep, tilt: -1.5 },
];

/** Draw the share card into a 1080×1920 context. Callers size the canvas. */
export async function drawWrappedCard(
	ctx: CanvasRenderingContext2D,
	summary: WrappedSummary
): Promise<void> {
	const fonts = cardFontStacks();
	const { display, body } = fonts;
	await preloadFonts(display, body);

	ctx.fillStyle = CARD_COLORS.blue;
	ctx.fillRect(0, 0, CARD.w, CARD.h);

	// Background: the year repeated, tilted, faint.
	ctx.save();
	ctx.translate(CARD.w / 2, CARD.h / 2);
	ctx.rotate((-4 * Math.PI) / 180);
	ctx.fillStyle = CARD_COLORS.pattern;
	ctx.font = `700 120px ${body}`;
	ctx.textAlign = "center";
	ctx.textBaseline = "alphabetic";
	const yearRow = `${summary.year}·  `.repeat(5);
	for (let y = -CARD.h / 2 - 60; y < CARD.h / 2 + 120; y += 96) {
		ctx.fillText(yearRow, 0, y);
	}
	ctx.restore();

	drawRibbon(ctx, body, 40, 108);

	ctx.textAlign = "center";
	ctx.textBaseline = "alphabetic";

	ctx.fillStyle = CARD_COLORS.cream;
	setTracking(ctx, 8);
	ctx.font = `500 40px ${body}`;
	ctx.fillText("ГОД У СЛОВАХ", CARD.w / 2, 272);
	setTracking(ctx, 0);

	ctx.fillStyle = CARD_COLORS.yellow;
	ctx.font = `italic 500 230px ${display}`;
	ctx.fillText(String(summary.year), CARD.w / 2, 470);

	// Burst with its offset shadow, holding the active-day count.
	fillBurst(ctx, 274, 529, 580, CARD_COLORS.orange);
	fillBurst(ctx, 250, 505, 580, CARD_COLORS.yellow);
	const days = summary.activeDays.length;
	const burstCx = 250 + 290;
	ctx.fillStyle = CARD_COLORS.blueDeep;
	const daysSize = fitText(ctx, String(days), 420, 230, display);
	ctx.font = `500 ${daysSize}px ${display}`;
	ctx.fillText(String(days), burstCx, 505 + 330);
	ctx.fillStyle = CARD_COLORS.ink;
	ctx.font = `italic 400 42px ${body}`;
	ctx.fillText(`${pluralize(days, "дзень")} са словамі`, burstCx, 505 + 400);

	const words = shareWords(summary);
	if (words.length > 0) {
		ctx.fillStyle = CARD_COLORS.cream;
		setTracking(ctx, 6);
		ctx.font = `500 30px ${body}`;
		ctx.fillText("МАЕ СЛОВЫ ГОДА", CARD.w / 2, 1158);
		setTracking(ctx, 0);

		const total = words.length * 300 + (words.length - 1) * 30;
		let x = (CARD.w - total) / 2;
		words.forEach((word, i) => {
			drawWordCard(ctx, word, x, WORD_CARD_PALETTES[i % 3], fonts);
			x += 330;
		});
	}

	// Longest streak over the year's heatmap.
	ctx.save();
	ctx.translate(60 + 480, 1420 + 120);
	ctx.rotate((-1 * Math.PI) / 180);
	ctx.fillStyle = CARD_COLORS.blueDeep;
	ctx.fillRect(-480 + 14, -120 + 14, 960, 240);
	ctx.fillStyle = CARD_COLORS.cream;
	ctx.fillRect(-480, -120, 960, 240);

	ctx.fillStyle = CARD_COLORS.blueDeep;
	ctx.textBaseline = "alphabetic";
	ctx.textAlign = "left";
	setTracking(ctx, 5.2);
	ctx.font = `500 26px ${body}`;
	ctx.fillText("НАЙДАЎЖЭЙШАЯ СЕРЫЯ", -452, -50);
	setTracking(ctx, 0);
	ctx.textAlign = "right";
	const streak = summary.longestStreakAnyGame;
	ctx.font = `500 60px ${display}`;
	ctx.fillText(`${streak} ${pluralize(streak, "дзень")}`, 452, -46);

	const cells = yearHeatCells(summary.year, summary.gamesPerDay);
	const cell = 14;
	const step = cell + 3;
	const cols = Math.ceil(cells.length / 7);
	const gridX = -((cols * step - 3) / 2);
	const gridY = -14;
	cells.forEach((level, i) => {
		if (level === null) return;
		const x = gridX + Math.floor(i / 7) * step;
		const y = gridY + (i % 7) * step;
		ctx.fillStyle = CARD_COLORS.heat[level];
		if (typeof ctx.roundRect !== "function") {
			ctx.fillRect(x, y, cell, cell);
			return;
		}
		ctx.beginPath();
		ctx.roundRect(x, y, cell, cell, 3);
		ctx.fill();
	});
	ctx.restore();

	ctx.textAlign = "center";
	ctx.textBaseline = "alphabetic";
	ctx.fillStyle = CARD_COLORS.cream;
	ctx.font = `400 44px ${body}`;
	ctx.fillText("slovy.games", CARD.w / 2, 1740);

	drawRibbon(ctx, body, 1800, 220);
}

/** Render the card off-screen and return it as a PNG blob. */
export async function renderWrappedCardBlob(
	summary: WrappedSummary
): Promise<Blob> {
	const canvas = document.createElement("canvas");
	canvas.width = CARD.w;
	canvas.height = CARD.h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("canvas 2d context unavailable");

	await drawWrappedCard(ctx, summary);

	return new Promise<Blob>((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (blob) resolve(blob);
			else reject(new Error("canvas toBlob failed"));
		}, "image/png");
	});
}
