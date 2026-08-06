import {
	getCurrentDayIndex,
	getHistory,
	getStats,
	loadGameState,
} from "@/games/pobach/lib/storage";
import { pluralize } from "@/shared/lib/pluralize";
import type { GameCardStatus, GameHubStatus } from "@/shared/types";

export function getHubStatus(): GameHubStatus {
	const stats = getStats();
	const todayIndex = getCurrentDayIndex();
	const currentGame = loadGameState();
	const todayRecord = getHistory().find(
		(record) => record.dayIndex === todayIndex
	);

	const won = todayRecord?.won ?? currentGame?.won ?? false;
	const inProgress = !won && !!currentGame && !currentGame.gameOver;
	const guessCount = currentGame?.guesses.length ?? 0;

	let status: GameCardStatus = "not_started";
	let progressText = "Чакае вас";

	if (won) {
		status = "won";
		const attempts = todayRecord?.attempts ?? 0;
		progressText =
			attempts > 0
				? `Разгадана за ${attempts} ${pluralize(attempts, "спроба", "accusative")}`
				: "Разгадана";
	} else if (inProgress) {
		status = "in_progress";
		progressText =
			guessCount > 0
				? `Зроблена ${guessCount} ${pluralize(guessCount, "спроба")}`
				: "";
	}

	return {
		gameId: "pobach",
		status,
		progressText,
		currentStreak: stats.currentStreak,
		longestStreak: stats.maxStreak,
		totalPlayed: stats.gamesPlayed,
	};
}
