import {
	getMskDateString,
	getMskYesterdayDateString,
} from "@/shared/lib/timezone";
import type { GameStats, SavedProgress } from "../types";

const STORAGE_KEY = (date: string) => `sakretna_${date}`;
export const STATS_KEY = "sakretna_stats";

export const DEFAULT_STATS: GameStats = {
	datesPlayed: [],
	datesWon: [],
	currentStreak: 0,
	longestStreak: 0,
	totalPlayed: 0,
	totalWins: 0,
	hintsUsedCount: 0,
	winsByAttempts: [],
};

export function loadProgress(date: string): SavedProgress | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY(date));
		if (!raw) return null;
		const parsed = JSON.parse(raw) as SavedProgress;
		if (parsed.date !== date) return null;
		return parsed;
	} catch {
		return null;
	}
}

export function saveProgress(progress: SavedProgress): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY(progress.date), JSON.stringify(progress));
	} catch {
		// localStorage may be unavailable
	}
}

export function loadStats(): GameStats {
	if (typeof window === "undefined") return { ...DEFAULT_STATS };
	try {
		const raw = localStorage.getItem(STATS_KEY);
		if (!raw) return { ...DEFAULT_STATS };
		const parsed = JSON.parse(raw) as Partial<GameStats>;
		return {
			...DEFAULT_STATS,
			...parsed,
			datesWon: parsed.datesWon ?? [],
		};
	} catch {
		return { ...DEFAULT_STATS };
	}
}

export function saveStats(stats: GameStats): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STATS_KEY, JSON.stringify(stats));
	} catch {
		// localStorage may be unavailable
	}
}

/** Persist a day's progress and update aggregate stats. */
export function recordResult(progress: SavedProgress): void {
	if (typeof window === "undefined") return;
	saveProgress(progress);
	const stats = loadStats();
	const isFirstForDate = !stats.datesPlayed.includes(progress.date);

	if (isFirstForDate) {
		stats.datesPlayed.push(progress.date);
		stats.datesPlayed.sort();
		stats.hintsUsedCount += progress.hintsUsed;

		if (progress.won) {
			stats.totalWins += 1;
			stats.datesWon.push(progress.date);
			stats.datesWon.sort();
			const attemptCount = progress.guesses.length;
			while (stats.winsByAttempts.length < attemptCount) {
				stats.winsByAttempts.push(0);
			}
			stats.winsByAttempts[attemptCount - 1] += 1;
		}
	}

	stats.totalPlayed = stats.datesPlayed.length;

	const sortedWins = [...stats.datesWon].sort();
	let longest = 0;
	let run = sortedWins.length > 0 ? 1 : 0;
	for (let i = 1; i < sortedWins.length; i++) {
		const prev = new Date(`${sortedWins[i - 1]}T00:00:00Z`).getTime();
		const curr = new Date(`${sortedWins[i]}T00:00:00Z`).getTime();
		const diff = (curr - prev) / 86400000;
		if (diff === 1) {
			run += 1;
		} else {
			if (run > longest) longest = run;
			run = 1;
		}
	}
	if (run > longest) longest = run;

	const today = getMskDateString();
	const yesterday = getMskYesterdayDateString();
	const lastPlayed = stats.datesPlayed[stats.datesPlayed.length - 1];
	const latestWasWin = lastPlayed ? stats.datesWon.includes(lastPlayed) : false;
	const current =
		latestWasWin && (lastPlayed === today || lastPlayed === yesterday)
			? run
			: 0;

	stats.currentStreak = current;
	stats.longestStreak = Math.max(longest, stats.longestStreak);

	saveStats(stats);
}

export function getYesterdayDateString(): string {
	return getMskYesterdayDateString();
}
