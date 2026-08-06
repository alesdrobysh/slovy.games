import {
	loadProgress,
	loadStats,
	purgeStalePreEpochProgress,
} from "@/games/valoshka/lib/storage";
import { pluralize } from "@/shared/lib/pluralize";
import { getMskDateString } from "@/shared/lib/timezone";
import type { GameHubStatus } from "@/shared/types";

export function getHubStatus(): GameHubStatus {
	purgeStalePreEpochProgress();

	const progress = loadProgress(getMskDateString());
	const stats = loadStats();

	if (progress?.vasiliokReached) {
		return {
			gameId: "valoshka",
			status: "won",
			progressText: "Усе словы знойдзены",
			currentStreak: stats.currentStreak,
			longestStreak: stats.longestStreak,
			totalPlayed: stats.datesPlayed.length,
		};
	}

	const foundWords = progress?.foundWords.length ?? 0;
	const inProgress = foundWords > 0;

	return {
		gameId: "valoshka",
		status: inProgress ? "in_progress" : "not_started",
		progressText: inProgress
			? `${foundWords} ${pluralize(foundWords, "слова")} знойдзена`
			: "Чакае вас",
		currentStreak: stats.currentStreak,
		longestStreak: stats.longestStreak,
		totalPlayed: stats.datesPlayed.length,
	};
}
