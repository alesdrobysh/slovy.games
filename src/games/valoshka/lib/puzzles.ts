import puzzlesData from "@/games/valoshka/data/puzzles.json";
import type { Puzzle } from "@/games/valoshka/types";

const EPOCH = new Date("2026-03-18T00:00:00Z");

export function getPuzzleForToday(): Puzzle {
	const puzzles = puzzlesData as Puzzle[];

	const todayUTC = new Date(
		`${new Date().toISOString().slice(0, 10)}T00:00:00Z`
	);
	const dayIndex = Math.floor(
		(todayUTC.getTime() - EPOCH.getTime()) / 86400000
	);
	const idx = ((dayIndex % puzzles.length) + puzzles.length) % puzzles.length;
	return puzzles[idx];
}

export function getPuzzleForDate(date: string): Puzzle | null {
	const puzzles = puzzlesData as Puzzle[];
	return puzzles.find((p) => p.date === date) ?? null;
}
