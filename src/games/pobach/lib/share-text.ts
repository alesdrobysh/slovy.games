import type { Guess } from "@/games/pobach/types";
import { POBACH_EPOCH_DATE as EPOCH_DATE } from "@/shared/config";
import { pluralize } from "@/shared/lib/pluralize";
import { dateForDayIndex } from "@/shared/lib/timezone";

export interface ShareTextInput {
	dayIndex: number;
	guesses: Guess[];
	won: boolean;
}

export function generateShareText({
	dayIndex,
	guesses,
	won,
}: ShareTextInput): string {
	const date = dateForDayIndex(EPOCH_DATE, dayIndex);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	const formattedDate = `${day}.${month}.${year}`;

	const colorGroups = [
		{ emoji: "🟩", count: 0 },
		{ emoji: "🟧", count: 0 },
		{ emoji: "🟦", count: 0 },
	];

	for (const guess of guesses) {
		if (guess.rank <= 100) colorGroups[0].count++;
		else if (guess.rank <= 1000) colorGroups[1].count++;
		else colorGroups[2].count++;
	}

	const maxGroupCount = Math.max(...colorGroups.map((g) => g.count));
	const emojiLines = colorGroups
		.filter((group) => group.count > 0)
		.map((group) => {
			const scaledCount = Math.max(
				1,
				Math.round((group.count / maxGroupCount) * 10)
			);
			const emojiCount = Math.min(scaledCount, group.count, 10);
			return `${group.emoji.repeat(emojiCount)} ${group.count}`;
		})
		.join("\n");

	const guessCount = guesses.length;
	const hintsCount = guesses.filter((g) => g.isHint).length;
	const hintsText =
		hintsCount > 0
			? ` (з ${hintsCount} ${pluralize(hintsCount, "падказка", "instrumental")})`
			: "";
	const status = won
		? `Адгадана за ${guessCount} ${pluralize(guessCount, "спроба", "accusative")}${hintsText}`
		: `Не адгадана пасля ${guessCount} ${pluralize(guessCount, "спроба", "genitive")}${hintsText}`;

	return `Побач ${formattedDate}\n${status}\n${emojiLines}\nslovy.games`;
}
