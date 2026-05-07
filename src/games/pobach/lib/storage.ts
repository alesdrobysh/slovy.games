import type {
  CurrentGame,
  GameStats,
  Guess,
  HistoryRecord,
  StorageV2,
} from "@/core/entities/game";
import { calculateStats } from "@/lib/stats";

const STORAGE_KEY = "pobach_storage";

import { EPOCH_DATE } from "./config";

const SESSION_KEY = "pobach_session_id";

// Get current day index (same logic as backend)
export function getCurrentDayIndex(): number {
  const epoch = new Date(EPOCH_DATE);
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((now.getTime() - epoch.getTime()) / msPerDay);
}

// Initialize empty stats
function createEmptyStats(): GameStats {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    bestAttempts: 0,
    lastPlayedDayIndex: 0,
    winRate: 0,
    distribution: {},
  };
}

// Initialize empty storage v2 structure
function createEmptyStorageV2(): StorageV2 {
  return {
    version: 2,
    history: {},
    stats: createEmptyStats(),
  };
}

// Migrate from v1 to v2 format
export function migrateStorage(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      // No existing data, initialize new v2 structure
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createEmptyStorageV2()));
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(stored);
    } catch (e) {
      console.warn("Corrupted localStorage data, resetting:", e);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createEmptyStorageV2()));
      return;
    }

    // Check if already v2 format
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "version" in parsed &&
      parsed.version === 2
    ) {
      return;
    }

    // Migrate v1 to v2
    console.log("Migrating localStorage from v1 to v2");

    const v1Data = parsed as { dayIndex?: number; guesses?: Guess[] };
    const currentDayIndex = getCurrentDayIndex();

    let currentGame: CurrentGame | undefined;
    if (
      v1Data.dayIndex === currentDayIndex &&
      v1Data.guesses &&
      v1Data.guesses.length > 0
    ) {
      // Preserve current day's game
      currentGame = {
        dayIndex: v1Data.dayIndex,
        guesses: v1Data.guesses,
        startedAt: Date.now(),
      };
    }

    const v2Data: StorageV2 = {
      version: 2,
      currentGame,
      history: {},
      stats: createEmptyStats(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(v2Data));
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    // Reset to clean state on migration failure
    localStorage.setItem(STORAGE_KEY, JSON.stringify(createEmptyStorageV2()));
  }
}

// Load current game state
export function loadGameState(): CurrentGame | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: StorageV2 = JSON.parse(stored);
    if (data.version !== 2 || !data.currentGame) return null;

    const currentDayIndex = getCurrentDayIndex();
    if (data.currentGame.dayIndex !== currentDayIndex) {
      // Game is from a different day, clear it
      clearCurrentGame();
      return null;
    }

    return data.currentGame;
  } catch (error) {
    console.error("Failed to load game state:", error);
    return null;
  }
}

// Save current game state
export function saveGameState(state: CurrentGame): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const data: StorageV2 = JSON.parse(stored);
    if (data.version !== 2) return;

    data.currentGame = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save game state:", error);
  }
}

// Clear current game (when day changes or game ends)
export function clearCurrentGame(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const data: StorageV2 = JSON.parse(stored);
    if (data.version !== 2) return;

    data.currentGame = undefined;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to clear current game:", error);
  }
}

// Save completed game result to history and update stats
export function saveGameResult(
  dayIndex: number,
  won: boolean,
  attempts: number,
  bestRank: number,
  guesses: Guess[],
): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const data: StorageV2 = JSON.parse(stored);
    if (data.version !== 2) return;

    // Save to history
    const historyKey = dayIndex.toString();
    data.history[historyKey] = {
      dayIndex,
      won,
      attempts,
      bestRank,
      completedAt: Date.now(),
      guesses: guesses.slice(), // Copy the array
    };

    // Recalculate all stats from full history
    const historyRecords = Object.values(data.history);
    data.stats = calculateStats(historyRecords);

    // Update current game with completion state (don't clear it)
    if (data.currentGame) {
      data.currentGame.gameOver = true;
      data.currentGame.won = won;
      data.currentGame.guesses = guesses.slice();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save game result:", error);
  }
}

// Get current stats
export function getStats(): GameStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return createEmptyStats();

    const data: StorageV2 = JSON.parse(stored);
    if (data.version !== 2) return createEmptyStats();

    // Check if we need to recalculate stats (missing new fields)
    const stats = data.stats;
    if (stats.winRate === undefined || stats.distribution === undefined) {
      // Recalculate stats from history
      const historyRecords = Object.values(data.history);
      const recalculatedStats = calculateStats(historyRecords);

      // Update the stored data with recalculated stats
      data.stats = recalculatedStats;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      return recalculatedStats;
    }

    return stats;
  } catch (error) {
    console.error("Failed to get stats:", error);
    return createEmptyStats();
  }
}

// Clean up old history entries (useful after epoch changes)
export function cleanupOldHistoryEntries(oldDayIndices: number[]): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const data: StorageV2 = JSON.parse(stored);
    if (data.version !== 2 || !data.history) return;

    let cleaned = false;
    for (const dayIndex of oldDayIndices) {
      const historyKey = dayIndex.toString();
      if (data.history[historyKey]) {
        console.log(`Removing old history entry for day ${dayIndex}`);
        delete data.history[historyKey];
        cleaned = true;
      }
    }

    if (cleaned) {
      // Recalculate stats after cleanup
      const historyRecords = Object.values(data.history);
      data.stats = calculateStats(historyRecords);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log("✅ Cleaned up old history entries and recalculated stats");
    }
  } catch (error) {
    console.error("Failed to cleanup history:", error);
  }
}

// Get history records
export function getHistory(): HistoryRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const data: StorageV2 = JSON.parse(stored);
    if (data.version !== 2 || !data.history) return [];

    return Object.values(data.history).sort((a, b) => b.dayIndex - a.dayIndex);
  } catch (error) {
    console.error("Failed to get history:", error);
    return [];
  }
}

// Get or create session ID
export function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}
