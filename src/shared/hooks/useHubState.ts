"use client";

import { useEffect, useState } from "react";
import { getHubStatus as getPobachHubStatus } from "@/games/pobach/lib/hub-status";
import { getHubStatus as getSakretnaHubStatus } from "@/games/sakretna/lib/hub-status";
import { getHubStatus as getValoshkaHubStatus } from "@/games/valoshka/lib/hub-status";
import { dictReady } from "@/shared/lib/pluralize";
import type { GameHubStatus, GameInfo } from "@/shared/types";

/** Aggregated hub state for all games */
export interface HubState {
	/** Formatted today's date in Belarusian, e.g. "Пятніца, 8 траўня 2026" */
	todayLabel: string;
	/** Per-game status, keyed by game id */
	statuses: Map<string, GameHubStatus>;
	/** Highest current streak across all games */
	currentStreak: number;
	/** Highest all-time streak across all games */
	longestStreak: number;
	/** Total games played (completed) across all games */
	totalPlayed: number;
}

/** Each game owns its storage schema and reports status through this
 *  registry, so the hub never has to parse another game's localStorage. */
const HUB_STATUS_PROVIDERS: Record<string, () => GameHubStatus> = {
	pobach: getPobachHubStatus,
	valoshka: getValoshkaHubStatus,
	sakretna: getSakretnaHubStatus,
};

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

function defaultStatus(gameId: string): GameHubStatus {
	return {
		gameId,
		status: "not_started",
		progressText: "Чакае вас",
		currentStreak: 0,
		longestStreak: 0,
		totalPlayed: 0,
	};
}

/** Read localStorage once and return the full hub state.
 *  Uses useState + useEffect to avoid hydration mismatch —
 *  always returns empty state on first render. */
export function useHubState(games: GameInfo[]): HubState {
	const [state, setState] = useState<HubState>(() => emptyHubState(games));

	useEffect(() => {
		function buildState(): HubState {
			const statuses = new Map<string, GameHubStatus>();
			let currentStreak = 0;
			let longestStreak = 0;
			let totalPlayed = 0;

			for (const game of games) {
				const getStatus = HUB_STATUS_PROVIDERS[game.id];
				const status = getStatus ? getStatus() : defaultStatus(game.id);
				statuses.set(game.id, status);
				currentStreak = Math.max(currentStreak, status.currentStreak);
				longestStreak = Math.max(longestStreak, status.longestStreak);
				totalPlayed += status.totalPlayed;
			}

			return {
				todayLabel: formatTodayBe(),
				statuses,
				currentStreak,
				longestStreak,
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
		statuses.set(game.id, defaultStatus(game.id));
	}
	return {
		todayLabel: "",
		statuses,
		currentStreak: 0,
		longestStreak: 0,
		totalPlayed: 0,
	};
}
