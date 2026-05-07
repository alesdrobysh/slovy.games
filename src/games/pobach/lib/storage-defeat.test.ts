import type { HistoryRecord } from "@/games/pobach/core/entities/game";
import { calculateStats } from "./stats";

describe("Defeat Impact on Statistics", () => {
  it("should correctly calculate stats when defeat is added to history", () => {
    const history: HistoryRecord[] = [
      {
        dayIndex: 1,
        won: true,
        attempts: 2,
        bestRank: 1,
        completedAt: Date.now(),
        guesses: [],
      },
      {
        dayIndex: 2,
        won: true,
        attempts: 3,
        bestRank: 5,
        completedAt: Date.now(),
        guesses: [],
      },
      // Add defeat
      {
        dayIndex: 3,
        won: false,
        attempts: 20,
        bestRank: 150,
        completedAt: Date.now(),
        guesses: [],
      },
    ];

    const stats = calculateStats(history);

    // Games played should be 3
    expect(stats.gamesPlayed).toBe(3);

    // Games won should be 2 (not 3)
    expect(stats.gamesWon).toBe(2);

    // Win rate should be 2/3 ≈ 66.67%
    expect(stats.winRate).toBeCloseTo(66.67, 1);

    // Current streak should be 0 (ended by defeat)
    expect(stats.currentStreak).toBe(0);

    // Max streak should be 2
    expect(stats.maxStreak).toBe(2);

    // Distribution should only include won games
    expect(stats.distribution).toEqual({ 2: 1, 3: 1 }); // attempts: 2 and 3
  });

  it("should correctly calculate stats after defeat", () => {
    const history: HistoryRecord[] = [
      {
        dayIndex: 1,
        won: true,
        attempts: 2,
        bestRank: 1,
        completedAt: Date.now(),
        guesses: [],
      },
      {
        dayIndex: 2,
        won: true,
        attempts: 3,
        bestRank: 5,
        completedAt: Date.now(),
        guesses: [],
      },
      {
        dayIndex: 3,
        won: false,
        attempts: 20,
        bestRank: 150,
        completedAt: Date.now(),
        guesses: [],
      },
      {
        dayIndex: 4,
        won: true,
        attempts: 4,
        bestRank: 8,
        completedAt: Date.now(),
        guesses: [],
      },
    ];

    const stats = calculateStats(history);

    // Current streak is calculated from today backwards (would be 0 in test environment)
    // Max streak should be 2 (days 1-2)
    expect(stats.maxStreak).toBe(2);

    // Games played should be 4
    expect(stats.gamesPlayed).toBe(4);

    // Games won should be 3
    expect(stats.gamesWon).toBe(3);

    // Win rate should be 3/4 = 75%
    expect(stats.winRate).toBe(75);
  });
});
