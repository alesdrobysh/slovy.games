import puzzlesData from "@/games/valoshka/data/puzzles.json";
import type { Puzzle } from "@/games/valoshka/types";
import { getMskDayIndex } from "@/shared/lib/timezone";

const EPOCH = new Date("2026-03-18T00:00:00Z");

export function getPuzzleForToday(): Puzzle {
	const puzzles = puzzlesData as Puzzle[];

	const dayIndex = getMskDayIndex(EPOCH);
	const idx = ((dayIndex % puzzles.length) + puzzles.length) % puzzles.length;
	return puzzles[idx];
}

export function getPuzzleForDate(date: string): Puzzle | null {
	const puzzles = puzzlesData as Puzzle[];
	return puzzles.find((p) => p.date === date) ?? null;
}
