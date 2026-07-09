export function validateDayIndex(
	dayIndex: number | undefined,
	currentDayIndex: number
): boolean {
	return (
		dayIndex === undefined || (dayIndex >= 0 && dayIndex <= currentDayIndex)
	);
}
