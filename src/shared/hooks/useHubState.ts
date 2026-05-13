"use client";

import { useEffect, useState } from "react";
import type { GameInfo } from "@/shared/types";

/** Per-game status extracted from localStorage */
export interface GameHubStatus {
	/** The game this status is for */
	gameId: string;
	/** User has completed today's puzzle */
	hasPlayedToday: boolean;
	/** User started but hasn't finished (only Pobach tracks this) */
	isInProgress: boolean;
	/** Human-readable progress line, e.g. "12 слоў знойдзена" — empty if no progress */
	progressText: string;
	/** What the action button should say */
	ctaLabel: string;
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

/** Today as YYYY-MM-DD string (same format both games use) */
function todayString(): string {
	return new Date().toISOString().slice(0, 10);
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
} {
	const today = todayString();
	let hasPlayedToday = false;
	let foundWords = 0;
	let score = 0;
	let streak = 0;
	let longestStreak = 0;
	let totalPlayed = 0;

	try {
		const raw = localStorage.getItem(`vulej_${today}`);
		if (raw) {
			const progress = JSON.parse(raw);
			hasPlayedToday = !!(
				progress.foundWords && progress.foundWords.length > 0
			);
			foundWords = progress.foundWords?.length ?? 0;
			score = progress.score ?? 0;
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
	};
}

// ─── Pobach state ──────────────────────────────────────────────────

/** Epoch used by Pobach day index calculation */
const POBACH_EPOCH = new Date("2026-01-15T00:00:00Z");

function pobachTodayIndex(): number {
	return Math.floor((Date.now() - POBACH_EPOCH.getTime()) / 86400000);
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
		let progressText = "";
		let ctaLabel = "Гуляць";

		if (v.hasPlayedToday && v.foundWords > 0) {
			progressText = `${v.foundWords} слоў знойдзена`;
			ctaLabel = "Працягнуць";
		}

		return {
			gameId: "valoshka",
			hasPlayedToday: v.hasPlayedToday,
			isInProgress: false,
			progressText,
			ctaLabel,
		};
	}

	// Pobach
	let progressText = "";
	let ctaLabel = "Гуляць";

	if (p.won) {
		progressText =
			p.attempts > 0 ? `Разгадана за ${p.attempts} спроб` : "Разгадана";
		ctaLabel = "Вынік";
	} else if (p.isInProgress) {
		progressText = p.guessCount > 0 ? `Здагадка №${p.guessCount + 1}` : "";
		ctaLabel = "Працягнуць";
	}

	return {
		gameId: "pobach",
		hasPlayedToday: p.hasPlayedToday,
		isInProgress: p.isInProgress,
		progressText,
		ctaLabel,
	};
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
			hasPlayedToday: false,
			isInProgress: false,
			progressText: "",
			ctaLabel: "Гуляць",
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
