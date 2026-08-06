import { loadProgress, loadStats } from "@/games/sakretna/lib/storage";
import { pluralize } from "@/shared/lib/pluralize";
import { getMskDateString } from "@/shared/lib/timezone";
import type { GameCardStatus, GameHubStatus } from "@/shared/types";

export function getHubStatus(): GameHubStatus {
	const progress = loadProgress(getMskDateString());
	const stats = loadStats();

	let status: GameCardStatus = "not_started";
	let progressText = "Чакае вас";

	if (progress?.won) {
		status = "won";
		progressText = "Здагадана";
	} else if (progress?.givenUp) {
		status = "given_up";
		progressText = "Здаліся";
	} else if ((progress?.guesses.length ?? 0) > 0) {
		status = "in_progress";
		const foundLemmas = progress?.foundLemmas.length ?? 0;
		progressText = `Расшыфравана ${foundLemmas} ${pluralize(foundLemmas, "слова")}`;
	}

	return {
		gameId: "sakretna",
		status,
		progressText,
		currentStreak: stats.currentStreak,
		longestStreak: stats.longestStreak,
		totalPlayed: stats.totalPlayed,
	};
}
