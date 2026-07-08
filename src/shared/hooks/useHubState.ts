"use client";

import { useEffect, useState } from "react";
import type { GameCardStatus } from "@/shared/components/GameCard";
import { POBACH_EPOCH_DATE } from "@/shared/config";
import { pluralize } from "@/shared/lib/pluralize";
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

// ─── Build game status from pre-read raw data ──────────────────────
function buildGameStatusFromRaw(
	game: GameInfo,
	v: ReturnType<typeof getValoshkaStatus>,
	p: ReturnType<typeof getPobachStatus>
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
				? `Зроблена ${p.guessCount} ${pluralize(p.guessCount, "спроба", "accusative")}`
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
		const vs = getValoshkaStatus();
		const ps = getPobachStatus();

		// Aggregate
		let maxStreak = 0;
		let maxLongest = 0;
		if (vs.streak > maxStreak) maxStreak = vs.streak;
		if (vs.longestStreak > maxLongest) maxLongest = vs.longestStreak;
		if (ps.streak > maxStreak) maxStreak = ps.streak;
		if (ps.longestStreak > maxLongest) maxLongest = ps.longestStreak;
		const totalPlayed = vs.totalPlayed + ps.totalPlayed;

		// Build per-game statuses
		const statuses = new Map<string, GameHubStatus>();
		for (const game of games) {
			statuses.set(game.id, buildGameStatusFromRaw(game, vs, ps));
		}

		setState({
			todayLabel: formatTodayBe(),
			statuses,
			currentStreak: maxStreak,
			longestStreak: maxLongest,
			totalPlayed,
		});
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
