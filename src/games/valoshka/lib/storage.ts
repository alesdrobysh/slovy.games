import type { GameStats, SavedProgress } from "@/games/valoshka/types";
import { VALOSHKA_EPOCH_DATE } from "@/shared/config";
import {
	getMskDateString,
	getMskYesterdayDateString,
} from "@/shared/lib/timezone";

const STORAGE_PREFIX = "vulej_";
const storageKey = (date: string) => `${STORAGE_PREFIX}${date}`;
const STATS_KEY = "vulej_stats";

export function loadProgress(date: string): SavedProgress | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(storageKey(date));
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
		localStorage.setItem(storageKey(progress.date), JSON.stringify(progress));
	} catch {
		// localStorage may be unavailable
	}
}

export function getYesterdayDateString(): string {
	return getMskYesterdayDateString();
}

export const DEFAULT_STATS: GameStats = {
	datesPlayed: [],
	currentStreak: 0,
	longestStreak: 0,
	topRankCount: 0,
	totalWordsFound: 0,
	perDateBest: {},
};

export function loadStats(): GameStats {
	if (typeof window === "undefined") return { ...DEFAULT_STATS };
	try {
		const raw = localStorage.getItem(STATS_KEY);
		if (!raw) return { ...DEFAULT_STATS };
		return JSON.parse(raw) as GameStats;
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

/** Drop per-day progress and stats entries dated before the current
 *  epoch — these belonged to puzzles that no longer exist after an
 *  epoch shift and would otherwise linger as unreachable localStorage
 *  entries and skew stats. Idempotent: no-op once cleaned. */
export function purgeStalePreEpochProgress(): void {
	if (typeof window === "undefined") return;
	const epoch = VALOSHKA_EPOCH_DATE.slice(0, 10);
	try {
		const staleKeys: string[] = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (!key || key === STATS_KEY || !key.startsWith(STORAGE_PREFIX))
				continue;
			const date = key.slice(STORAGE_PREFIX.length);
			if (date < epoch) staleKeys.push(key);
		}
		for (const key of staleKeys) localStorage.removeItem(key);

		const stats = loadStats();
		const keptDates = stats.datesPlayed.filter((d) => d >= epoch);
		if (keptDates.length === stats.datesPlayed.length) return;

		const perDateBest: GameStats["perDateBest"] = {};
		let totalWordsFound = 0;
		let topRankCount = 0;
		for (const d of keptDates) {
			const entry = stats.perDateBest[d];
			if (!entry) continue;
			perDateBest[d] = entry;
			totalWordsFound += entry.foundCount ?? 0;
			if (entry.rankIdx === 8) topRankCount += 1;
		}
		saveStats({
			...stats,
			datesPlayed: keptDates,
			perDateBest,
			totalWordsFound,
			topRankCount,
			currentStreak: 0,
		});
	} catch {
		// localStorage unavailable or corrupted
	}
}

export function updateStatsForDate(
	date: string,
	rankIdx: number,
	foundCount: number
): void {
	if (typeof window === "undefined") return;
	const stats = loadStats();

	// Only upgrade per-date best
	const prev = stats.perDateBest[date];
	if (prev && prev.rankIdx >= rankIdx && prev.foundCount >= foundCount) return;

	const isNew = !prev;
	stats.perDateBest[date] = { rankIdx, foundCount };

	if (isNew) {
		if (!stats.datesPlayed.includes(date)) {
			stats.datesPlayed.push(date);
			stats.datesPlayed.sort();
		}
	}
	if (!prev) {
		stats.totalWordsFound += foundCount;
		if (rankIdx === 8) stats.topRankCount += 1;
	} else {
		stats.totalWordsFound += Math.max(0, foundCount - prev.foundCount);
		if (prev.rankIdx < 8 && rankIdx === 8) stats.topRankCount += 1;
	}

	// Recompute streaks
	const sorted = [...stats.datesPlayed].sort();
	let current = 0;
	let longest = 0;
	let streak = 1;
	for (let i = 1; i < sorted.length; i++) {
		const prev = new Date(`${sorted[i - 1]}T00:00:00Z`);
		const curr = new Date(`${sorted[i]}T00:00:00Z`);
		const diff = (curr.getTime() - prev.getTime()) / 86400000;
		if (diff === 1) {
			streak += 1;
		} else {
			if (streak > longest) longest = streak;
			streak = 1;
		}
	}
	if (streak > longest) longest = streak;

	// Check if streak is current (last played date was today or yesterday in MSK)
	const today = getMskDateString();
	const yesterday = getYesterdayDateString();
	const lastPlayed = sorted[sorted.length - 1];
	if (lastPlayed === today || lastPlayed === yesterday) {
		current = streak;
	} else {
		current = 0;
	}

	stats.currentStreak = current;
	stats.longestStreak = Math.max(longest, stats.longestStreak);

	saveStats(stats);
}
