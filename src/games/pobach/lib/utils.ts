const pr = new Intl.PluralRules("be-BY");

/**
 * Generic pluralization helper using standard Intl.PluralRules
 */
export function pluralizeForm(
	count: number,
	forms: { one: string; few: string; many: string }
): string {
	const rule = pr.select(count);
	return forms[rule] || forms.many;
}

/**
 * Returns the correct Belarusian plural form for "спроба" (attempt) in Accusative case
 * Used for "за 5 спроб"
 */
export function pluralize(count: number): string {
	return pluralizeForm(count, {
		one: "спробу",
		few: "спробы",
		many: "спроб",
	});
}

/**
 * Returns the correct Belarusian plural form for "спроба" (attempt) in Nominative case
 * Used for "Лепшы вынік: 1 спроба"
 */
export function pluralizeAttemptsNominative(count: number): string {
	return pluralizeForm(count, {
		one: "спроба",
		few: "спробы",
		many: "спроб",
	});
}

/**
 * Returns the correct Belarusian plural form for "спроба" (attempt) in Genitive case
 * Used for "пасля 5 спроб"
 */
export function pluralizeAttemptsGenitive(count: number): string {
	return pluralizeForm(count, {
		one: "спробы",
		few: "спроб",
		many: "спроб",
	});
}

/**
 * Returns the correct Belarusian plural form for "падказка" (hint)
 */
export function pluralizeHintsAccusative(count: number): string {
	return pluralizeForm(count, {
		one: "падказка",
		few: "падказкі",
		many: "падказак",
	});
}

/**
 * Returns the correct Belarusian plural form for "перамога запар" (win streak)
 */
export function pluralizeStreak(count: number): string {
	return pluralizeForm(count, {
		one: "перамога запар",
		few: "перамогі запар",
		many: "перамог запар",
	});
}

/**
 * Returns the correct Belarusian plural form for "падказка" (hint) in Instrumental case
 */
export function pluralizeHintsInstrumental(count: number): string {
	return pluralizeForm(count, {
		one: "падказкай",
		few: "падказкамі",
		many: "падказкамі",
	});
}

/**
 * Validates dayIndex parameter for API routes
 * Allows dayIndex from 0 to currentDayIndex (prevents future access)
 */
export function validateDayIndex(
	dayIndex: number | undefined,
	currentDayIndex: number
): boolean {
	return (
		dayIndex === undefined || (dayIndex >= 0 && dayIndex <= currentDayIndex)
	);
}
