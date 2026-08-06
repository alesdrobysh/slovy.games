import puzzlesData from "@/games/valoshka/data/puzzles.json";
import type { Puzzle } from "@/games/valoshka/types";
import { getGameDay } from "@/shared/lib/timezone";

export function getPuzzleForToday(): Puzzle {
	const puzzles = puzzlesData as Puzzle[];

	const dayIndex = getGameDay("valoshka");
	const idx = ((dayIndex % puzzles.length) + puzzles.length) % puzzles.length;
	return puzzles[idx];
}

export function getPuzzleForDate(date: string): Puzzle | null {
	const puzzles = puzzlesData as Puzzle[];
	return puzzles.find((p) => p.date === date) ?? null;
}
