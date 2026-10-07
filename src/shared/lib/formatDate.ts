import { getMskDateString } from "@/shared/lib/timezone";

const MONTHS = [
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

const WEEKDAYS = ["нд", "пн", "аў", "ср", "чц", "пт", "сб"];

/** "2026-10-02" → "пт, 2 кастрычніка" */
export function formatDateBel(isoDate: string): string {
	const d = new Date(`${isoDate}T00:00:00Z`);
	return `${WEEKDAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

/** Today's puzzle day (Minsk time), formatted for the masthead. */
export function formatToday(): string {
	return formatDateBel(getMskDateString());
}
