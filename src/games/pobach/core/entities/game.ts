export interface Guess {
  word: string;
  rank: number;
  isHint?: boolean;
}

export interface CurrentGame {
  dayIndex: number;
  guesses: Guess[];
  startedAt: number;
  gameOver?: boolean;
  won?: boolean;
}

export interface HistoryRecord {
  dayIndex: number;
  won: boolean;
  attempts: number;
  bestRank: number;
  completedAt: number;
  guesses: Guess[];
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  bestAttempts: number;
  lastPlayedDayIndex: number;
  winRate: number;
  distribution: Record<number, number>;
}

export interface StorageV2 {
  version: 2;
  currentGame?: CurrentGame;
  history: Record<string, HistoryRecord>;
  stats: GameStats;
}

export interface ShareData {
  dayIndex: number;
  guesses: Guess[];
  won: boolean;
}

export interface TopWord {
  rank: number;
  word: string;
}

export type GameState = {
  dayIndex: number;
  secretWord: string;
};

export type GuessResult = {
  word: string;
  rank: number; // 1 is best
  similarity: number; // 0..1 (approx)
  isUnknown: boolean;
};
