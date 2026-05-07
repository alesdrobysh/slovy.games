/**
 * Returns the correct Belarusian plural form for "спроба" (attempt)
 */
export function pluralize(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) return "спробу";
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100))
    return "спробы";
  return "спроб";
}

/**
 * Returns the correct Belarusian plural form for "падказка" (hint)
 */
export function pluralizeHintsAccusative(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) return "падказка";
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100))
    return "падказкі";
  return "падказак";
}

/**
 * Returns the correct Belarusian plural form for "перамога запар" (win streak)
 */
export function pluralizeStreak(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) return "перамога запар";
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100))
    return "перамогі запар";
  return "перамог запар";
}

export function pluralizeHintsInstrumental(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) return "падказкай";
  return "падказкамі";
}

/**
 * Validates dayIndex parameter for API routes
 * Allows dayIndex from 0 to currentDayIndex (prevents future access)
 */
export function validateDayIndex(
  dayIndex: number | undefined,
  currentDayIndex: number,
): boolean {
  return (
    dayIndex === undefined || (dayIndex >= 0 && dayIndex <= currentDayIndex)
  );
}
