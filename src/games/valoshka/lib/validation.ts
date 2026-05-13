import type { ValidationError } from "@/games/valoshka/types";

export function validateWord(
	word: string,
	center: string,
	answers: string[],
	foundWords: string[]
): ValidationError | null {
	if (word.length < 4) return "too_short";
	if (!word.includes(center)) return "missing_center";
	if (!answers.includes(word)) return "not_in_list";
	if (foundWords.includes(word)) return "already_found";
	return null;
}

export const ERROR_MESSAGES: Record<ValidationError, string> = {
	too_short: "Мінімум 4 літары",
	missing_center: "У слове павінна быць цэнтральная літара",
	not_in_list: "Гэтага слова няма ў сённяшнім спісе",
	already_found: "Вы ўжо знайшлі гэта слова",
};
