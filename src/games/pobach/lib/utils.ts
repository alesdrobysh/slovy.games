import { pluralize as bel } from "@/shared/lib/pluralize";

export function pluralize(count: number): string {
	return bel(count, "спроба", "accusative");
}

export function pluralizeAttemptsNominative(count: number): string {
	return bel(count, "спроба");
}

export function pluralizeAttemptsGenitive(count: number): string {
	return bel(count, "спроба", "genitive");
}

export function pluralizeHintsAccusative(count: number): string {
	return bel(count, "падказка");
}

export function pluralizeStreak(count: number): string {
	return `${bel(count, "перамога")} запар`;
}

export function pluralizeHintsInstrumental(count: number): string {
	return bel(count, "падказка", "instrumental");
}

export function validateDayIndex(
	dayIndex: number | undefined,
	currentDayIndex: number
): boolean {
	return (
		dayIndex === undefined || (dayIndex >= 0 && dayIndex <= currentDayIndex)
	);
}
