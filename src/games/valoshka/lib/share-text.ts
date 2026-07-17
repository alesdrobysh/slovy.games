import { RANKS } from "@/games/valoshka/lib/scoring";

export interface ShareTextInput {
	date: string;
	rankName: string;
	rankIdx: number;
	score: number;
}

export function generateShareText({
	date,
	rankName,
	rankIdx,
	score,
}: ShareTextInput): string {
	const [y, m, d] = date.split("-");
	const dateStr = `${d}.${m}.${y}`;
	const visibleRanks = rankIdx < RANKS.length - 1 ? rankIdx + 1 : RANKS.length;
	const dots = Array.from({ length: visibleRanks }, (_, i) =>
		i <= rankIdx ? "🟡" : "⬜"
	).join("");
	return `Валошка ${dateStr}\nРанг: ${rankName} (${score} пт)\n${dots}\nslovy.games`;
}
