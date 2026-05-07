import type { GameStats, HistoryRecord } from "@/core/entities/game";
import { getCurrentDayIndex } from "@/lib/storage";

export function calculateStats(history: HistoryRecord[]): GameStats {
  const gamesPlayed = history.length;
  const gamesWon = history.filter((g) => g.won).length;
  const winRate = gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0;

  const { currentStreak, maxStreak } = calculateStreaks(history);

  const wonGames = history.filter((g) => g.won);
  const bestAttempts =
    wonGames.length > 0 ? Math.min(...wonGames.map((g) => g.attempts)) : 0; // Changed from null to 0 for consistency

  const distribution = calculateDistribution(wonGames);

  return {
    gamesPlayed,
    gamesWon,
    winRate,
    currentStreak,
    maxStreak,
    bestAttempts,
    distribution,
    lastPlayedDayIndex:
      history.length > 0 ? Math.max(...history.map((g) => g.dayIndex)) : 0,
  };
}

export function calculateStreaks(history: HistoryRecord[]): {
  currentStreak: number;
  maxStreak: number;
} {
  const today = getCurrentDayIndex();
  const sortedDays = [...history].sort((a, b) => b.dayIndex - a.dayIndex);

  // Current streak (consecutive wins from today backwards)
  let currentStreak = 0;
  for (let i = 0; i < sortedDays.length; i++) {
    const expectedDay = today - i;
    if (sortedDays[i].dayIndex !== expectedDay || !sortedDays[i].won) {
      break;
    }
    currentStreak++;
  }

  // Max streak
  let maxStreak = 0;
  let tempStreak = 0;
  let prevDay = -999;

  for (const game of sortedDays.reverse()) {
    if (game.won && game.dayIndex === prevDay + 1) {
      tempStreak++;
      maxStreak = Math.max(maxStreak, tempStreak);
    } else if (game.won) {
      tempStreak = 1;
      maxStreak = Math.max(maxStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
    prevDay = game.dayIndex;
  }

  return { currentStreak, maxStreak };
}

export function calculateDistribution(
  wonGames: HistoryRecord[],
): Record<number, number> {
  const distribution: Record<number, number> = {};

  for (const game of wonGames) {
    distribution[game.attempts] = (distribution[game.attempts] || 0) + 1;
  }

  return distribution;
}

function pluralizeDays(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) return "дзень";
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100))
    return "дні";
  return "дзён";
}

export function formatRelativeDate(dayIndex: number): string {
  const today = getCurrentDayIndex();
  const diff = today - dayIndex;

  if (diff === 0) return "Сёння";
  if (diff === 1) return "Учора";
  return `${diff} ${pluralizeDays(diff)} таму`;
}
