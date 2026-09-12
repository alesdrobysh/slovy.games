import type { WrappedSummary } from "@/shared/types/wrapped";

/** Story-format frame, 9:16. */
export const CARD = { w: 1080, h: 1920 } as const;

const MIN_FONT_PX = 24;

/** Card palette is fixed, independent of the viewer's site theme, so a
 *  light-mode player still shares a legible dark card. */
const CARD_COLORS = {
	bg: "#141210",
	bgAccent: "#252118",
	ink: "#e5e2d6",
	inkMuted: "#aba69c",
	accent: "#e07b35",
} as const;

/** The largest size at or below `startPx` at which `text` fits `maxWidth`,
 *  floored at a readable minimum. Mutates only `ctx.font`. */
export function fitText(
	ctx: Pick<CanvasRenderingContext2D, "measureText" | "font">,
	text: string,
	maxWidth: number,
	startPx: number,
	family: string,
	weight = 500
): number {
	if (!text) return startPx;
	let size = startPx;
	while (size > MIN_FONT_PX) {
		ctx.font = `${weight} ${size}px ${family}`;
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
		`500 160px ${display}`,
		`500 72px ${display}`,
		`400 44px ${body}`,
	];
	await Promise.all(
		specs.map((spec) => document.fonts.load(spec).catch(() => undefined))
	);
	await document.fonts.ready;
}

const MONTHS_NOM = [
	"Студзень",
	"Люты",
	"Сакавік",
	"Красавік",
	"Травень",
	"Чэрвень",
	"Ліпень",
	"Жнівень",
	"Верасень",
	"Кастрычнік",
	"Лістапад",
	"Снежань",
];

const GAME_NAMES: Record<string, string> = {
	pobach: "Побач",
	valoshka: "Валошка",
};

function cardRows(summary: WrappedSummary): Array<[string, string]> {
	const rows: Array<[string, string]> = [
		["Дзён у гульні", String(summary.activeDays.length)],
		["Гульняў скончана", String(summary.gamesFinished)],
		["Найдаўжэйшая серыя", String(summary.longestStreakAnyGame)],
	];
	if (summary.busiestMonth) {
		rows.push([
			"Самы актыўны месяц",
			MONTHS_NOM[summary.busiestMonth.month - 1],
		]);
	}
	if (summary.gameOfTheYear) {
		rows.push([
			"Гульня года",
			GAME_NAMES[summary.gameOfTheYear] ?? summary.gameOfTheYear,
		]);
	}
	return rows;
}

/** Draw the share card into a 1080×1920 context. Callers size the canvas. */
export async function drawWrappedCard(
	ctx: CanvasRenderingContext2D,
	summary: WrappedSummary
): Promise<void> {
	const { display, body } = cardFontStacks();
	await preloadFonts(display, body);

	const gradient = ctx.createLinearGradient(0, 0, 0, CARD.h);
	gradient.addColorStop(0, CARD_COLORS.bg);
	gradient.addColorStop(1, CARD_COLORS.bgAccent);
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, CARD.w, CARD.h);

	const margin = 96;
	const maxWidth = CARD.w - margin * 2;
	ctx.textAlign = "center";
	ctx.textBaseline = "alphabetic";

	ctx.fillStyle = CARD_COLORS.inkMuted;
	const overlineSize = fitText(ctx, "ГОД У СЛОВАХ", maxWidth, 44, body, 400);
	ctx.font = `400 ${overlineSize}px ${body}`;
	ctx.fillText("ГОД У СЛОВАХ", CARD.w / 2, 260);

	ctx.fillStyle = CARD_COLORS.accent;
	const yearText = String(summary.year);
	const yearSize = fitText(ctx, yearText, maxWidth, 280, display);
	ctx.font = `500 ${yearSize}px ${display}`;
	ctx.fillText(yearText, CARD.w / 2, 520);

	let y = 760;
	for (const [label, value] of cardRows(summary)) {
		ctx.fillStyle = CARD_COLORS.inkMuted;
		const labelSize = fitText(ctx, label, maxWidth, 44, body, 400);
		ctx.font = `400 ${labelSize}px ${body}`;
		ctx.fillText(label, CARD.w / 2, y);

		ctx.fillStyle = CARD_COLORS.ink;
		const valueSize = fitText(ctx, value, maxWidth, 96, display);
		ctx.font = `500 ${valueSize}px ${display}`;
		ctx.fillText(value, CARD.w / 2, y + 110);

		y += 210;
	}

	ctx.fillStyle = CARD_COLORS.inkMuted;
	const footSize = fitText(ctx, "slovy.games", maxWidth, 48, body, 400);
	ctx.font = `400 ${footSize}px ${body}`;
	ctx.fillText("slovy.games", CARD.w / 2, CARD.h - 140);
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
