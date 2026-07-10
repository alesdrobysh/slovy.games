"use client";

import { useEffect, useState } from "react";
import type { GameCardStatus } from "@/shared/components/GameCard";
import { POBACH_EPOCH_DATE, VALOSHKA_EPOCH_DATE } from "@/shared/config";
import { dictReady, pluralize } from "@/shared/lib/pluralize";
import { getMskDateString, getMskDayIndex } from "@/shared/lib/timezone";
import type { GameInfo } from "@/shared/types";

/** Per-game status extracted from localStorage */
export interface GameHubStatus {
	/** The game this status is for */
	gameId: string;
	/** Game play state */
	status: GameCardStatus;
	/** Human-readable progress line, e.g. "12 слоў знойдзена" — empty if no progress */
	progressText: string;
}

/** Aggregated hub state for both games */
export interface HubState {
	/** Formatted today's date in Belarusian, e.g. "Пятніца, 8 траўня 2026" */
	todayLabel: string;
	/** Per-game status, keyed by game id */
	statuses: Map<string, GameHubStatus>;
	/** Highest current streak across both games */
	currentStreak: number;
	/** Highest all-time streak across both games */
	longestStreak: number;
	/** Total games played (completed) across both games */
	totalPlayed: number;
}

/** Today as YYYY-MM-DD string in MSK (consistent with puzzle dates and progress keys) */
function todayString(): string {
	return getMskDateString();
}

const MONTHS_GEN = [
	"студзеня",
	"лютага",
	"сакавіка",
	"красавіка",
	"траўня",
	"чэрвеня",
	"ліпеня",
	"жніўня",
	"верасня",
	"кастрычніка",
	"лістапада",
	"снежня",
];
const WEEKDAYS_BE = [
	"Нядзеля",
	"Панядзелак",
	"Аўторак",
	"Серада",
	"Чацвер",
	"Пятніца",
	"Субота",
];

/** Format today as Belarusian, e.g. "Пятніца, 8 траўня" */
function formatTodayBe(): string {
	const d = new Date();
	return `${WEEKDAYS_BE[d.getDay()]}, ${d.getDate()} ${MONTHS_GEN[d.getMonth()]}`;
}

// ─── Valoshka state ────────────────────────────────────────────────

/** Drop per-day progress and stats entries dated before the current
 *  epoch — these belonged to puzzles that no longer exist after an
 *  epoch shift and would otherwise linger as unreachable localStorage
 *  entries and skew stats. Idempotent: no-op once cleaned. */
function purgePreEpochValoshkaProgress(): void {
	const epoch = VALOSHKA_EPOCH_DATE.slice(0, 10);
	try {
		const staleKeys: string[] = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (!key || key === "vulej_stats" || !key.startsWith("vulej_")) continue;
			const date = key.slice("vulej_".length);
			if (date < epoch) staleKeys.push(key);
		}
		for (const key of staleKeys) localStorage.removeItem(key);

		const statsRaw = localStorage.getItem("vulej_stats");
		if (!statsRaw) return;
		const stats = JSON.parse(statsRaw);
		if (!Array.isArray(stats.datesPlayed)) return;
		const keptDates = stats.datesPlayed.filter((d: string) => d >= epoch);
		if (keptDates.length === stats.datesPlayed.length) return;

		const perDateBest: Record<string, { rankIdx: number; foundCount: number }> =
			{};
		let totalWordsFound = 0;
		let topRankCount = 0;
		for (const d of keptDates) {
			const entry = stats.perDateBest?.[d];
			if (!entry) continue;
			perDateBest[d] = entry;
			totalWordsFound += entry.foundCount ?? 0;
			if (entry.rankIdx === 8) topRankCount += 1;
		}
		localStorage.setItem(
			"vulej_stats",
			JSON.stringify({
				...stats,
				datesPlayed: keptDates,
				perDateBest,
				totalWordsFound,
				topRankCount,
				currentStreak: 0,
			})
		);
	} catch {
		// localStorage unavailable or corrupted
	}
}

function getValoshkaStatus(): {
	hasPlayedToday: boolean;
	foundWords: number;
	score: number;
	streak: number;
	longestStreak: number;
	totalPlayed: number;
	vasiliokReached: boolean;
} {
	const today = todayString();
	let hasPlayedToday = false;
	let foundWords = 0;
	let score = 0;
	let streak = 0;
	let longestStreak = 0;
	let totalPlayed = 0;
	let vasiliokReached = false;

	purgePreEpochValoshkaProgress();

	try {
		const raw = localStorage.getItem(`vulej_${today}`);
		if (raw) {
			const progress = JSON.parse(raw);
			hasPlayedToday = !!(
				progress.foundWords && progress.foundWords.length > 0
			);
			foundWords = progress.foundWords?.length ?? 0;
			score = progress.score ?? 0;
			vasiliokReached = progress.vasiliokReached ?? false;
		}

		const statsRaw = localStorage.getItem("vulej_stats");
		if (statsRaw) {
			const stats = JSON.parse(statsRaw);
			streak = stats.currentStreak ?? 0;
			longestStreak = stats.longestStreak ?? 0;
			totalPlayed = stats.datesPlayed?.length ?? 0;
		}
	} catch {
		// localStorage unavailable or corrupted
	}

	return {
		hasPlayedToday,
		foundWords,
		score,
		streak,
		longestStreak,
		totalPlayed,
		vasiliokReached,
	};
}

// ─── Pobach state ──────────────────────────────────────────────────

function pobachTodayIndex(): number {
	return getMskDayIndex(POBACH_EPOCH_DATE);
}

function getPobachStatus(): {
	hasPlayedToday: boolean;
	isInProgress: boolean;
	won: boolean;
	attempts: number;
	streak: number;
	longestStreak: number;
	totalPlayed: number;
	guessCount: number;
} {
	let hasPlayedToday = false;
	let isInProgress = false;
	let won = false;
	let attempts = 0;
	let streak = 0;
	let longestStreak = 0;
	let totalPlayed = 0;
	let guessCount = 0;

	try {
		const raw = localStorage.getItem("pobach_storage");
		if (!raw)
			return {
				hasPlayedToday,
				isInProgress,
				won,
				attempts,
				streak,
				longestStreak,
				totalPlayed,
				guessCount,
			};

		const data = JSON.parse(raw);
		if (data.version !== 2)
			return {
				hasPlayedToday,
				isInProgress,
				won,
				attempts,
				streak,
				longestStreak,
				totalPlayed,
				guessCount,
			};

		const todayIdx = pobachTodayIndex();

		// Check if there's an active current game for *today*
		if (data.currentGame && data.currentGame.dayIndex === todayIdx) {
			if (data.currentGame.won) {
				won = true;
				hasPlayedToday = true;
			} else if (!data.currentGame.gameOver) {
				isInProgress = true;
				guessCount = data.currentGame.guesses?.length ?? 0;
			}
		}

		// Also check history for today (fallback for won games where
		// currentGame was cleared)
		if (data.history) {
			const todayKey = String(todayIdx);
			const todayRecord = data.history[todayKey];
			if (todayRecord?.won) {
				hasPlayedToday = true;
				won = true;
				attempts = todayRecord.attempts;
			}
		}

		if (data.stats) {
			streak = data.stats.currentStreak ?? 0;
			longestStreak = data.stats.maxStreak ?? 0;
			totalPlayed = data.stats.gamesPlayed ?? 0;
		}
	} catch {
		// corrupted data
	}

	return {
		hasPlayedToday,
		isInProgress,
		won,
		attempts,
		streak,
		longestStreak,
		totalPlayed,
		guessCount,
	};
}

// ─── Sakretna state ─────────────────────────────────────────────────

function getSakretnaStatus(): {
	hasPlayedToday: boolean;
	guessCount: number;
	foundLemmas: number;
	won: boolean;
	givenUp: boolean;
	streak: number;
	longestStreak: number;
	totalPlayed: number;
	hintsUsed: number;
} {
	const today = todayString();
	let hasPlayedToday = false;
	let guessCount = 0;
	let foundLemmas = 0;
	let won = false;
	let givenUp = false;
	let hintsUsed = 0;
	let streak = 0;
	let longestStreak = 0;
	let totalPlayed = 0;

	try {
		const raw = localStorage.getItem(`sakretna_${today}`);
		if (raw) {
			const progress = JSON.parse(raw);
			hasPlayedToday = true;
			guessCount = progress.guesses?.length ?? 0;
			foundLemmas = progress.foundLemmas?.length ?? 0;
			won = !!progress.won;
			givenUp = !!progress.givenUp;
			hintsUsed = progress.hintsUsed ?? 0;
		}
		const statsRaw = localStorage.getItem("sakretna_stats");
		if (statsRaw) {
			const stats = JSON.parse(statsRaw);
			streak = stats.currentStreak ?? 0;
			longestStreak = stats.longestStreak ?? 0;
			totalPlayed = stats.datesPlayed?.length ?? 0;
		}
	} catch {
		// localStorage unavailable or corrupted
	}

	return {
		hasPlayedToday,
		guessCount,
		foundLemmas,
		won,
		givenUp,
		streak,
		longestStreak,
		totalPlayed,
		hintsUsed,
	};
}

// ─── Build game status from pre-read raw data ──────────────────────
function buildGameStatusFromRaw(
	game: GameInfo,
	v: ReturnType<typeof getValoshkaStatus>,
	p: ReturnType<typeof getPobachStatus>,
	r: ReturnType<typeof getSakretnaStatus>
): GameHubStatus {
	if (game.id === "valoshka") {
		if (v.vasiliokReached) {
			return {
				gameId: "valoshka",
				status: "won",
				progressText: "Усе словы знойдзены",
			};
		}
		const inProgress = v.hasPlayedToday && v.foundWords > 0;
		return {
			gameId: "valoshka",
			status: inProgress ? "in_progress" : "not_started",
			progressText: inProgress
				? `${v.foundWords} ${pluralize(v.foundWords, "слова")} знойдзена`
				: "Чакае вас",
		};
	}

	if (game.id === "sakretna") {
		if (r.won) {
			return {
				gameId: "sakretna",
				status: "won",
				progressText: "Здагадана",
			};
		}
		if (r.givenUp) {
			return {
				gameId: "sakretna",
				status: "given_up",
				progressText: "Здаліся",
			};
		}
		if (r.guessCount > 0) {
			return {
				gameId: "sakretna",
				status: "in_progress",
				progressText: `Расшыфравана ${r.foundLemmas} ${pluralize(r.foundLemmas, "слова")}`,
			};
		}
		return {
			gameId: "sakretna",
			status: "not_started",
			progressText: "Чакае вас",
		};
	}

	// Pobach
	let status: GameCardStatus = "not_started";
	let progressText = "Чакае вас";

	if (p.won) {
		status = "won";
		progressText =
			p.attempts > 0
				? `Разгадана за ${p.attempts} ${pluralize(p.attempts, "спроба", "accusative")}`
				: "Разгадана";
	} else if (p.isInProgress) {
		status = "in_progress";
		progressText =
			p.guessCount > 0
				? `Зроблена ${p.guessCount} ${pluralize(p.guessCount, "спроба")}`
				: "";
	}

	return { gameId: "pobach", status, progressText };
}

/** Read localStorage once and return the full hub state.
 *  Uses useState + useEffect to avoid hydration mismatch —
 *  always returns empty state on first render. */
export function useHubState(games: GameInfo[]): HubState {
	const [state, setState] = useState<HubState>(() => emptyHubState(games));

	useEffect(() => {
		// Read both stores once after mount
		function buildState(): HubState {
			const vs = getValoshkaStatus();
			const ps = getPobachStatus();
			const rs = getSakretnaStatus();

			// Aggregate
			let maxStreak = 0;
			let maxLongest = 0;
			if (vs.streak > maxStreak) maxStreak = vs.streak;
			if (vs.longestStreak > maxLongest) maxLongest = vs.longestStreak;
			if (ps.streak > maxStreak) maxStreak = ps.streak;
			if (ps.longestStreak > maxLongest) maxLongest = ps.longestStreak;
			if (rs.streak > maxStreak) maxStreak = rs.streak;
			if (rs.longestStreak > maxLongest) maxLongest = rs.longestStreak;
			const totalPlayed = vs.totalPlayed + ps.totalPlayed + rs.totalPlayed;

			// Build per-game statuses
			const statuses = new Map<string, GameHubStatus>();
			for (const game of games) {
				statuses.set(game.id, buildGameStatusFromRaw(game, vs, ps, rs));
			}

			return {
				todayLabel: formatTodayBe(),
				statuses,
				currentStreak: maxStreak,
				longestStreak: maxLongest,
				totalPlayed,
			};
		}

		setState(buildState());

		// The dictionary used by `pluralize` may still be loading when the
		// state above is first built, in which case progress text falls back
		// to unpluralized words — rebuild once it's ready to pick that up.
		let cancelled = false;
		dictReady.then(() => {
			if (!cancelled) setState(buildState());
		});
		return () => {
			cancelled = true;
		};
	}, [games]);

	return state;
}

function emptyHubState(games: GameInfo[]): HubState {
	const statuses = new Map<string, GameHubStatus>();
	for (const game of games) {
		statuses.set(game.id, {
			gameId: game.id,
			status: "not_started",
			progressText: "Чакае вас",
		});
	}
	return {
		todayLabel: "",
		statuses,
		currentStreak: 0,
		longestStreak: 0,
		totalPlayed: 0,
	};
}
