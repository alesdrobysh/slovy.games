import type { GameId } from "@/shared/config";
import { GAMES } from "@/shared/types";

export const MONTHS_NOM = [
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

/** Calendar labels for narrow screens, where a full name outgrows its
 *  month's column. */
export const MONTHS_SHORT = [
	"Студз",
	"Лют",
	"Сак",
	"Крас",
	"Трав",
	"Чэрв",
	"Ліп",
	"Жнів",
	"Вер",
	"Кастр",
	"Ліст",
	"Снеж",
];

/** "14 сакавіка" */
const MONTHS_GEN = [
	"студзеня",
	"лютага",
	"сакавіка",
	"красавіка",
	"траўня",
	"чэрвеня",
	"ліпеня",
	"жніўня",
	"верасня",
	"кастрычніка",
	"лістапада",
	"снежня",
];

/** "у ліпені" */
export const MONTHS_LOC = [
	"студзені",
	"лютым",
	"сакавіку",
	"красавіку",
	"траўні",
	"чэрвені",
	"ліпені",
	"жніўні",
	"верасні",
	"кастрычніку",
	"лістападзе",
	"снежні",
];

export function gameName(id: GameId): string {
	return GAMES.find((g) => g.id === id)?.nameBel ?? id;
}

/** `YYYY-MM-DD` → "14 сакавіка". */
export function formatDayMonth(date: string): string {
	const month = Number(date.slice(5, 7));
	const day = Number(date.slice(8, 10));
	return `${day} ${MONTHS_GEN[month - 1] ?? ""}`.trim();
}

/** Pick the form that agrees with `n`: one (1, 21), few (2–4, 22–24) or
 *  many (5–20, 25…). For words `pluralize` cannot inflect, like the
 *  short participles in "слоў адгадана" / "словы адгаданы". */
export function agree(n: number, one: string, few: string, many: string) {
	const mod10 = n % 10;
	const mod100 = n % 100;
	if (mod10 === 1 && mod100 !== 11) return one;
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
	return many;
}
