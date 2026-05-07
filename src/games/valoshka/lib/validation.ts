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
	too_short: "Занадта кароткае слова",
	missing_center: "Патрэбна цэнтральная літара",
	not_in_list: "Не ў слоўніку",
	already_found: "Ужо знойдзена",
};
